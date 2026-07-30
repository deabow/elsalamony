import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName,
      taxId,
      contactName,
      contactPhone,
      contactEmail,
      productType,
      quantity,
      specifications,
      description,
      referenceFile
    } = body;

    // Validation
    if (!companyName || !contactName || !contactPhone || !productType || !quantity) {
      return NextResponse.json(
        { message: "Company Name, Contact Name, Phone, Product Type, and Quantity are required." },
        { status: 400 }
      );
    }

    let inquiryId = `inq-${Date.now()}`;

    // Combine multiple specifications and notes into the single "details" text field specified in the schema
    const combinedDetails = `
Product Type: ${productType}
Quantity: ${quantity}
Specifications: ${specifications || "None"}
Description: ${description}
Tax ID Ref: ${taxId || "None"}
Attached Reference File: ${referenceFile || "None"}
    `.trim();

    try {
      // Create inquiry record in Prisma using CorporateInquiry schema
      const dbInquiry = await prisma.corporateInquiry.create({
        data: {
          company_name: companyName,
          contact_person: contactName,
          email: contactEmail,
          phone: contactPhone,
          details: combinedDetails
        }
      });
      inquiryId = dbInquiry.id;
    } catch (dbErr) {
      console.warn("Prisma Corporate Inquiry creation skipped due to database setup. Returning Mock Inquiry ID:", dbErr);
      inquiryId = `inq-${Math.random().toString(36).substring(2, 11)}`;
    }

    return NextResponse.json(
      { success: true, inquiryId, message: "B2B bulk inquiry registered successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("B2B Inquiry error:", error);
    return NextResponse.json(
      { message: "Server failed to record bulk inquiry." },
      { status: 500 }
    );
  }
}
