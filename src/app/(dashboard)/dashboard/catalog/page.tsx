"use client";

import React, { useState, useEffect } from "react";

// ── Types mapping to Prisma Schema ──
interface OptionValue {
  id: string;
  name: string;
  price_modifier: number;
}

interface ProductOption {
  id: string;
  name: string;
  values: OptionValue[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price: string | number;
  images?: string[];
  options: ProductOption[];
}

// ── Utility: generate simple temporary ID for form elements ──
const uid = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function CatalogDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // New product form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newBasePrice, setNewBasePrice] = useState("");
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newImageUrlInput, setNewImageUrlInput] = useState("");
  
  // Dynamic options/values builder for creation form
  const [formOptions, setFormOptions] = useState<{
    tempId: string;
    name: string;
    values: { tempId: string; name: string; price_modifier: string }[];
  }[]>([]);

  // Page level submit loading, error and success states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit product state
  const [editBasePrice, setEditBasePrice] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editImageUrlInput, setEditImageUrlInput] = useState("");
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedId) ?? null;

  // ── Fetch all products on mount ──
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
          if (data.products.length > 0) {
            setSelectedId(data.products[0].id);
            setEditBasePrice(Number(data.products[0].base_price).toString());
          }
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  // ── Helpers to manage dynamic form option groups ──
  const addFormOption = () => {
    setFormOptions((prev) => [...prev, { tempId: uid(), name: "", values: [] }]);
  };

  const removeFormOption = (tempId: string) => {
    setFormOptions((prev) => prev.filter((o) => o.tempId !== tempId));
  };

  const updateFormOptionName = (tempId: string, name: string) => {
    setFormOptions((prev) =>
      prev.map((o) => (o.tempId === tempId ? { ...o, name } : o))
    );
  };

  const addFormOptionValue = (optionTempId: string) => {
    setFormOptions((prev) =>
      prev.map((o) =>
        o.tempId === optionTempId
          ? {
              ...o,
              values: [...o.values, { tempId: uid(), name: "", price_modifier: "0" }],
            }
          : o
      )
    );
  };

  const removeFormOptionValue = (optionTempId: string, valTempId: string) => {
    setFormOptions((prev) =>
      prev.map((o) =>
        o.tempId === optionTempId
          ? { ...o, values: o.values.filter((v) => v.tempId !== valTempId) }
          : o
      )
    );
  };

  const updateFormOptionValue = (
    optionTempId: string,
    valTempId: string,
    fields: Partial<{ name: string; price_modifier: string }>
  ) => {
    setFormOptions((prev) =>
      prev.map((o) =>
        o.tempId === optionTempId
          ? {
              ...o,
              values: o.values.map((v) =>
                v.tempId === valTempId ? { ...v, ...fields } : v
              ),
            }
          : o
      )
    );
  };

  // ── Form submission handler using /api/products ──
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validations
    if (!newName.trim()) {
      setError("يرجى إدخال اسم المنتج");
      return;
    }
    if (!newCategory.trim()) {
      setError("يرجى اختيار أو إدخال تصنيف المنتج");
      return;
    }
    if (!newBasePrice || Number(newBasePrice) <= 0) {
      setError("يرجى إدخال سعر أساسي صحيح أكبر من الصفر");
      return;
    }

    // Validate dynamic options
    for (const opt of formOptions) {
      if (!opt.name.trim()) {
        setError("يرجى ملء جميع أسماء خيارات التسعير أو حذف المجموعات الفارغة");
        return;
      }
      for (const val of opt.values) {
        if (!val.name.trim()) {
          setError(`يرجى تحديد اسم القيمة تحت مجموعة الخيار "${opt.name}"`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          base_price: Number(newBasePrice),
          category: newCategory,
          images: newImages,
          options: formOptions.map((opt) => ({
            name: opt.name,
            values: opt.values.map((val) => ({
              name: val.name,
              price_modifier: Number(val.price_modifier) || 0,
            })),
          })),
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        setSelectedId(data.product.id);
        setEditBasePrice(Number(data.product.base_price).toString());
        setSuccess("تم إضافة المنتج الجديد وحفظه بنجاح!");
        setShowAddProduct(false);

        // Reset fields
        setNewName("");
        setNewCategory("");
        setNewDesc("");
        setNewBasePrice("");
        setNewImages([]);
        setNewImageUrlInput("");
        setFormOptions([]);
      } else {
        setError(data.message || "فشل في حفظ المنتج الجديد. يرجى التحقق من المدخلات.");
      }
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ أثناء الاتصال بالخادم لحفظ المنتج");
    } finally {
      setLoading(false);
    }
  };

  // ── Handle product deletion via /api/products?id=... ──
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من الكتالوج؟")) return;
    
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        if (selectedId === id) {
          setSelectedId(null);
          setEditBasePrice("");
        }
      } else {
        alert(data.message || "فشل حذف المنتج من قاعدة البيانات");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء محاولة حذف المنتج");
    }
  };

  const handleSelectProduct = (p: Product) => {
    setSelectedId(p.id);
    setEditBasePrice(Number(p.base_price).toString());
    setEditImages(p.images || []);
  };

  // ── Handle updating base price via /api/products (PATCH) ──
  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !editBasePrice) return;
    
    setUpdatingPrice(true);
    try {
      const response = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedId,
          base_price: Number(editBasePrice),
        }),
      });
      
      const data = await response.json();
      if (response.ok && data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === selectedId ? data.product : p))
        );
        alert("تم تحديث السعر بنجاح!");
      } else {
        alert(data.message || "فشل في تحديث السعر");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم لتحديث السعر");
    } finally {
      setUpdatingPrice(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontFamily: "var(--font-heading)", marginBottom: "6px" }}>
            🏷️ إدارة كتالوج المنتجات
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px" }}>
            أضف منتجات الطباعة وحدد خيارات التسعير الديناميكي — يتم حفظ التغييرات مباشرة في قاعدة البيانات.
          </p>
        </div>
        <button
          onClick={() => {
            setError("");
            setSuccess("");
            setShowAddProduct(true);
          }}
          className="btn btn-gold"
        >
          ➕ &nbsp; إضافة منتج جديد
        </button>
      </div>

      <div className="divider-gold" />

      {/* ── Add Product Modal ── */}
      {showAddProduct && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(5, 12, 26, 0.85)",
          backdropFilter: "blur(8px)",
          zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
          overflowY: "auto",
        }}>
          <div className="card-premium" style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", margin: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px" }}>إضافة منتج طباعة جديد</h2>
              <button
                onClick={() => setShowAddProduct(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--foreground-muted)" }}
                disabled={loading}
              >
                ✕
              </button>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--status-cancelled-text)", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "14px", marginBottom: "16px" }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">اسم المنتج *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="مثال: كروت شركات فاخرة"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">التصنيف *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="مثال: مطبوعات تجارية"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">السعر الأساسي (ج.م) *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="form-control ltr"
                    placeholder="150.00"
                    value={newBasePrice}
                    onChange={(e) => setNewBasePrice(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">وصف المنتج</label>
                <textarea
                  className="form-control"
                  placeholder="وصف مختصر للمنتج وميزاته..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  disabled={loading}
                />
              </div>

              {/* Image URLs Input Manager */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">صور المنتج (روابط الصور)</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="url"
                    className="form-control ltr"
                    placeholder="https://... رابط صورة المنتج"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-navy btn-sm"
                    style={{ padding: "0 16px", whiteSpace: "nowrap" }}
                    onClick={() => {
                      if (newImageUrlInput.trim()) {
                        setNewImages((prev) => [...prev, newImageUrlInput.trim()]);
                        setNewImageUrlInput("");
                      }
                    }}
                    disabled={loading || !newImageUrlInput.trim()}
                  >
                    ➕ إضافة صورة
                  </button>
                </div>

                {newImages.length > 0 && (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                    {newImages.map((url, idx) => (
                      <div key={idx} style={{ position: "relative", width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                        <img src={url} alt={`معاينة ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== idx))}
                          style={{
                            position: "absolute", top: "2px", left: "2px",
                            background: "rgba(239,68,68,0.85)", color: "#fff",
                            border: "none", borderRadius: "50%", width: "20px", height: "20px",
                            fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Options Manager Section */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "14px", color: "var(--gold-400)", fontWeight: 700 }}>خيارات التسعير الديناميكي للمنتج</h3>
                  <button
                    type="button"
                    className="btn btn-navy btn-sm"
                    onClick={addFormOption}
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                    disabled={loading}
                  >
                    ➕ إضافة خيار (مثال: المقاس)
                  </button>
                </div>

                {formOptions.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--foreground-subtle)", textAlign: "center", padding: "16px", background: "rgba(255,255,255,0.01)", border: "1px dashed var(--border)", borderRadius: "var(--radius-sm)", margin: 0 }}>
                    لا توجد خيارات مضافة للمنتج بعد. السعر سيكون ثابتاً بالسعر الأساسي فقط.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {formOptions.map((opt) => (
                      <div key={opt.tempId} style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        padding: "14px",
                      }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                          <div style={{ flex: 1 }}>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="اسم مجموعة الخيار (مثال: المقاس أو نوع الورق)"
                              value={opt.name}
                              onChange={(e) => updateFormOptionName(opt.tempId, e.target.value)}
                              required
                              disabled={loading}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFormOption(opt.tempId)}
                            style={{
                              background: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              color: "var(--status-cancelled-text)",
                              borderRadius: "var(--radius-sm)",
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                            disabled={loading}
                          >
                            حذف الخيار
                          </button>
                        </div>

                        {/* Values inside this Option Group */}
                        <div style={{ paddingRight: "14px", borderRight: "2px solid var(--gold-600)", marginRight: "4px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>القيم المتاحة وتعديل السعر الخاص بها:</span>
                            <button
                              type="button"
                              className="btn btn-outline-gold btn-sm"
                              onClick={() => addFormOptionValue(opt.tempId)}
                              style={{ padding: "4px 10px", fontSize: "11px" }}
                              disabled={loading}
                            >
                              ➕ إضافة قيمة
                            </button>
                          </div>

                          {opt.values.length === 0 ? (
                            <p style={{ fontSize: "11px", color: "var(--foreground-subtle)", margin: 0 }}>لم تضف قيم لهذا الخيار بعد.</p>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              {opt.values.map((val) => (
                                <div key={val.tempId} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr auto", gap: "8px", alignItems: "center" }}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="اسم القيمة (مثال: A4)"
                                    value={val.name}
                                    onChange={(e) => updateFormOptionValue(opt.tempId, val.tempId, { name: e.target.value })}
                                    required
                                    disabled={loading}
                                  />
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="form-control ltr"
                                    placeholder="زيادة السعر (مثال: 15.5)"
                                    value={val.price_modifier}
                                    onChange={(e) => updateFormOptionValue(opt.tempId, val.tempId, { price_modifier: e.target.value })}
                                    required
                                    disabled={loading}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeFormOptionValue(opt.tempId, val.tempId)}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: "var(--foreground-subtle)",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      padding: "0 4px"
                                    }}
                                    disabled={loading}
                                    title="حذف القيمة"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                <button type="submit" className="btn btn-gold" style={{ flex: 1 }} disabled={loading}>
                  {loading ? "⌛ جاري الحفظ..." : "✅ إضافة المنتج وحفظه"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddProduct(false)} disabled={loading}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Main Split Layout ── */}
      {loadingProducts ? (
        <div className="card-premium" style={{ textAlign: "center", padding: "80px 40px" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>⌛</div>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px" }}>جاري تحميل كتالوج المنتجات من قاعدة البيانات...</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "28px", alignItems: "flex-start" }}>

          {/* ── Product List (Right block due to RTL, visually list on right/left grid) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={{ fontSize: "15px", color: "var(--gold-400)", fontWeight: 700, marginBottom: "4px" }}>
              المنتجات المتاحة ({products.length})
            </h2>
            {products.length === 0 ? (
              <div className="card-premium" style={{ textAlign: "center", padding: "48px 24px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
                <p style={{ color: "var(--foreground-muted)", fontSize: "14px" }}>
                  لا توجد منتجات بالكتالوج حالياً. اضغط «إضافة منتج جديد» للبدء.
                </p>
              </div>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="card"
                  style={{
                    cursor: "pointer",
                    borderColor: selectedId === p.id ? "var(--border-hover)" : "var(--border)",
                    background: selectedId === p.id ? "rgba(244,185,66,0.05)" : "var(--surface)",
                    padding: "16px",
                    borderRadius: "var(--radius-sm)",
                    borderWidth: "1px",
                    borderStyle: "solid"
                  }}
                  onClick={() => handleSelectProduct(p)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{p.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(p.id);
                      }}
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: "11px",
                        color: "var(--status-cancelled-text)",
                      }}
                    >
                      حذف
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="badge badge-navy" style={{ fontSize: "10px" }}>{p.category}</span>
                    <span className="badge badge-gold" style={{ fontSize: "10px" }}>{p.options.length} خيارات تسعير</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "13px", color: "var(--foreground-muted)" }}>
                    <span>السعر الأساسي: <strong style={{ color: "var(--gold-400)" }}>{Number(p.base_price).toFixed(2)} ج.م</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Product Editor & Dynamic Options View ── */}
          <div>
            {selectedProduct ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Product header info */}
                <div className="card-premium" style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h2 style={{ fontSize: "20px", marginBottom: "4px", fontWeight: 700 }}>{selectedProduct.name}</h2>
                      <span className="badge badge-navy" style={{ fontSize: "11px" }}>{selectedProduct.category}</span>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "11px", color: "var(--foreground-subtle)" }}>السعر الأساسي الحالي</div>
                      <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--gold-400)", fontFamily: "var(--font-heading)" }}>
                        {Number(selectedProduct.base_price).toFixed(2)} ج.م
                      </div>
                    </div>
                  </div>
                  {selectedProduct.description && (
                    <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--foreground-muted)", lineHeight: 1.6 }}>
                      {selectedProduct.description}
                    </p>
                  )}
                </div>

                {/* Edit base price form */}
                <form onSubmit={handleUpdatePrice} className="card-premium" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <h3 style={{ fontSize: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", fontWeight: 700 }}>
                    ✏️ تعديل السعر الأساسي للمنتج
                  </h3>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label className="form-label">السعر الأساسي الجديد (ج.م)</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="form-control ltr"
                        value={editBasePrice}
                        onChange={(e) => setEditBasePrice(e.target.value)}
                        required
                        disabled={updatingPrice}
                      />
                    </div>
                    <button type="submit" className="btn btn-gold" style={{ padding: "12px 24px" }} disabled={updatingPrice}>
                      {updatingPrice ? "⌛ جاري الحفظ..." : "حفظ السعر"}
                    </button>
                  </div>
                </form>

                {/* Product Images Gallery & Editor */}
                <div className="card-premium" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", fontWeight: 700 }}>
                    🖼️ معرض صور المنتج ({editImages.length})
                  </h3>

                  {editImages.length > 0 ? (
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {editImages.map((imgUrl, idx) => (
                        <div key={idx} style={{
                          position: "relative", width: "90px", height: "90px",
                          borderRadius: "var(--radius-sm)", overflow: "hidden",
                          border: "1px solid var(--border)", background: "#040812"
                        }}>
                          <img src={imgUrl} alt={`صورة ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editImages.filter((_, i) => i !== idx);
                              setEditImages(updated);
                              if (selectedId) {
                                fetch("/api/products", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ id: selectedId, images: updated }),
                                }).then(() => {
                                  setProducts((prev) =>
                                    prev.map((p) => (p.id === selectedId ? { ...p, images: updated } : p))
                                  );
                                });
                              }
                            }}
                            style={{
                              position: "absolute", top: "4px", left: "4px",
                              background: "rgba(239,68,68,0.85)", color: "#fff",
                              border: "none", borderRadius: "50%", width: "22px", height: "22px",
                              fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                            }}
                            title="حذف الصورة"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "var(--foreground-subtle)" }}>
                      لا توجد صور مضافة لهذا المنتج حالياً. أضف روابط الصور أدناه.
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <input
                      type="url"
                      className="form-control ltr"
                      placeholder="https://... رابط صورة جديدة للمنتج"
                      value={editImageUrlInput}
                      onChange={(e) => setEditImageUrlInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-navy btn-sm"
                      style={{ padding: "0 16px", whiteSpace: "nowrap" }}
                      onClick={() => {
                        if (editImageUrlInput.trim() && selectedId) {
                          const updated = [...editImages, editImageUrlInput.trim()];
                          setEditImages(updated);
                          setEditImageUrlInput("");
                          fetch("/api/products", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: selectedId, images: updated }),
                          }).then(() => {
                            setProducts((prev) =>
                              prev.map((p) => (p.id === selectedId ? { ...p, images: updated } : p))
                            );
                          });
                        }
                      }}
                      disabled={!editImageUrlInput.trim()}
                    >
                      ➕ إضافة صورة
                    </button>
                  </div>
                </div>

                {/* Option manager (Read-only view of product configurations saved in database) */}
                <div className="card-premium" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ fontSize: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", fontWeight: 700 }}>
                    ⚙️ خيارات التسعير الديناميكي المرفقة بالمنتج
                  </h3>

                  {selectedProduct.options.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {selectedProduct.options.map((opt) => (
                        <div key={opt.id} style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          padding: "14px 16px",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ fontWeight: 700, color: "var(--gold-300)", fontSize: "14px" }}>
                              {opt.name}
                            </span>
                            <span className="badge badge-navy" style={{ fontSize: "10px" }}>
                              {opt.values.length} قيم متاحة
                            </span>
                          </div>
                          
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {opt.values.map((v) => (
                              <div key={v.id} style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                background: "rgba(244,185,66,0.06)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                fontSize: "12px",
                              }}>
                                <span>{v.name}</span>
                                <span style={{ color: "var(--gold-400)", fontWeight: 700 }}>
                                  {v.price_modifier >= 0 ? `+${v.price_modifier}` : v.price_modifier} ج.م
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "var(--foreground-subtle)", textAlign: "center" }}>
                      لا توجد خيارات تسعير ديناميكي مرفقة بهذا المنتج.
                    </p>
                  )}
                  
                  <div style={{ background: "rgba(244,185,66,0.03)", border: "1px solid rgba(244,185,66,0.1)", borderRadius: "var(--radius-sm)", padding: "12px", fontSize: "12px", color: "var(--foreground-subtle)", lineHeight: 1.5 }}>
                    💡 <strong>ملاحظة تنظيمية:</strong> لتعديل خيارات المنتج الديناميكية، يرجى حذف المنتج وإعادة إضافته بالخيارات والتسعير الجديد للحفاظ على استقرار الطلبات الحالية المعلقة.
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-premium" style={{ textAlign: "center", padding: "80px 40px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏷️</div>
                <h3 style={{ marginBottom: "10px", color: "var(--foreground-muted)", fontWeight: 700 }}>لا يوجد منتج مختار</h3>
                <p style={{ fontSize: "14px", color: "var(--foreground-subtle)" }}>
                  اختر منتجاً من القائمة الجانبية لعرض وتعديل سعره وتفاصيله، أو اضغط «إضافة منتج جديد» لبدء الكتالوج.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
