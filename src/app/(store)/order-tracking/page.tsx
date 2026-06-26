"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";

interface OrderItem {
  id: string;
  product: { name: string; sku: string };
  quantity: number;
  selectedOptions: Array<{ optionName: string; valueName: string }>;
  designFiles: Array<{ fileName: string; url: string }>;
}

interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_MAP: Record<string, string> = {
  PENDING: "بانتظار ما قبل الطباعة",
  PRINTING: "جارٍ الطباعة الآن",
  READY: "جاهز للاستلام",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

const PAYMENT_STATUS_MAP: Record<string, string> = {
  PENDING_PAYMENT: "بانتظار الدفع",
  VERIFYING: "جارٍ التحقق",
  PAID: "مدفوع",
  FAILED: "فشل الدفع",
};

const STEPS = [
  { key: "PENDING",   label: "استلام الطلب",      desc: "تم استلام طلبك وجارٍ مراجعة الملفات والدفع" },
  { key: "PRINTING",  label: "جارٍ الطباعة",       desc: "الملفات على الماكينة والطباعة قائمة" },
  { key: "READY",     label: "جاهز للاستلام",      desc: "تم التعبئة وجاهز للاستلام من المطبعة" },
  { key: "DELIVERED", label: "تم التسليم ✓",       desc: "تم تسليم الطلب للعميل بنجاح" },
];

function getStepIndex(status: string) {
  return STEPS.findIndex((s) => s.key === status);
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder]     = useState<OrderDetails | null>(null);
  const [error, setError]     = useState("");

  useEffect(() => {
    const qId = searchParams.get("orderId");
    const qPh = searchParams.get("phone");
    if (qId && qPh) {
      setOrderId(qId);
      setPhone(qPh);
      fetchOrder(qId, qPh);
    }
  }, [searchParams]);

  const fetchOrder = async (id: string, ph: string) => {
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(id)}&phone=${encodeURIComponent(ph)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "تعذّر العثور على الطلب");
      setOrder(data.order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذّر تحديد الطلب. تأكد من البيانات وحاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError("رقم الطلب ورقم الهاتف مطلوبان للتتبع.");
      return;
    }
    fetchOrder(orderId, phone);
  };

  const activeIdx = order ? getStepIndex(order.status) : -1;

  return (
    /* Responsive layout using the custom grid styles from globals.css */
    <div className={order ? "grid grid-2" : "grid"} style={{ alignItems: "start", gap: "36px" }}>

      {/* LEFT COLUMN: Track form & pipeline progress */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <form onSubmit={handleSubmit} className="card-premium">
          <h2 style={{ fontSize: "22px", marginBottom: "6px", fontFamily: "var(--font-heading)" }}>🔍 تتبع طلبك</h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px", marginBottom: "24px" }}>
            أدخل كود الطلب ورقم تليفونك اللي سجلته عند الطلب لمتابعة حالة المطبوعات.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="order-id-input">كود الطلب *</label>
            <input
              id="order-id-input"
              type="text"
              className="form-control ltr"
              placeholder="مثال: UUID الخاص بالطلب أو كود الدفع"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone-input">رقم التليفون المسجّل للتواصل *</label>
            <input
              id="phone-input"
              type="tel"
              className="form-control ltr"
              placeholder="01020243667"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              fontSize: "13px",
              color: "var(--status-cancelled-text)",
              marginBottom: "16px",
              textAlign: "right"
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-gold"
            disabled={loading}
            style={{ width: "100%", padding: "14px", fontSize: "15px" }}
          >
            {loading ? "⌛ جارٍ البحث..." : "📦 اعرض حالة طلبي"}
          </button>
        </form>

        {/* Pipeline steps */}
        {order && (
          <div className="card-premium">
            <h3 style={{ fontSize: "17px", marginBottom: "24px", fontFamily: "var(--font-heading)" }}>📊 مراحل تنفيذ الطلب</h3>
            {order.status === "CANCELLED" ? (
              <div style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "var(--radius-sm)",
                padding: "16px",
                color: "var(--status-cancelled-text)",
                textAlign: "right"
              }}>
                <h4>🚫 تم إلغاء الطلب</h4>
                <p style={{ fontSize: "13px", marginTop: "6px", lineHeight: 1.6 }}>
                  تم إلغاء هذا الطلب من قبل الإدارة أو بناءً على رغبتك. للتفاصيل يرجى الاتصال بنا.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", paddingRight: "32px" }}>
                {/* Connector line */}
                <div style={{
                  position: "absolute",
                  right: "9px",
                  top: "10px",
                  bottom: "10px",
                  width: "2px",
                  background: "var(--border)",
                }} />
                {STEPS.map((st, idx) => {
                  const isDone   = idx < activeIdx;
                  const isActive = idx === activeIdx;
                  return (
                    <div key={st.key} style={{ position: "relative" }}>
                      <div style={{
                        position: "absolute",
                        right: "-31px",
                        top: "2px",
                        width: "20px", height: "20px",
                        borderRadius: "50%",
                        background: isDone ? "var(--gold-500)" : isActive ? "var(--gold-400)" : "var(--navy-700)",
                        border: isActive ? "2px solid var(--gold-300)" : isDone ? "2px solid var(--gold-600)" : "2px solid var(--border)",
                        boxShadow: isActive ? "0 0 12px var(--primary-glow)" : "none",
                        zIndex: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px",
                        color: isDone ? "var(--navy-950)" : "var(--foreground)"
                      }}>
                        {isDone ? "✓" : ""}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <h4 style={{
                          fontSize: "15px",
                          fontWeight: isActive ? 700 : 500,
                          color: isDone ? "var(--gold-300)" : isActive ? "var(--gold-400)" : "var(--foreground-subtle)",
                          marginBottom: "3px",
                        }}>
                          {st.label} {isActive && <span className="badge badge-gold" style={{ fontSize: "10px", marginRight: "8px" }}>جارٍ الآن</span>}
                        </h4>
                        <p style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Order details sidebar */}
      {order && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Main info card */}
          <div className="card-premium" style={{ borderColor: "var(--border-strong)" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", fontFamily: "var(--font-heading)" }}>
              تفاصيل الطلب المسجّل
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", textAlign: "right" }}>
              {[
                { label: "اسم العميل", value: order.customerName },
                { label: "رقم التليفون", value: order.customerPhone },
                { label: "تاريخ الطلب", value: new Date(order.createdAt).toLocaleDateString("ar-EG") },
                { label: "حالة المطبوعات", value: STATUS_MAP[order.status] || order.status },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--foreground-muted)" }}>{r.label}:</span>
                  <strong>{r.value}</strong>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--foreground-muted)" }}>حالة الدفع والتسليم:</span>
                <span className={`badge ${order.paymentStatus === "PAID" ? "badge-delivered" : order.paymentStatus === "VERIFYING" ? "badge-printing" : "badge-pending"}`}>
                  {PAYMENT_STATUS_MAP[order.paymentStatus] || order.paymentStatus}
                </span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px",
                fontSize: "16px",
              }}>
                <span style={{ fontWeight: 700 }}>إجمالي الفاتورة:</span>
                <strong style={{ color: "var(--gold-400)", fontSize: "18px" }}>
                  {order.totalPrice.toFixed(2)} ج.م
                </strong>
              </div>
            </div>
          </div>

          {/* Items & Options details */}
          <div className="card-premium">
            <h3 style={{ fontSize: "16px", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>📋 تفاصيل المنتج وملفات التصميم</h3>
            {order.items.map((item, idx) => (
              <div key={item.id} style={{
                borderBottom: idx < order.items.length - 1 ? "1px solid var(--border)" : "none",
                paddingBottom: idx < order.items.length - 1 ? "16px" : 0,
                marginBottom: idx < order.items.length - 1 ? "16px" : 0,
                textAlign: "right"
              }}>
                <h4 style={{ fontSize: "14px", marginBottom: "6px", fontWeight: "bold" }}>
                  {item.product.name} — {item.quantity} قطعة
                </h4>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" }}>
                  {item.selectedOptions.map((o, oi) => (
                    <span key={oi} style={{
                      background: "rgba(244,185,66,0.07)",
                      border: "1px solid var(--border)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      color: "var(--foreground-muted)",
                    }}>
                      {o.optionName}: <strong>{o.valueName}</strong>
                    </span>
                  ))}
                </div>

                {item.designFiles.length > 0 ? (
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--foreground-subtle)", display: "block", marginBottom: "4px" }}>
                      ملفات التصميم المرفوعة للتنفيذ:
                    </span>
                    {item.designFiles.map((f, fi) => (
                      <a key={fi} href={f.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "var(--gold-400)", display: "block", textDecoration: "underline", marginBottom: "4px" }}>
                        📄 {f.fileName}
                      </a>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "12px", color: "var(--status-cancelled-text)", display: "block" }}>
                    ⚠️ لم يتم إرفاق ملف تصميم. يرجى مراجعة إدارة الدعم الفني.
                  </span>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default function OrderTracking() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Header />

      {/* Hero Banner */}
      <section style={{
        padding: "64px 0 48px",
        background: `radial-gradient(ellipse 50% 60% at 50% 50%, rgba(212,150,42,0.06) 0%, transparent 60%)`,
        borderBottom: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <div className="container">
          <div className="badge badge-gold" style={{ marginBottom: "16px" }}>📦 تتبع المطبوعات</div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontFamily: "var(--font-heading)", marginBottom: "12px" }}>
            تابع حالة طلبك <span className="gradient-gold-text">خطوة بخطوة</span>
          </h1>
          <div className="arabic-divider" style={{ color: "var(--gold-500)", maxWidth: "260px", margin: "0 auto" }}>
            <span>◆</span>
          </div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Main Content Area */}
      <section className="section">
        <div className="container">
          <Suspense fallback={
            <div style={{ textAlign: "center", padding: "40px", color: "var(--foreground-muted)" }}>
              ⌛ جارٍ تحميل خدمة التتبع...
            </div>
          }>
            <TrackingContent />
          </Suspense>
        </div>
      </section>

      <Footer />
    </div>
  );
}
