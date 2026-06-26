import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const phone = searchParams.get("phone");

    if (!orderId || !phone) {
      return NextResponse.json(
        { message: "رقم الطلب ورقم التليفون مطلوبان لتتبع الطلب." },
        { status: 400 }
      );
    }

    let order = null;

    try {
      // 1. Verify if the order exists by ID first (security audit checks)
      const orderExists = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (orderExists) {
        // 2. Strict validation: If order exists but phone number does not match, block it immediately
        if (orderExists.guest_phone !== phone) {
          return NextResponse.json(
            { message: "رقم الطلب أو التليفون غلط. يرجى التأكد وإعادة المحاولة." },
            { status: 401 }
          );
        }

        // 3. Fetch full order relational details
        const dbOrder = await prisma.order.findFirst({
          where: {
            id: orderId,
            guest_phone: phone
          },
          include: {
            items: {
              include: {
                product: true,
                chosen_value: {
                  include: {
                    option_value: true
                  }
                },
                design_files: true
              }
            }
          }
        });

        if (dbOrder) {
          order = {
            id: dbOrder.id,
            customerName: dbOrder.guest_name,
            customerPhone: dbOrder.guest_phone,
            status: dbOrder.status,
            totalPrice: Number(dbOrder.total_price),
            createdAt: dbOrder.created_at.toISOString(),
            items: dbOrder.items.map(item => ({
              id: item.id,
              product: {
                name: item.product?.name || "مطبوعات مخصصة",
                sku: item.product?.id ? "PRT-CUST-" + item.product.id.substring(0, 5) : "PRT-CUST-999"
              },
              quantity: item.quantity,
              subtotal: Number(item.subtotal),
              selectedOptions: item.chosen_value.map(cv => ({
                optionName: cv.option_value?.name || "خيار",
                valueName: cv.option_value?.name || "قيمة"
              })),
              designFiles: item.design_files.map(file => ({
                fileName: file.file_name,
                url: file.file_url
              }))
            }))
          };
        }
      }
    } catch (dbErr) {
      console.warn("Database lookup failed or table doesn't exist yet, checking fallback mockup dataset:", dbErr);
    }

    // Prototyping mock fallback if database is empty/not linked yet
    if (!order) {
      // Simulate static data lookup for demo/testing purposes
      const mockOrderId = "ord-8372";
      const mockPhone = "01020243667";

      if (orderId === mockOrderId && phone === mockPhone) {
        order = {
          id: mockOrderId,
          customerName: "عميل تجريبي",
          customerPhone: mockPhone,
          status: "PRINTING", // active progress for demo
          totalPrice: 270.00,
          createdAt: new Date().toISOString(),
          items: [
            {
              id: "item-1",
              product: { name: "Premium Business Cards (كروت شخصية)", sku: "PRT-BC-001" },
              quantity: 100,
              subtotal: 220.00,
              selectedOptions: [
                { optionName: "Material", valueName: "Premium Matte Card 400g" },
                { optionName: "Size", valueName: "Standard (8.5x5.5cm)" }
              ],
              designFiles: [
                { fileName: "business_card_front_v2.pdf", url: "#" },
                { fileName: "business_card_back_v2.png", url: "#" }
              ]
            }
          ]
        };
      }
    }

    if (!order) {
      return NextResponse.json(
        { message: "رقم الطلب أو التليفون غلط. يرجى التأكد وإعادة المحاولة." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Order tracking lookup error:", error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي في السيرفر أثناء جلب بيانات التتبع." },
      { status: 500 }
    );
  }
}
