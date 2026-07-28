"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";
import { 
  Search, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  PhoneCall, 
  User, 
  Calendar, 
  DollarSign, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  XCircle
} from "lucide-react";

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
  PENDING: "بانتظار تجهيز الملفات",
  PRINTING: "جارٍ الطباعة على الماكينة",
  READY: "جاهز للاستلام والتسليم",
  DELIVERED: "تم التسليم بنجاح",
  CANCELLED: "تم الإلغاء",
};

const PAYMENT_STATUS_MAP: Record<string, string> = {
  PENDING_PAYMENT: "بانتظار الدفع",
  VERIFYING: "جارٍ التحقق",
  PAID: "مدفوع",
  FAILED: "فشل الدفع",
};

const STEPS = [
  { key: "PENDING",   label: "استلام وتأكيد الملفات", desc: "تم تسجيل الطلب وجارٍ مراجعة التصاميم والدفع" },
  { key: "PRINTING",  label: "مرحلة الطباعة والتجهيز", desc: "الملفات قيد الطباعة والتشطيب بالمطبعة" },
  { key: "READY",     label: "جاهز للاستلام والتوريد", desc: "تم الانتهاء والتعبئة وجاهز للتسلم" },
  { key: "DELIVERED", label: "تم التسليم للعميل",     desc: "تم تسليم الشحنة للعميل بنجاح" },
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
      if (!res.ok) throw new Error(data.message || "تعذّر العثور على الطلب كود الطلب أو الهاتف خاطئ");
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
      setError("رقم الطلب ورقم الهاتف مطلوبان لتتبع حالة المطبوعات.");
      return;
    }
    fetchOrder(orderId, phone);
  };

  const activeIdx = order ? getStepIndex(order.status) : -1;

  return (
    <div className={order ? "grid grid-2" : "grid"} style={{ alignItems: "start", gap: "36px" }}>

      {/* LEFT COLUMN: Track form & pipeline progress */}
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <form onSubmit={handleSubmit} className="card-premium" style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "8px", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Search size={22} style={{ color: "var(--gold-400)" }} />
            استعلام تتبع الطلب
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14.5px", marginBottom: "24px" }}>
            أدخل كود الطلب الخاص بك ورقم التليفون المسجل لمعرفة المرحلة الحالية للطباعة.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="order-id-input">كود / رقم الطلب *</label>
            <input
              id="order-id-input"
              type="text"
              className="form-control ltr"
              placeholder="أدخل كود التتبع المسجل..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone-input">رقم تليفون التواصل *</label>
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
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "var(--radius-sm)",
              padding: "14px 16px",
              fontSize: "13.5px",
              color: "var(--status-cancelled-text)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-gold cursor-pointer"
            disabled={loading}
            style={{ width: "100%", padding: "14px", fontSize: "15px", gap: "8px" }}
          >
            {loading ? <Loader2 size={18} className="float-pulse" /> : <PackageCheck size={18} />}
            <span>{loading ? "جاري البحث واسترجاع البيانات..." : "عرض حالة الطلب الآن"}</span>
          </button>
        </form>

        {/* Pipeline steps */}
        {order && (
          <div className="card-premium" style={{ padding: "32px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "24px", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px", color: "var(--gold-400)" }}>
              <Clock size={20} />
              مراحل تنفيذ المطبوعات
            </h3>
            {order.status === "CANCELLED" ? (
              <div style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                color: "var(--status-cancelled-text)",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px"
              }}>
                <XCircle size={24} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", fontFamily: "var(--font-heading)" }}>تم إلغاء الطلب</h4>
                  <p style={{ fontSize: "13.5px", marginTop: "6px", lineHeight: 1.75 }}>
                    تم إلغاء هذا الطلب من قبل إدارة المطبعة أو بناءً على طلبك. للتفاصيل والاستفسار يرجى التواصل مع فريق الدعم.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "22px", position: "relative", paddingRight: "36px" }}>
                {/* Connector line */}
                <div style={{
                  position: "absolute",
                  right: "11px",
                  top: "12px",
                  bottom: "12px",
                  width: "2px",
                  background: "var(--border-strong)",
                }} />
                {STEPS.map((st, idx) => {
                  const isDone   = idx < activeIdx;
                  const isActive = idx === activeIdx;
                  return (
                    <div key={st.key} style={{ position: "relative" }}>
                      <div style={{
                        position: "absolute",
                        right: "-36px",
                        top: "2px",
                        width: "24px", height: "24px",
                        borderRadius: "50%",
                        background: isDone ? "var(--gradient-gold)" : isActive ? "var(--gold-400)" : "var(--navy-800)",
                        border: isActive ? "2px solid var(--gold-200)" : isDone ? "2px solid var(--gold-500)" : "2px solid var(--border)",
                        boxShadow: isActive ? "0 0 16px rgba(245,184,55,0.5)" : "none",
                        zIndex: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px",
                        color: isDone ? "#040914" : "var(--foreground)"
                      }}>
                        {isDone ? <CheckCircle2 size={14} style={{ color: "#040914" }} /> : (idx + 1)}
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: "16px",
                          fontWeight: isActive ? 800 : 600,
                          color: isDone ? "var(--gold-300)" : isActive ? "var(--gold-400)" : "var(--foreground-muted)",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}>
                          {st.label} {isActive && <span className="badge badge-gold" style={{ fontSize: "10px" }}>جاري الآن</span>}
                        </h4>
                        <p style={{ fontSize: "13px", color: "var(--foreground-subtle)", lineHeight: 1.6 }}>{st.desc}</p>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Main info card */}
          <div className="card-premium" style={{ padding: "32px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "14px", fontFamily: "var(--font-heading)", color: "var(--gold-400)" }}>
              تفاصيل الطلب المسجّل
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14.5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--foreground-subtle)", display: "flex", alignItems: "center", gap: "6px" }}><User size={15} /> اسم العميل:</span>
                <strong style={{ color: "var(--foreground)" }}>{order.customerName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--foreground-subtle)", display: "flex", alignItems: "center", gap: "6px" }}><PhoneCall size={15} /> رقم الهاتف:</span>
                <strong style={{ color: "var(--foreground)" }}>{order.customerPhone}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--foreground-subtle)", display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={15} /> تاريخ الإرسال:</span>
                <strong style={{ color: "var(--foreground)" }}>{new Date(order.createdAt).toLocaleDateString("ar-EG")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--foreground-subtle)", display: "flex", alignItems: "center", gap: "6px" }}><ShieldCheck size={15} /> حالة الطباعة:</span>
                <span className="badge badge-gold">{STATUS_MAP[order.status] || order.status}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--foreground-subtle)", display: "flex", alignItems: "center", gap: "6px" }}><DollarSign size={15} /> حالة التوريد والدفع:</span>
                <span className={`badge ${order.paymentStatus === "PAID" ? "badge-delivered" : order.paymentStatus === "VERIFYING" ? "badge-printing" : "badge-pending"}`}>
                  {PAYMENT_STATUS_MAP[order.paymentStatus] || order.paymentStatus}
                </span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "6px",
                fontSize: "16.5px",
              }}>
                <span style={{ fontWeight: 700 }}>إجمالي القيمة:</span>
                <strong style={{ color: "var(--gold-400)", fontSize: "22px", fontFamily: "var(--font-heading)" }}>
                  {order.totalPrice.toFixed(2)} ج.م
                </strong>
              </div>
            </div>
          </div>

          {/* Items & Options details */}
          <div className="card-premium" style={{ padding: "32px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px", fontFamily: "var(--font-heading)", color: "var(--gold-400)", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={20} />
              تفاصيل العناصر والملفات
            </h3>
            {order.items.map((item, idx) => (
              <div key={item.id} style={{
                borderBottom: idx < order.items.length - 1 ? "1px solid var(--border)" : "none",
                paddingBottom: idx < order.items.length - 1 ? "20px" : 0,
                marginBottom: idx < order.items.length - 1 ? "20px" : 0,
              }}>
                <h4 style={{ fontSize: "16px", marginBottom: "8px", fontWeight: "bold", color: "var(--foreground)" }}>
                  {item.product.name} — <span style={{ color: "var(--gold-300)" }}>{item.quantity} قطعة</span>
                </h4>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                  {item.selectedOptions.map((o, oi) => (
                    <span key={oi} style={{
                      background: "rgba(245,184,55,0.08)",
                      border: "1px solid var(--border)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "var(--foreground-muted)",
                    }}>
                      {o.optionName}: <strong style={{ color: "var(--gold-400)" }}>{o.valueName}</strong>
                    </span>
                  ))}
                </div>

                {item.designFiles.length > 0 ? (
                  <div>
                    <span style={{ fontSize: "13px", color: "var(--foreground-subtle)", display: "block", marginBottom: "6px" }}>
                      ملفات التصميم المعالجة للطباعة:
                    </span>
                    {item.designFiles.map((f, fi) => (
                      <a key={fi} href={f.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13.5px", color: "var(--gold-400)", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "underline", marginBottom: "6px" }}>
                        <FileText size={14} />
                        <span>{f.fileName}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "13px", color: "var(--status-cancelled-text)", display: "block" }}>
                    ⚠️ لم يتم إرفاق ملف تصميم. يرجى التواصل مع إدارة المطبعة.
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
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh" }}>
      <Header />

      {/* Hero Banner */}
      <section style={{
        padding: "70px 0 50px",
        background: `radial-gradient(ellipse 50% 60% at 50% 50%, rgba(245,184,55,0.08) 0%, transparent 65%)`,
        borderBottom: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <div className="container">
          <div className="badge badge-gold" style={{ marginBottom: "18px", gap: "6px" }}>
            <PackageCheck size={15} />
            <span>تتبع المطبوعات اللحظي</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 46px)", fontFamily: "var(--font-heading)", marginBottom: "14px" }}>
            متابعة حالة طلبك <span className="gradient-gold-text">لحظة بلحظة</span>
          </h1>
          <div className="arabic-divider" style={{ color: "var(--gold-400)", maxWidth: "260px", margin: "0 auto" }}>
            <span>◆</span>
          </div>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Main Content Area */}
      <section className="section">
        <div className="container">
          <Suspense fallback={
            <div style={{ textAlign: "center", padding: "60px", color: "var(--foreground-muted)", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <Loader2 size={24} className="float-pulse" style={{ color: "var(--gold-400)" }} />
              <span>جاري تحميل خدمة التتبع...</span>
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
