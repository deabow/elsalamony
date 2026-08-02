import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
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
    // ── Step 1: Parse multipart FormData ──────────────────────────────────────
    const formData = await request.formData();

    const guest_name  = (formData.get("guest_name")  as string || "").trim();
    const guest_phone = (formData.get("guest_phone") as string || "").trim();
    const itemsJson   = formData.get("items") as string || "";

    // Extract binary design files
    const rawFiles    = formData.getAll("design_files");
    const designFiles = rawFiles.filter((f): f is File => f instanceof File && f.size > 0);

    // ── Step 2: Validate mandatory fields ─────────────────────────────────────
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

    // ── Step 3: Upload files to Cloudinary (outside DB transaction) ───────────
    // Network I/O must never run inside a database transaction to avoid
    // holding locks for an unnecessarily long time.
    const uploadedFiles: Array<{ url: string; name: string }> = await Promise.all(
      designFiles.map((file) => uploadFileToCloudinary(file))
    );

    // ── Step 4: Batch-fetch all required DB records in 2 queries ──────────────
    // Collect unique IDs across all items so we can fetch in one round-trip each.
    const allProductIds    = [...new Set(parsedItems.map((i) => i.product_id))];
    const allOptionValueIds = [...new Set(parsedItems.flatMap((i) => i.options))];

    const [dbProducts, dbOptionValues] = await Promise.all([
      prisma.product.findMany({
        where: { id: { in: allProductIds } },
        select: { id: true, name: true, base_price: true, category: true },
      }),
      allOptionValueIds.length > 0
        ? prisma.optionValue.findMany({
            where: { id: { in: allOptionValueIds } },
            select: { id: true, price_modifier: true },
          })
        : Promise.resolve([]),
    ]);

    // Build lookup Maps for O(1) access inside the computation loop below.
    const productMap     = new Map(dbProducts.map((p) => [p.id, p]));
    const optionValueMap = new Map(dbOptionValues.map((v) => [v.id, v]));

    // ── Step 5: Validate products & compute subtotals (pure in-memory) ────────
    // This loop does ZERO database calls — it only reads from the Maps above.
    let computedOrderTotal = 0;

    // Build the complete nested-write payload for Prisma in one pass.
    const itemsCreatePayload: Prisma.OrderItemCreateWithoutOrderInput[] = parsedItems.map((item) => {
      const dbProduct = productMap.get(item.product_id);
      if (!dbProduct) {
        throw new Error(`المنتج غير موجود في الكتالوج: ${item.product_id}`);
      }

      // Resolve each option value and sum the price modifiers.
      const modifierSum = item.options.reduce((acc, valId) => {
        const optVal = optionValueMap.get(valId);
        return acc + (optVal?.price_modifier ?? 0);
      }, 0);

      const unitCost = Number(dbProduct.base_price) + modifierSum;

      // Banner: price scales with area (width × height in metres) × quantity.
      const isBanner     = dbProduct.category.toLowerCase() === "banners";
      const bannerWidth  = item.banner_width  ? Number(item.banner_width)  : null;
      const bannerHeight = item.banner_height ? Number(item.banner_height) : null;

      let itemSubtotal: number;
      if (isBanner) {
        if (!bannerWidth || !bannerHeight || bannerWidth <= 0 || bannerHeight <= 0) {
          throw new Error(
            `أبعاد البانر (الطول والعرض) مطلوبة ويجب أن تكون أكبر من الصفر للمنتج: ${dbProduct.name}`
          );
        }
        itemSubtotal = bannerWidth * bannerHeight * unitCost * item.quantity;
      } else {
        itemSubtotal = unitCost * item.quantity;
      }

      computedOrderTotal += itemSubtotal;

      // Resolve design files for this item from the pre-uploaded Cloudinary URLs.
      const designFilesForItem =
        item.file_indices && item.file_indices.length > 0
          ? item.file_indices
              .map((idx) => uploadedFiles[idx])
              .filter((f): f is { url: string; name: string } => Boolean(f))
          : [];

      // Return a fully-formed Prisma nested create object for this item.
      return {
        product:      { connect: { id: item.product_id } },
        quantity:     item.quantity,
        subtotal:     itemSubtotal,
        banner_width: bannerWidth,
        banner_height: bannerHeight,
        // Nested relation: selected option values (join table)
        chosen_value: {
          create: item.options.map((valId) => ({
            option_value: { connect: { id: valId } },
          })),
        },
        // Nested relation: uploaded design files
        design_files: {
          create: designFilesForItem.map((f) => ({
            file_url:  f.url,
            file_name: f.name,
          })),
        },
      };
    });

    // ── Step 6: Single atomic transaction — 1 write statement ─────────────────
    // The entire order (header + all items + options + files) is created
    // in one prisma.order.create() call using Prisma's nested writes.
    // This replaces the previous 5N+2 sequential awaits inside the loop.
    const createdOrder = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      return tx.order.create({
        data: {
          guest_name,
          guest_phone,
          total_price: computedOrderTotal,
          status: "PENDING",
          items: {
            create: itemsCreatePayload,
          },
        },
        // Return the full order graph so the response is immediately useful.
        select: {
          id:          true,
          status:      true,
          total_price: true,
        },
      });
    });

    return NextResponse.json(
      {
        success:    true,
        orderId:    createdOrder.id,
        totalPrice: Number(createdOrder.total_price),
        status:     createdOrder.status,
        message:    "تم استلام الطلب بنجاح وتم رفع ملفات التصميم.",
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطأ داخلي غير متوقع";
    console.error("API Order checkout failure:", error);
    return NextResponse.json(
      {
        message: "فشل في معالجة طلب الخدمة وتنفيذ العملية.",
        error: message,
      },
      { status: 500 }
    );
  }
}
