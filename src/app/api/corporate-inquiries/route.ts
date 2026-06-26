import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const EGYPT_PHONE_REGEX = /^01[0125]\d{8}$/;

const inquirySchema = z.object({
  company_name: z.string().min(2, "اسم الشركة يجب أن يكون حرفين على الأقل."),
  contact_person: z.string().min(2, "اسم الشخص المسؤول يجب أن يكون حرفين على الأقل."),
  phone: z.string().regex(EGYPT_PHONE_REGEX, "رقم الهاتف يجب أن يكون رقم موبايل مصري صحيح مكون من 11 رقمًا."),
  email: z.string().email("البريد الإلكتروني غير صحيح.").optional().or(z.literal("")),
  details: z.string().min(10, "تفاصيل الطلب يجب أن تكون 10 أحرف على الأقل."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input via Zod
    const validation = inquirySchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "بيانات المدخلات غير صالحة.";
      return NextResponse.json(
        { success: false, message: firstError, errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { company_name, contact_person, phone, email, details } = validation.data;

    // Write to PostgreSQL database using Prisma
    const inquiry = await prisma.corporateInquiry.create({
      data: {
        company_name,
        contact_person,
        phone,
        email: email || "",
        details,
      },
    });

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      message: "تم استلام طلبك، هنتواصل معاك في أسرع وقت.",
    }, { status: 201 });

  } catch (error: any) {
    console.error("Corporate inquiry submission error:", error);
    return NextResponse.json(
      { success: false, message: "فشل إرسال طلب الشركة. يرجى المحاولة مرة أخرى لاحقاً." },
      { status: 500 }
    );
  }
}
