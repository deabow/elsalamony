import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "لم يتم اختيار أي ملف للرفع." },
        { status: 400 }
      );
    }

    // Convert file to buffer for Node.js stream upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // Automatically determines file format (PDF, PSD, AI, ZIP, images)
          folder: "elsalamony-uploads",
        },
        (error, uploadResult) => {
          if (error) {
            console.error("Cloudinary stream upload error:", error);
            reject(error);
          } else {
            resolve(uploadResult);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      message: "تم رفع الملف بنجاح.",
    });

  } catch (error: any) {
    console.error("File upload API failure:", error);
    return NextResponse.json(
      { success: false, message: "فشل رفع الملف إلى السيرفر السحابي.", error: error.message },
      { status: 500 }
    );
  }
}
