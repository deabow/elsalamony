import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ALLOWED_ROLES = ["ADMIN", "DESIGNER", "ACCOUNTANT"];

async function verifyAuth() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  if (!session || !userRole || !ALLOWED_ROLES.includes(userRole)) {
    return NextResponse.json(
      { success: false, message: "غير مصرح لك بالوصول" },
      { status: 401 }
    );
  }
  return null;
}

const updatePaymentSchema = z.object({
  orderId: z.string().min(1, "معرف الطلب مطلوب"),
  newStatus: z.enum(["PENDING_PAYMENT", "VERIFYING", "PAID", "FAILED"]),
});

export async function GET() {
  const authResponse = await verifyAuth();
  if (authResponse) return authResponse;

  try {
    const orders = await prisma.order.findMany({
      take: 100,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        guest_name: true,
        guest_phone: true,
        payment_status: true,
        total_price: true,
        created_at: true,
      },
    });

    const payments = orders.map((order) => ({
      id: order.id,
      orderId: order.id,
      customerName: order.guest_name,
      customerPhone: order.guest_phone,
      amount: Number(order.total_price),
      paymentStatus: order.payment_status,
      submittedAt: order.created_at.toISOString(),
    }));

    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    console.error("Failed to fetch payments:", error);
    return NextResponse.json(
      { success: false, message: "فشل في جلب سجلات المدفوعات", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const authResponse = await verifyAuth();
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const parsed = updatePaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "بيانات غير صالحة", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { orderId, newStatus } = parsed.data;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { payment_status: newStatus },
      select: {
        id: true,
        payment_status: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      paymentStatus: updatedOrder.payment_status,
      message: "تم تحديث حالة الدفع بنجاح",
    });
  } catch (error: any) {
    console.error("Failed to update payment status:", error);
    return NextResponse.json(
      { success: false, message: "فشل في تحديث حالة الدفع في قاعدة البيانات", error: error.message },
      { status: 500 }
    );
  }
}
