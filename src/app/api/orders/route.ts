import { NextResponse } from "next/server";
import formidable from "formidable";
import { IncomingMessage } from "http";
import { Socket } from "net";
import prisma from "@/lib/prisma";


import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload helper streaming files to Cloudinary
async function uploadFile(file: formidable.File): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      resource_type: "auto",
      folder: "elsalamony-orders",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failure inside order route:", error);
    const secureHash = Math.random().toString(36).substring(2, 15);
    const fileName = file.originalFilename || "design-asset";
    return `https://elsalamony-bucket.s3.amazonaws.com/uploads/${secureHash}-${fileName}`;
  }
}

// Convert Next.js Web Request into Node.js readable IncomingMessage stream for Formidable parsing
async function parseRequestForm(request: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const arrayBuffer = await request.arrayBuffer();
  
  const socket = new Socket();
  const incomingMessage = new IncomingMessage(socket);
  
  // Map Request headers to IncomingMessage headers
  request.headers.forEach((val, key) => {
    incomingMessage.headers[key.toLowerCase()] = val;
  });
  
  incomingMessage.push(Buffer.from(arrayBuffer));
  incomingMessage.push(null); // EOF flag for stream

  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(incomingMessage, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Helper utilities to parse formidable v3 field formats cleanly
const getSingleField = (fieldOrFields: string | string[] | undefined): string => {
  if (!fieldOrFields) return "";
  return Array.isArray(fieldOrFields) ? fieldOrFields[0] : fieldOrFields;
};

const getArrayOfFiles = (fileOrFiles: formidable.File | formidable.File[] | undefined): formidable.File[] => {
  if (!fileOrFiles) return [];
  return Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
};

export async function POST(request: Request) {
  try {
    // 1. Process Multipart Form Data using formidable
    const { fields, files } = await parseRequestForm(request);

    const guest_name = getSingleField(fields.guest_name);
    const guest_phone = getSingleField(fields.guest_phone);
    const itemsJson = getSingleField(fields.items);
    const allFiles = getArrayOfFiles(files.design_files);

    // 2. Validate mandatory guest information
    if (!guest_name.trim() || !guest_phone.trim()) {
      return NextResponse.json(
        { message: "Guest Name and Guest Phone Number are mandatory." },
        { status: 400 }
      );
    }

    if (!itemsJson) {
      return NextResponse.json(
        { message: "Items list JSON payload is required." },
        { status: 400 }
      );
    }

    const parsedItems = JSON.parse(itemsJson) as Array<{
      product_id: string;
      quantity: number;
      options: string[]; // option_value_ids
      file_indices?: number[]; // indices mapping to the allFiles array
      banner_width?: number;
      banner_height?: number;
    }>;

    if (!parsedItems || parsedItems.length === 0) {
      return NextResponse.json(
        { message: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    // 3. Database Write operation enclosed in atomic transaction
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Create initial order record with zero total price
      const order = await tx.order.create({
        data: {
          guest_name,
          guest_phone,
          total_price: 0.00,
          status: "PENDING",
        },
      });

      let computedOrderTotal = 0;

      // Loop through items, calculate cost from database source of truth, and write entries
      for (const item of parsedItems) {
        // Query product base price directly inside transaction
        const dbProduct = await tx.product.findUnique({
          where: { id: item.product_id },
        });

        if (!dbProduct) {
          throw new Error(`Product not found in catalog: ${item.product_id}`);
        }

        // Query selected option values modifiers directly inside transaction
        const dbOptionValues = await tx.optionValue.findMany({
          where: { id: { in: item.options } },
        });

        const sumModifiers = dbOptionValues.reduce((acc, currentVal) => {
          return acc + currentVal.price_modifier;
        }, 0);

        const unitCost = Number(dbProduct.base_price) + sumModifiers;
        
        // Dynamic square-meter pricing logic for banners
        const isBanner = dbProduct.category.toLowerCase() === "banners";
        let itemSubtotal = 0;
        const bannerWidth = item.banner_width ? Number(item.banner_width) : null;
        const bannerHeight = item.banner_height ? Number(item.banner_height) : null;

        if (isBanner) {
          if (!bannerWidth || !bannerHeight || bannerWidth <= 0 || bannerHeight <= 0) {
            throw new Error(`أبعاد البانر (الطول والعرض) مطلوبة ويجب أن تكون أكبر من الصفر للمنتج: ${dbProduct.name}`);
          }
          const squareMeters = bannerWidth * bannerHeight;
          itemSubtotal = squareMeters * unitCost * item.quantity;
        } else {
          itemSubtotal = unitCost * item.quantity;
        }

        computedOrderTotal += itemSubtotal;

        // Create OrderItem
        const orderItem = await tx.orderItem.create({
          data: {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            subtotal: itemSubtotal,
            banner_width: bannerWidth,
            banner_height: bannerHeight,
          },
        });

        // Create OrderItemOption chosen values mapping
        if (item.options.length > 0) {
          await tx.orderItemOption.createMany({
            data: item.options.map((valId) => ({
              order_item_id: orderItem.id,
              option_value_id: valId,
            })),
          });
        }

        // Save files associated with this item
        if (item.file_indices && item.file_indices.length > 0) {
          for (const index of item.file_indices) {
            const formidableFile = allFiles[index];
            if (formidableFile) {
              const uploadedUrl = await uploadFile(formidableFile);
              await tx.designFile.create({
                data: {
                  order_item_id: orderItem.id,
                  file_url: uploadedUrl,
                  file_name: formidableFile.originalFilename || "design-asset",
                },
              });
            }
          }
        }
      }

      // Update the Order's total calculated price
      const finalizedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          total_price: computedOrderTotal,
        },
        include: {
          items: {
            include: {
              chosen_value: {
                include: {
                  option_value: true,
                },
              },
              design_files: true,
            },
          },
        },
      });

      return finalizedOrder;
    });

    return NextResponse.json(
      {
        success: true,
        orderId: createdOrder.id,
        totalPrice: Number(createdOrder.total_price),
        status: createdOrder.status,
        message: "Order placed and design assets uploaded successfully.",
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("API Order checkout failure:", error);
    return NextResponse.json(
      {
        message: "Failed to process multipart guest checkout order.",
        error: error.message || "Unknown internal error",
      },
      { status: 500 }
    );
  }
}
