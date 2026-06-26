import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const VALID_STATUSES = ["PENDING", "PRINTING", "READY", "DELIVERED", "CANCELLED"];

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
            design_files: true,
            chosen_value: {
              include: {
                option_value: {
                  include: {
                    option: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Clean Prisma Decimals for JSON serialization
    const serializedOrders = orders.map((order: any) => ({
      ...order,
      total_price: Number(order.total_price),
      items: order.items.map((item: any) => ({
        ...item,
        subtotal: Number(item.subtotal),
      })),
    }));

    return NextResponse.json({ success: true, orders: serializedOrders });
  } catch (error: any) {
    console.error("Failed to fetch admin orders:", error);
    return NextResponse.json(
      { success: false, message: "تعذر جلب الطلبات من قاعدة البيانات", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "رقم الطلب وحالته مطلوبان لتحديث الطلب." },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: `حالة الطلب غير صالحة. يجب أن تكون واحدة من: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status },
    });

    return NextResponse.json({
      success: true,
      order: {
        ...updatedOrder,
        total_price: Number(updatedOrder.total_price),
      },
    });
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { success: false, message: "فشل تحديث حالة الطلب.", error: error.message },
      { status: 500 }
    );
  }
}
