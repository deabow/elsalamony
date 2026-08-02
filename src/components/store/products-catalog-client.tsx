"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Printer, ChevronLeft, Image as ImageIcon, Sparkles, Tag } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  images: string[];
  optionsCount: number;
}

interface Props {
  initialProducts: ProductItem[];
}

export default function ProductsCatalogClient({ initialProducts }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Extract unique categories from initialProducts
  const categories = ["ALL", ...Array.from(new Set(initialProducts.map((p) => p.category)))];

  const filteredProducts = initialProducts.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      
      {/* Search & Category Filter Header Bar */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px"
      }}>
        {/* Search input */}
        <div style={{ position: "relative", width: "100%" }}>
          <Search
            size={20}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gold-400)"
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="ابحث عن اسم المنتج أو الخدمة (مثل: كروت، رول أب، دفاتر...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingRight: "48px" }}
          />
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "13.5px", color: "var(--foreground-subtle)", fontWeight: 600, marginLeft: "4px" }}>
            التصنيفات:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? "btn-gold" : "btn-ghost"}`}
              style={{ padding: "8px 16px", fontSize: "13px" }}
            >
              {cat === "ALL" ? "الكل" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="card-premium" style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
          <h3 style={{ fontSize: "20px", fontFamily: "var(--font-heading)", color: "var(--gold-400)", marginBottom: "8px" }}>
            لم يتم العثور على منتجات مطابقة
          </h3>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14.5px" }}>
            جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً من القائمة أعلاه.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "28px"
        }}>
          {filteredProducts.map((product) => {
            const hasImages = product.images && product.images.length > 0;
            const mainImage = hasImages ? product.images[0] : null;

            return (
              <div
                key={product.id}
                className="card-premium ornament-card gold-top"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0",
                  overflow: "hidden",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
                }}
              >
                {/* Product Image Header / Thumbnail */}
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "220px",
                  background: "#040812",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderBottom: "1px solid var(--border)"
                }}>
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ) : (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                      color: "var(--gold-400)",
                      opacity: 0.8
                    }}>
                      <div style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        background: "rgba(245,184,55,0.12)",
                        border: "1px solid var(--border-strong)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Printer size={28} />
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>طباعة معتمدة</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <span
                    className="badge badge-navy"
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      fontSize: "11px",
                      backdropFilter: "blur(8px)",
                      background: "rgba(8,16,36,0.85)"
                    }}
                  >
                    {product.category}
                  </span>

                  {/* Images count badge if multiple */}
                  {product.images.length > 1 && (
                    <span
                      className="badge badge-gold"
                      style={{
                        position: "absolute",
                        bottom: "14px",
                        left: "14px",
                        fontSize: "10.5px"
                      }}
                    >
                      📷 {product.images.length} صور
                    </span>
                  )}
                </div>

                {/* Content Details Body */}
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: "19px", marginBottom: "10px", fontFamily: "var(--font-heading)", color: "var(--foreground)" }}>
                    {product.name}
                  </h3>

                  <p style={{
                    color: "var(--foreground-muted)",
                    fontSize: "13.5px",
                    lineHeight: 1.7,
                    marginBottom: "20px",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {product.description || "مطبعة السلاموني — خامات ممتازة وتسعير دقيق مع إمكانية حسبة السعر تلقائياً."}
                  </p>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "16px",
                    marginTop: "auto"
                  }}>
                    <div>
                      <span style={{ fontSize: "11px", color: "var(--foreground-subtle)", display: "block" }}>
                        السعر الأساسي يبدأ من:
                      </span>
                      <strong style={{ fontSize: "19px", color: "var(--gold-400)", fontFamily: "var(--font-heading)" }}>
                        {product.basePrice.toFixed(2)} ج.م
                      </strong>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="btn btn-gold btn-sm cursor-pointer"
                      style={{ gap: "6px" }}
                    >
                      <span>تحديد وتصمـيم</span>
                      <ChevronLeft size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
