import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import PriceCalculator from "@/components/store/price-calculator";
import ProductGallery from "@/components/store/product-gallery";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";

import type { Metadata } from "next";

type Params = Promise<{ id: string }>;

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { id },
      select: { name: true, description: true, category: true, images: true, base_price: true }
    });

    if (dbProduct) {
      const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://elsalamony.com";
      const title = `${dbProduct.name} | مطبعة السلاموني للمطبوعات`;
      const description = `${dbProduct.description || dbProduct.name} — طباعة عالية الجودة بمدينة السادات والإسكندرية مع حاسبة تسعير فورية بأسعار تبدأ من ${Number(dbProduct.base_price).toFixed(2)} ج.م.`;
      const images = dbProduct.images && dbProduct.images.length > 0 ? [dbProduct.images[0]] : ["/logo.jpeg"];

      return {
        title,
        description,
        keywords: [dbProduct.name, dbProduct.category, "المطبوعات", "مطبعة", "طباعة", "مطبعة السلاموني", "مدينة السادات", "الإسكندرية"],
        openGraph: {
          title,
          description,
          url: `${siteUrl}/products/${id}`,
          siteName: "مطبعة السلاموني للمطبوعات",
          images,
          type: "website",
          locale: "ar_EG"
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images,
        }
      };
    }
  } catch (err) {
    console.error("Metadata generation failed:", err);
  }

  return {
    title: "منتج مطبعة السلاموني | المطبوعات والدعاية",
    description: "تصفح مواصفات وأسعار المطبوعات مع مطبعة السلاموني بمدينة السادات والإسكندرية."
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  let product: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    category: string;
    sku: string;
    images?: string[];
    options: any[];
  } | null = null;

  try {
    // Try querying the PostgreSQL Database using Prisma Client
    const dbProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            values: true
          }
        }
      }
    });

    if (dbProduct) {
      product = {
        id: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description,
        basePrice: Number(dbProduct.base_price),
        category: dbProduct.category,
        sku: "PRT-CUST-" + dbProduct.id.substring(0, 5),
        images: dbProduct.images || [],
        options: dbProduct.options.map((opt: any) => ({
          id: opt.id,
          name: opt.name,
          isRequired: true,
          values: opt.values.map((v: any) => ({
            id: v.id,
            value: v.name,
            priceModifier: Number(v.price_modifier)
          }))
        }))
      };
    }
  } catch (error) {
    console.error("Database lookup failed:", error);
  }



  if (!product) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <div className="container section" style={{ textAlign: "center", flex: 1, padding: "80px 24px" }}>
          <h2 style={{ fontSize: "28px", fontFamily: "var(--font-heading)", color: "var(--gold-400)", marginBottom: "12px" }}>
            المنتج غير موجود في الكتالوج
          </h2>
          <p style={{ color: "var(--foreground-muted)", marginBottom: "24px" }}>
            عذراً، المنتج المطلوب غير متوفر حالياً أو تم حذفه من كتالوج المطبوعات.
          </p>
          <Link href="/" className="btn btn-gold">العودة للكتالوج الرئيسي</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh" }}>
      <Header />

      {/* Mini Breadcrumbs Nav Header */}
      <header style={{
        background: "rgba(9, 11, 16, 0.4)",
        borderBottom: "1px solid var(--border)",
        padding: "16px 0"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "8px", fontSize: "14px", color: "var(--foreground-subtle)" }}>
            <Link href="/">كتالوج مطبعة السلاموني</Link>
            <span>/</span>
            <span style={{ color: "var(--gold-400)", fontWeight: 600 }}>{product.name}</span>
          </div>
          <Link href="/" style={{ fontSize: "13.5px", color: "var(--gold-400)" }}>← العودة للرئيسية</Link>
        </div>
      </header>

      {/* Main product setup workspace */}
      <main className="section" style={{ flex: 1 }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          {/* Product Title Header */}
          <div className="animate-in">
            <span className="badge badge-gold" style={{ marginBottom: "12px" }}>كود المنتج: {product.sku}</span>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontFamily: "var(--font-heading)", lineHeight: 1.25 }}>{product.name}</h1>
            <p style={{ color: "var(--foreground-muted)", maxWidth: "760px", marginTop: "10px", fontSize: "16px", lineHeight: 1.8 }}>
              {product.description}
            </p>
          </div>

          {/* Top Section Split: Interactive Gallery + Price Calculator */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            alignItems: "flex-start"
          }}>
            {/* Gallery Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Price Calculator Column */}
            <div>
              <PriceCalculator product={product} />
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
