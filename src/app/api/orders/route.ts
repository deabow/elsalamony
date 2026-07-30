import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface ParsedItem {
  product_id: string;
  quantity: number;
  options: string[]; // option_value_ids
  file_indices?: number[]; // indices mapping to the uploaded design_files array
  banner_width?: number;
  banner_height?: number;
}

/**
 * Upload helper streaming Web API File to Cloudinary.
 * Executed OUTSIDE database transactions.
 */
async function uploadFileToCloudinary(file: File): Promise<{ url: string; name: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "elsalamony-orders",
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload_stream error:", error);
          reject(error || new Error("فشل رفع الملف إلى Cloudinary"));
        } else {
          resolve({
            url: result.secure_url,
            name: file.name || "design-asset",
          });
        }
      }
    ).end(buffer);
  });
}

export async function POST(request: Request) {
  try {
    // 1. Process Multipart Form Data natively using Web Request API
    const formData = await request.formData();

    const guest_name = (formData.get("guest_name") as string || "").trim();
    const guest_phone = (formData.get("guest_phone") as string || "").trim();
    const itemsJson = formData.get("items") as string || "";

    // Extract binary files from FormData
    const rawFiles = formData.getAll("design_files");
    const designFiles: File[] = rawFiles.filter((f): f is File => f instanceof File && f.size > 0);

    // 2. Validate mandatory guest & payload information
    if (!guest_name || !guest_phone) {
      return NextResponse.json(
        { message: "اسم العميل ورقم الهاتف مطلوبان لاستكمال الطلب." },
        { status: 400 }
      );
    }

    if (!itemsJson) {
      return NextResponse.json(
        { message: "بيانات عناصر الطلب (JSON) مطلوبة." },
        { status: 400 }
      );
    }

    let parsedItems: ParsedItem[] = [];
    try {
      parsedItems = JSON.parse(itemsJson) as ParsedItem[];
    } catch {
      return NextResponse.json(
        { message: "صيغة عناصر الطلب (JSON) غير صالحة." },
        { status: 400 }
      );
    }

    if (!parsedItems || parsedItems.length === 0) {
      return NextResponse.json(
        { message: "يجب أن يحتوي الطلب على عنصر واحد على الأقل." },
        { status: 400 }
      );
    }

    // 3. NETWORK STEP (OUTSIDE DATABASE TRANSACTION)
    // Upload all files asynchronously to Cloudinary before touching Prisma
    const uploadedFiles: Array<{ url: string; name: string }> = await Promise.all(
      designFiles.map((file) => uploadFileToCloudinary(file))
    );

    // 4. DATABASE STEP (FAST ATOMIC TRANSACTION)
    const createdOrder = await prisma.$transaction(async (tx: any) => {
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

      for (const item of parsedItems) {
        // Query product base price directly inside transaction
        const dbProduct = await tx.product.findUnique({
          where: { id: item.product_id },
        });

        if (!dbProduct) {
          throw new Error(`المنتج غير موجود في الكتالوج: ${item.product_id}`);
        }

        // Query selected option values modifiers
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
        if (item.options && item.options.length > 0) {
          await tx.orderItemOption.createMany({
            data: item.options.map((valId) => ({
              order_item_id: orderItem.id,
              option_value_id: valId,
            })),
          });
        }

        // Create DesignFile records using pre-uploaded Cloudinary URLs
        if (item.file_indices && item.file_indices.length > 0) {
          const designFilesData = item.file_indices
            .map((idx) => uploadedFiles[idx])
            .filter((f): f is { url: string; name: string } => Boolean(f))
            .map((f) => ({
              order_item_id: orderItem.id,
              file_url: f.url,
              file_name: f.name,
            }));

          if (designFilesData.length > 0) {
            await tx.designFile.createMany({
              data: designFilesData,
            });
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
        message: "فشل في معالجة طلب الخدمة وتنفيذ العملية.",
        error: error.message || "Unknown internal error",
      },
      { status: 500 }
    );
  }
}
