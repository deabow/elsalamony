import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import PriceCalculator from "@/components/store/price-calculator";
import ProductGallery from "@/components/store/product-gallery";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";

// Mock Fallbacks for catalog configurations
const PRODUCT_FALLBACKS: Record<string, {
  name: string;
  description: string;
  basePrice: number;
  sku: string;
  images?: string[];
  options: Array<{
    name: string;
    isRequired: boolean;
    values: Array<{ value: string; priceModifier: number }>;
  }>;
}> = {
  "business-cards": {
    name: "Premium Business Cards",
    description: "Ultra-thick cardstock with custom matte, gloss, or velvet lamination and optional gold foil stamping.",
    basePrice: 150.00,
    sku: "PRT-BC-001",
    options: [
      {
        name: "Material",
        isRequired: true,
        values: [
          { value: "Standard Card 350g", priceModifier: 0.00 },
          { value: "Premium Matte Card 400g", priceModifier: 30.00 },
          { value: "Sleek Glossy Vinyl", priceModifier: 50.00 },
          { value: "Velvet Soft-Touch Luxury", priceModifier: 80.00 },
        ]
      },
      {
        name: "Size",
        isRequired: true,
        values: [
          { value: "Standard (8.5x5.5cm)", priceModifier: 0.00 },
          { value: "Square (6x6cm)", priceModifier: 20.00 },
          { value: "Mini (7x3cm)", priceModifier: 10.00 },
        ]
      },
      {
        name: "Lamination",
        isRequired: true,
        values: [
          { value: "None", priceModifier: 0.00 },
          { value: "Matte Lamination", priceModifier: 20.00 },
          { value: "Gloss Lamination", priceModifier: 20.00 },
          { value: "Luxury Spot UV", priceModifier: 70.00 },
        ]
      },
      {
        name: "Foil Stamping",
        isRequired: false,
        values: [
          { value: "None", priceModifier: 0.00 },
          { value: "Gold Foil Accents", priceModifier: 110.00 },
          { value: "Silver Foil Accents", priceModifier: 110.00 },
        ]
      }
    ]
  },
  "corporate-logbooks": {
    name: "Custom Corporate Logbooks",
    description: "Hardcover printed logbooks, registers, and notebooks tailored with company logo and custom grid configurations.",
    basePrice: 450.00,
    sku: "PRT-LB-002",
    options: [
      {
        name: "Cover Type",
        isRequired: true,
        values: [
          { value: "Softcover Glossy Accent", priceModifier: 0.00 },
          { value: "Hardcover Fabric Binding", priceModifier: 120.00 },
          { value: "Leatherette Hardcover Embossed", priceModifier: 180.00 },
        ]
      },
      {
        name: "Inner Sheets Style",
        isRequired: true,
        values: [
          { value: "Standard Ruled", priceModifier: 0.00 },
          { value: "Blank Sketch Paper", priceModifier: 15.00 },
          { value: "Custom Grid Blueprint", priceModifier: 40.00 },
        ]
      },
      {
        name: "Sheet Count",
        isRequired: true,
        values: [
          { value: "100 Pages", priceModifier: 0.00 },
          { value: "200 Pages", priceModifier: 50.00 },
          { value: "300 Pages", priceModifier: 110.00 },
        ]
      }
    ]
  },
  "rollups-banners": {
    name: "Retractable Roll-up Banners",
    description: "Durable aluminum base with vivid color printing on premium non-curl vinyl film.",
    basePrice: 650.00,
    sku: "PRT-RU-003",
    options: [
      {
        name: "Base Stand Mechanism",
        isRequired: true,
        values: [
          { value: "Standard Economy Aluminum", priceModifier: 0.00 },
          { value: "Heavy-Duty Broadfoot Premium", priceModifier: 150.00 },
          { value: "Luxury Teardrop Base Chrome", priceModifier: 290.00 },
        ]
      },
      {
        name: "Banner Dimensions",
        isRequired: true,
        values: [
          { value: "85x200cm Standard", priceModifier: 0.00 },
          { value: "100x200cm Medium", priceModifier: 140.00 },
          { value: "120x200cm Large", priceModifier: 280.00 },
        ]
      }
    ]
  },
  "safety-signage": {
    name: "Industrial Safety Signs",
    description: "Heavy-duty PVC or aluminum backing signs with UV-resistant inks for factories and warehouses.",
    basePrice: 120.00,
    sku: "PRT-SS-004",
    options: [
      {
        name: "Backing Plate",
        isRequired: true,
        values: [
          { value: "Foam board 5mm", priceModifier: 0.00 },
          { value: "Rigid PVC Board 8mm", priceModifier: 40.00 },
          { value: "Galvanized Steel Sheet", priceModifier: 120.00 },
          { value: "Anodized Aluminum Backing", priceModifier: 180.00 },
        ]
      },
      {
        name: "Dimensions",
        isRequired: true,
        values: [
          { value: "30x40cm Standard", priceModifier: 0.00 },
          { value: "50x70cm Medium", priceModifier: 60.00 },
          { value: "80x120cm Large Warehouse", priceModifier: 190.00 },
        ]
      },
      {
        name: "Night Visibility",
        isRequired: false,
        values: [
          { value: "Standard Ink Matt Finish", priceModifier: 0.00 },
          { value: "Semi-Reflective Coating", priceModifier: 50.00 },
          { value: "High-Intensity Reflective Film", priceModifier: 130.00 },
        ]
      }
    ]
  }
};

type Params = Promise<{ id: string }>;

interface PageProps {
  params: Params;
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
    console.error("Database lookup failed, using fallback:", error);
  }

  // Load static configurations if database has no records or failed
  if (!product && PRODUCT_FALLBACKS[id]) {
    const fallback = PRODUCT_FALLBACKS[id];
    product = {
      id: id,
      name: fallback.name,
      description: fallback.description,
      basePrice: fallback.basePrice,
      sku: fallback.sku,
      images: fallback.images || [],
      category: id === "rollups-banners" ? "banners" : "other",
      options: fallback.options.map((opt, oIdx) => ({
        id: `opt-${oIdx}`,
        name: opt.name,
        isRequired: opt.isRequired,
        values: opt.values.map((v, vIdx) => ({
          id: `val-${oIdx}-${vIdx}`,
          value: v.value,
          priceModifier: v.priceModifier
        }))
      }))
    };
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
