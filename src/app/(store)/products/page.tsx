import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";
import ProductsCatalogClient from "@/components/store/products-catalog-client";
import { Sparkles, Printer, ArrowLeft } from "lucide-react";

export const revalidate = 0; // Fresh DB data on every request

export default async function ProductsCatalogPage() {
  let products: Array<{
    id: string;
    name: string;
    description: string;
    basePrice: number;
    category: string;
    images: string[];
    optionsCount: number;
  }> = [];

  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        options: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        basePrice: Number(p.base_price),
        category: p.category,
        images: p.images || [],
        optionsCount: p.options.length,
      }));
    }
  } catch (error) {
    console.error("Failed to query DB products for catalog page:", error);
  }



  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh" }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        padding: "80px 0 60px",
        background: `
          radial-gradient(ellipse 60% 50% at 50% 40%, rgba(245,184,55,0.09) 0%, transparent 65%),
          radial-gradient(ellipse 40% 40% at 85% 20%, rgba(26,44,90,0.6) 0%, transparent 60%)
        `,
        borderBottom: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <div className="container">
          <div className="badge badge-gold" style={{ marginBottom: "18px", gap: "6px" }}>
            <Sparkles size={15} />
            <span>كتالوج المنتجات والخدمات المتاحة</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 54px)", fontFamily: "var(--font-heading)", marginBottom: "16px", lineHeight: 1.25 }}>
            تصفح منتجات <span className="gradient-gold-text">مطبعة السلاموني</span>
          </h1>
          <div className="arabic-divider" style={{ color: "var(--gold-400)", maxWidth: "280px", margin: "0 auto 20px" }}>
            <span>◆</span>
          </div>
          <p style={{ color: "var(--foreground-muted)", fontSize: "17px", maxWidth: "680px", margin: "0 auto", lineHeight: 1.85 }}>
            جميع منتجاتنا مربوطة بحاسبة أسعار آلية ومباشرة — اختر المنتج المطلوب، اضبط الكميات والخيارات، واطلب فوراً.
          </p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Interactive Products Grid Section */}
      <section className="section" style={{ flex: 1 }}>
        <div className="container">
          <ProductsCatalogClient initialProducts={products} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
