import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ALLOWED_ROLES = ["ADMIN", "DESIGNER", "ACCOUNTANT"];

async function verifyAuth() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;

  if (!session || !userRole || !ALLOWED_ROLES.includes(userRole)) {
    return NextResponse.json(
      { message: "غير مصرح لك بالوصول" },
      { status: 401 }
    );
  }
  return null;
}

// Zod Validation Schema
const createProductSchema = z.object({
  name: z.string().min(1, "اسم المنتج مطلوب"),
  description: z.string().default(""),
  base_price: z.number().positive("السعر الأساسي يجب أن يكون أكبر من صفر")
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/, "تنسيق السعر غير صحيح").transform(Number)),
  category: z.string().min(1, "التصنيف مطلوب"),
  options: z.array(
    z.object({
      name: z.string().min(1, "اسم الخيار مطلوب"),
      values: z.array(
        z.object({
          name: z.string().min(1, "اسم القيمة مطلوب"),
          price_modifier: z.number().or(z.string().transform(Number)),
        })
      ).default([])
    })
  ).default([]),
});

export async function POST(request: Request) {
  const authResponse = await verifyAuth();
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    
    // Validate request payload
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, description, base_price, category, options } = parsed.data;

    // Save to DB in a transaction using nested create
    const product = await prisma.product.create({
      data: {
        name,
        description,
        base_price: new Prisma.Decimal(base_price),
        category,
        options: {
          create: options.map((opt) => ({
            name: opt.name,
            values: {
              create: opt.values.map((val) => ({
                name: val.name,
                price_modifier: val.price_modifier,
              })),
            },
          })),
        },
      },
      include: {
        options: {
          include: {
            values: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { success: false, message: "فشل في حفظ المنتج الجديد في قاعدة البيانات", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        options: {
          include: {
            values: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { success: false, message: "فشل في جلب المنتجات", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authResponse = await verifyAuth();
  if (authResponse) return authResponse;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "معرف المنتج مطلوب" },
        { status: 400 }
      );
    }
    
    await prisma.product.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true, message: "تم حذف المنتج بنجاح" });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { success: false, message: "فشل في حذف المنتج من قاعدة البيانات", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const authResponse = await verifyAuth();
  if (authResponse) return authResponse;

  try {
    const body = await request.json();
    const { id, name, description, base_price, category } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "معرف المنتج مطلوب" },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (category !== undefined) dataToUpdate.category = category;
    if (base_price !== undefined) {
      dataToUpdate.base_price = new Prisma.Decimal(base_price);
    }

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: {
        options: {
          include: {
            values: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, message: "فشل في تحديث المنتج في قاعدة البيانات", error: error.message },
      { status: 500 }
    );
  }
}
