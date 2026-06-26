import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import PriceCalculator from "@/components/store/price-calculator";

// Mock Fallbacks for catalog configurations
const PRODUCT_FALLBACKS: Record<string, {
  name: string;
  description: string;
  basePrice: number;
  sku: string;
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
    description: "High-resolution printed roll-up stands with premium aluminum base, including carrying bag.",
    basePrice: 850.00,
    sku: "PRT-RU-003",
    options: [
      {
        name: "Base Base Stand",
        isRequired: true,
        values: [
          { value: "Aluminum Eco Stand", priceModifier: 0.00 },
          { value: "Heavy-Duty Chrome Base", priceModifier: 250.00 },
          { value: "Double-Sided Display", priceModifier: 500.00 },
        ]
      },
      {
        name: "Dimensions",
        isRequired: true,
        values: [
          { value: "85x200cm", priceModifier: 0.00 },
          { value: "100x200cm", priceModifier: 150.00 },
          { value: "120x200cm", priceModifier: 280.00 },
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
  
  let product = null;

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
      // Map Decimal fields to raw numbers for client-side serialization
      product = {
        id: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description,
        basePrice: Number(dbProduct.base_price),
        category: dbProduct.category,
        sku: "PRT-CUST-" + dbProduct.id.substring(0, 5),
        options: dbProduct.options.map((opt) => ({
          id: opt.id,
          name: opt.name,
          isRequired: true,
          values: opt.values.map((v) => ({
            id: v.id,
            value: v.name,
            priceModifier: Number(v.price_modifier)
          }))
        }))
      };
    }
  } catch (error) {
    console.error("Database connection was skipped or failed. Relying on fallback mockup config:", error);
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
      <div className="container section" style={{ textAlign: "center" }}>
        <h2>Product Not Found</h2>
        <p style={{ color: "var(--muted)", margin: "16px 0" }}>The requested printing product catalog item does not exist.</p>
        <Link href="/" className="btn btn-secondary">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* Mini Breadcrumbs Nav Header */}
      <header style={{
        background: "rgba(9, 11, 16, 0.4)",
        borderBottom: "1px solid var(--border)",
        padding: "16px 0"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "8px", fontSize: "14px", color: "var(--muted)" }}>
            <Link href="/">Elsalamony Store</Link>
            <span>/</span>
            <span style={{ color: "var(--foreground)" }}>{product.name}</span>
          </div>
          <Link href="/" style={{ fontSize: "14px", color: "var(--primary)" }}>← Back to Catalog</Link>
        </div>
      </header>

      {/* Main product setup workspace */}
      <main className="section">
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          <div className="animate-fade-in">
            <span className="badge badge-printing" style={{ marginBottom: "12px" }}>{product.sku}</span>
            <h1 style={{ fontSize: "38px", fontFamily: "var(--font-heading)" }}>{product.name}</h1>
            <p style={{ color: "var(--muted)", maxWidth: "700px", marginTop: "8px", fontSize: "16px" }}>
              {product.description}
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px" }}>
            <PriceCalculator product={product} />
          </div>

        </div>
      </main>
    </div>
  );
}
