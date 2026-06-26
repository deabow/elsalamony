"use client";

import React, { useState, useEffect, useRef } from "react";

interface OptionValue {
  id: string;
  name: string;
  option: { name: string };
}

interface OrderItemOption {
  option_value: OptionValue;
}

interface DesignFile {
  id: string;
  file_name: string;
  file_url: string;
}

interface OrderItem {
  id: string;
  product: { name: string; category: string };
  quantity: number;
  subtotal: number;
  banner_width?: number | null;
  banner_height?: number | null;
  chosen_value: OrderItemOption[];
  design_files: DesignFile[];
}

interface OrderRecord {
  id: string;
  guest_name: string;
  guest_phone: string;
  status: "PENDING" | "PRINTING" | "READY" | "DELIVERED" | "CANCELLED";
  total_price: number;
  created_at: string;
  items: OrderItem[];
}

const STATUS_AR: Record<string, string> = {
  PENDING:   "بانتظار الإعداد",
  PRINTING:  "جارٍ الطباعة",
  READY:     "جاهز للاستلام",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

const FILTERS = [
  { key: "ALL",       label: "الكل" },
  { key: "PENDING",   label: "بانتظار الإعداد" },
  { key: "PRINTING",  label: "جارٍ الطباعة" },
  { key: "READY",     label: "جاهز للاستلام" },
  { key: "DELIVERED", label: "تم التسليم" },
  { key: "CANCELLED", label: "ملغي" },
];

export default function StaffOrdersQueue() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery]   = useState("");
  
  // Side drawer selected order
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  
  // Status update states
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusToast, setStatusToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-refresh polling (30 seconds)
  const [autoPoll, setAutoPoll] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrders = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("تعذر جلب الطلبات من السيرفر.");
      const data = await res.json();
      setOrders(data.orders || []);
      
      // Update selected order details if open
      if (selectedOrder) {
        const updatedSelected = data.orders.find((o: OrderRecord) => o.id === selectedOrder.id);
        if (updatedSelected) setSelectedOrder(updatedSelected);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "حدث خطأ غير متوقع.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrders(true);
  }, []);

  // Setup auto-polling
  useEffect(() => {
    if (autoPoll) {
      pollIntervalRef.current = setInterval(() => {
        fetchOrders(false);
      }, 30000); // 30s
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [autoPoll, selectedOrder]);

  const handleStatusChange = async (orderId: string, nextStatus: OrderRecord["status"]) => {
    setIsUpdatingStatus(true);
    setStatusToast(null);

    // Optimistic UI update
    const previousOrders = [...orders];
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: nextStatus } : o));

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: nextStatus }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "فشل تحديث الحالة.");

      setStatusToast({ type: "success", text: `تم تحديث حالة الطلب بنجاح إلى: ${STATUS_AR[nextStatus]}` });
      fetchOrders(false);
    } catch (err: any) {
      console.error(err);
      // Revert UI on error
      setOrders(previousOrders);
      setStatusToast({ type: "error", text: err.message || "حدث خطأ أثناء تحديث حالة الطلب." });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      o.id.toLowerCase().includes(q) ||
      o.guest_name.toLowerCase().includes(q) ||
      o.guest_phone.includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", position: "relative" }}>

      {/* Header and Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontFamily: "var(--font-heading)", marginBottom: "6px" }}>
            📦 إدارة وجدولة الطلبات
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px" }}>
            متابعة حالة المطبوعات للمستندات واللافتات، تحميل ملفات التصميم، وتوريد الفواتير.
          </p>
        </div>

        {/* Real-time configuration toggles */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            cursor: "pointer",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border)",
            padding: "8px 14px",
            borderRadius: "var(--radius-sm)"
          }}>
            <input
              type="checkbox"
              checked={autoPoll}
              onChange={(e) => setAutoPoll(e.target.checked)}
              style={{ accentColor: "var(--gold-400)", cursor: "pointer" }}
            />
            <span>🔄 تحديث تلقائي (30 ثانية)</span>
          </label>

          <button
            onClick={() => fetchOrders(true)}
            className="btn btn-navy btn-sm"
            style={{ padding: "10px 16px" }}
            title="تحديث البيانات يدوياً"
          >
            🔄 تحديث يدوي
          </button>
        </div>
      </div>

      <div className="divider-gold" />

      {/* Filters & Search Grid */}
      <div className="card-premium grid-cols-2" style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "center" }}>
        <div style={{ width: "100%" }}>
          <input
            id="orders-search"
            type="text"
            className="form-control"
            placeholder="🔍 ابحث بالاسم، رقم التليفون، أو رقم الطلب (ID)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`btn btn-sm ${filterStatus === f.key ? "btn-gold" : "btn-ghost"}`}
              style={{ padding: "8px 16px", fontSize: "13px" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="card-premium" style={{ textAlign: "center", padding: "80px 24px" }}>
          <span style={{ fontSize: "28px" }}>⌛</span>
          <p style={{ color: "var(--foreground-muted)", marginTop: "12px" }}>جاري تحميل كشف الطلبات الواردة...</p>
        </div>
      ) : errorMsg ? (
        <div className="card-premium" style={{ textAlign: "center", padding: "48px 24px", borderColor: "var(--border-strong)" }}>
          <span style={{ fontSize: "28px" }}>⚠️</span>
          <p style={{ color: "var(--status-cancelled-text)", marginTop: "12px" }}>{errorMsg}</p>
          <button onClick={() => fetchOrders(true)} className="btn btn-gold btn-sm" style={{ marginTop: "16px" }}>
            إعادة المحاولة
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-premium" style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>📭</div>
          <p style={{ color: "var(--foreground-muted)" }}>لا توجد طلبات تطابق معايير التصفية والبحث حالياً.</p>
        </div>
      ) : (
        /* Orders list table / cards */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filtered.map((o) => (
            <div
              key={o.id}
              onClick={() => setSelectedOrder(o)}
              className="card-premium ornament-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                cursor: "pointer",
                border: selectedOrder?.id === o.id ? "1.5px solid var(--gold-400)" : "1px solid var(--border)",
                background: selectedOrder?.id === o.id ? "rgba(244,185,66,0.02)" : "var(--gradient-card-premium)",
                transition: "all 0.2s ease"
              }}
            >
              {/* Card Header Info */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "12px"
              }}>
                <div>
                  <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "var(--gold-400)", fontFamily: "var(--font-mono)", fontWeight: "bold" }}>#{o.id.substring(0, 8)}...</span>
                    <span className={`badge badge-${o.status === "PENDING" ? "pending" : o.status === "PRINTING" ? "printing" : o.status === "READY" ? "ready" : o.status === "DELIVERED" ? "delivered" : "cancelled"}`}>
                      {STATUS_AR[o.status] || o.status}
                    </span>
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>
                    تاريخ الإنشاء: {new Date(o.created_at).toLocaleString("ar-EG")}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontWeight: 800, fontSize: "18px", color: "var(--gold-400)" }}>
                    {o.total_price.toFixed(2)} ج.م
                  </span>
                  <span style={{ color: "var(--foreground-subtle)", fontSize: "12px" }}>
                    ({o.items.length} منتجات)
                  </span>
                </div>
              </div>

              {/* Card Details Summary Preview */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="grid-cols-2">
                <div>
                  <span style={{ fontSize: "12px", color: "var(--foreground-subtle)", display: "block", marginBottom: "4px" }}>بيانات التواصل للضيف:</span>
                  <strong style={{ display: "block" }}>👤 {o.guest_name}</strong>
                  <span style={{ color: "var(--foreground-muted)", fontSize: "13px" }} className="ltr">📞 {o.guest_phone}</span>
                </div>
                <div style={{ textAlign: "left", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: "13px", color: "var(--gold-400)" }}>عرض التفاصيل وتنزيل الملفات ←</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL SIDE DRAWER OVERLAY */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5, 12, 26, 0.6)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex",
            justifyContent: "flex-end",
            animation: "fadeSlideUp 0.3s ease"
          }}
        >
          {/* Drawer Panel */}
          <div
            onClick={(e) => e.stopPropagation()} // block bubble to close
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "var(--surface)",
              borderLeft: "1px solid var(--border-strong)",
              height: "100vh",
              overflowY: "auto",
              boxShadow: "var(--shadow-lg)",
              padding: "36px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              position: "relative",
              textAlign: "right"
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: "absolute",
                top: "24px",
                left: "24px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--foreground-muted)",
                cursor: "pointer",
                fontSize: "16px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--gold-400)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--foreground-muted)"}
            >
              ✕
            </button>

            {/* Header info */}
            <div>
              <span className="badge badge-gold" style={{ fontSize: "11px", marginBottom: "8px" }}>تفاصيل الطلب الكاملة</span>
              <h2 style={{ fontSize: "22px", fontFamily: "var(--font-heading)" }}>
                كود الطلب: <span style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "var(--gold-400)" }}>{selectedOrder.id}</span>
              </h2>
              <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>
                تاريخ التسجيل: {new Date(selectedOrder.created_at).toLocaleString("ar-EG")}
              </span>
            </div>

            <div className="divider-gold" />

            {/* Client Info Panel */}
            <div className="card" style={{ padding: "16px 20px", background: "rgba(255,255,255,0.01)" }}>
              <h4 style={{ fontSize: "13px", color: "var(--gold-300)", marginBottom: "8px", fontWeight: "bold" }}>👤 بيانات العميل الضيف</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px" }}>
                <div>اسم العميل: <strong>{selectedOrder.guest_name}</strong></div>
                <div>رقم التليفون للتواصل: <strong className="ltr">{selectedOrder.guest_phone}</strong></div>
              </div>
            </div>

            {/* Status Change Form */}
            <div className="card" style={{ padding: "16px 20px", border: "1px solid var(--border-strong)" }}>
              <h4 style={{ fontSize: "13px", color: "var(--gold-300)", marginBottom: "12px", fontWeight: "bold" }}>⚙️ تعديل مرحلة الإنتاج والطباعة</h4>
              
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as any)}
                  disabled={isUpdatingStatus}
                  className="form-control"
                  style={{
                    background: "var(--navy-900)",
                    border: "1.5px solid var(--border-strong)",
                    flex: 1,
                    fontSize: "14px"
                  }}
                >
                  <option value="PENDING">بانتظار الإعداد (PENDING)</option>
                  <option value="PRINTING">جارٍ الطباعة (PRINTING)</option>
                  <option value="READY">جاهز للاستلام (READY)</option>
                  <option value="DELIVERED">تم التسليم والإنهاء (DELIVERED)</option>
                  <option value="CANCELLED">إلغاء الطلب (CANCELLED)</option>
                </select>
              </div>

              {statusToast && (
                <div style={{
                  marginTop: "12px",
                  fontSize: "12px",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  background: statusToast.type === "success" ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)",
                  border: `1px solid ${statusToast.type === "success" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  color: statusToast.type === "success" ? "var(--status-delivered-text)" : "var(--status-cancelled-text)",
                  textAlign: "center"
                }}>
                  {statusToast.text}
                </div>
              )}
            </div>

            {/* Ordered items listing & File Download links */}
            <div>
              <h4 style={{ fontSize: "15px", color: "var(--gold-300)", marginBottom: "12px", fontWeight: "bold" }}>📋 البنود المطلوبة ({selectedOrder.items.length})</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {selectedOrder.items.map((item, idx) => {
                  const isBanner = item.product?.category?.toLowerCase() === "banners";
                  const width = item.banner_width || 1.0;
                  const height = item.banner_height || 1.0;

                  return (
                    <div key={item.id} style={{
                      background: "rgba(255, 255, 255, 0.01)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "16px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontWeight: 700, fontSize: "14px" }}>
                          {idx + 1}. {item.product?.name || "مطبوعات مخصصة"}
                        </span>
                        <strong style={{ color: "var(--gold-400)", fontSize: "14px" }}>
                          {item.subtotal.toFixed(2)} ج.م
                        </strong>
                      </div>

                      <div style={{ fontSize: "13px", color: "var(--foreground-muted)", marginBottom: "8px" }}>
                        الكمية: <strong>{item.quantity} وحدة</strong>
                      </div>

                      {/* Render option values mapping */}
                      {item.chosen_value && item.chosen_value.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                          {item.chosen_value.map((cv) => (
                            <span key={cv.option_value.id} style={{
                              fontSize: "11px",
                              background: "rgba(244,185,66,0.06)",
                              border: "1px solid var(--border)",
                              borderRadius: "4px",
                              padding: "2px 8px",
                              color: "var(--foreground-muted)"
                            }}>
                              {cv.option_value.option?.name || "مواصفة"}: <strong>{cv.option_value.name}</strong>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Render banner dimensions */}
                      {isBanner && (
                        <div style={{
                          background: "rgba(244,185,66,0.03)",
                          border: "1px dashed rgba(244,185,66,0.2)",
                          borderRadius: "4px",
                          padding: "8px 12px",
                          fontSize: "12px",
                          marginBottom: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          color: "var(--gold-300)"
                        }}>
                          <span>📐 أبعاد لافتة البانر:</span>
                          <strong>{width} م × {height} م ({(width * height).toFixed(2)} متر مربع)</strong>
                        </div>
                      )}

                      {/* Design File Download Section */}
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "10px", marginTop: "10px" }}>
                        {item.design_files && item.design_files.length > 0 ? (
                          <div>
                            <span style={{ fontSize: "12px", color: "var(--foreground-subtle)", display: "block", marginBottom: "6px" }}>
                              📁 ملفات التصميم للتحميل:
                            </span>
                            {item.design_files.map((file) => (
                              <a
                                key={file.id}
                                href={file.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-gold btn-sm"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  padding: "8px 12px",
                                  fontSize: "12px",
                                  marginBottom: "6px"
                                }}
                              >
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "260px" }}>
                                  📄 {file.file_name}
                                </span>
                                <strong>📥 تحميل</strong>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "var(--status-cancelled-text)", display: "block" }}>
                            ⚠️ لم يرفق العميل ملفات تصميم لهذا البند.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total invoice block */}
            <div style={{
              marginTop: "auto",
              background: "rgba(5, 12, 26, 0.4)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-md)",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>القيمة الكلية للطلب:</span>
              <strong style={{ color: "var(--gold-400)", fontSize: "20px" }}>{selectedOrder.total_price.toFixed(2)} ج.م</strong>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
