"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  User,
  Phone,
  Calendar
} from "lucide-react";

interface PaymentRecord {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone?: string;
  amount: number;
  paymentStatus: "PENDING_PAYMENT" | "VERIFYING" | "PAID" | "FAILED";
  submittedAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  PENDING_PAYMENT: { label: "بانتظار الدفع", badgeClass: "badge-pending" },
  VERIFYING:       { label: "جارٍ التحقق",   badgeClass: "badge-printing" },
  PAID:            { label: "مقبول (مدفوع)", badgeClass: "badge-delivered" },
  FAILED:          { label: "مرفوض",         badgeClass: "badge-cancelled" },
};

export default function PaymentsVerification() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "فشل في جلب سجلات المدفوعات");
      }

      setPayments(data.payments || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع عند تحميل المدفوعات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDecision = async (orderId: string, newStatus: "PAID" | "FAILED") => {
    setUpdatingId(orderId);
    setError("");
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "فشل في تحديث حالة الدفع");
      }

      // Update state locally after successful DB persistence
      setPayments((prev) =>
        prev.map((p) => (p.orderId === orderId ? { ...p, paymentStatus: newStatus } : p))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذر حفظ التغييرات في قاعدة البيانات.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = payments.filter((p) =>
    filterStatus === "ALL" || p.paymentStatus === filterStatus
  );

  const pendingCount = payments.filter((p) => p.paymentStatus === "VERIFYING" || p.paymentStatus === "PENDING_PAYMENT").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontFamily: "var(--font-heading)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
            <CreditCard size={28} style={{ color: "var(--gold-400)" }} />
            مراجعة المدفوعات
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px" }}>
            تحقق من سدادات الطلبات وتأكيد حالة الدفع في قاعدة البيانات مباشرةً
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={fetchPayments}
            className="btn btn-ghost btn-sm"
            disabled={loading}
            title="تحديث البيانات"
            style={{ gap: "6px" }}
          >
            <RefreshCw size={16} className={loading ? "float-pulse" : ""} />
            <span>تحديث</span>
          </button>
          {pendingCount > 0 && (
            <div className="badge badge-pending" style={{ fontSize: "14px", padding: "8px 18px" }}>
              ⏳ {pendingCount} بانتظار المراجعة
            </div>
          )}
        </div>
      </div>

      <div className="divider-gold" />

      {/* Global Error Banner */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "var(--radius-sm)",
          padding: "14px 16px",
          color: "var(--status-cancelled-text)",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[
          { key: "ALL",             label: "الكل" },
          { key: "PENDING_PAYMENT", label: "بانتظار الدفع" },
          { key: "VERIFYING",       label: "بانتظار التحقق" },
          { key: "PAID",            label: "مقبول" },
          { key: "FAILED",          label: "مرفوض" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`btn btn-sm ${filterStatus === f.key ? "btn-gold" : "btn-ghost"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Payments list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {loading ? (
          <div className="card-premium" style={{ textAlign: "center", padding: "60px", color: "var(--foreground-muted)" }}>
            <Loader2 size={32} className="float-pulse" style={{ margin: "0 auto 12px", color: "var(--gold-400)" }} />
            <p>جاري تحميل سجلات المدفوعات من قاعدة البيانات...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-premium" style={{ textAlign: "center", padding: "48px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>💳</div>
            <p style={{ color: "var(--foreground-muted)" }}>لا توجد سجلات مدفوعات في هذه الفئة</p>
          </div>
        ) : (
          filtered.map((pay) => {
            const isUpdating = updatingId === pay.orderId;
            const config = STATUS_CONFIG[pay.paymentStatus] || { label: pay.paymentStatus, badgeClass: "badge-pending" };

            return (
              <div key={pay.id} className="card-premium" style={{
                borderColor: pay.paymentStatus === "PAID"   ? "rgba(74,222,128,0.3)" :
                             pay.paymentStatus === "FAILED" ? "rgba(248,113,113,0.3)" :
                             "var(--border)",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  flexWrap: "wrap", gap: "12px", marginBottom: "16px",
                  borderBottom: "1px solid var(--border)", paddingBottom: "14px"
                }}>
                  <div>
                    <h3 style={{ fontSize: "17px", marginBottom: "4px" }}>
                      <span style={{ color: "var(--gold-400)" }}>#{pay.orderId.substring(0, 8)}</span>
                      {" — "}
                      {pay.customerName}
                    </h3>
                    <span style={{ fontSize: "12px", color: "var(--foreground-subtle)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={13} />
                      تاريخ الطلب: {new Date(pay.submittedAt).toLocaleString("ar-EG")}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className={`badge ${config.badgeClass}`}>
                      {config.label}
                    </span>
                    <span style={{ fontWeight: 900, fontSize: "18px", color: "var(--gold-400)" }}>
                      {pay.amount.toFixed(2)} ج.م
                    </span>
                  </div>
                </div>

                {/* Details grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px", fontSize: "14px" }}>
                  <div>
                    <span style={{ color: "var(--foreground-subtle)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <User size={13} /> اسم العميل:
                    </span>
                    <div style={{ fontWeight: 700, marginTop: "4px" }}>{pay.customerName}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--foreground-subtle)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Phone size={13} /> رقم الهاتف:
                    </span>
                    <div style={{ fontWeight: 700, marginTop: "4px", direction: "ltr", textAlign: "right" }}>{pay.customerPhone || "—"}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--foreground-subtle)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={13} /> حالة التسوية الحالية:
                    </span>
                    <div style={{ fontWeight: 700, marginTop: "4px" }}>{config.label}</div>
                  </div>
                </div>

                {/* Decision Actions */}
                {pay.paymentStatus !== "PAID" && pay.paymentStatus !== "FAILED" ? (
                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                    <button
                      onClick={() => handleDecision(pay.orderId, "PAID")}
                      disabled={isUpdating}
                      className="btn btn-gold btn-sm cursor-pointer"
                      style={{ gap: "6px" }}
                    >
                      {isUpdating ? <Loader2 size={15} className="float-pulse" /> : <CheckCircle2 size={15} />}
                      <span>تأكيد قبول الدفع</span>
                    </button>
                    <button
                      onClick={() => handleDecision(pay.orderId, "FAILED")}
                      disabled={isUpdating}
                      className="btn btn-ghost btn-sm cursor-pointer"
                      style={{ color: "var(--status-cancelled-text)", borderColor: "rgba(248,113,113,0.3)", gap: "6px" }}
                    >
                      {isUpdating ? <Loader2 size={15} className="float-pulse" /> : <XCircle size={15} />}
                      <span>رفض العملية</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "13px", color: pay.paymentStatus === "PAID" ? "var(--status-delivered-text)" : "var(--status-cancelled-text)" }}>
                      {pay.paymentStatus === "PAID" ? "✔️ تم قبول الدفع وتأكيده في قاعدة البيانات" : "✗ تم تسجيل العملية كمرفوضة"}
                    </span>
                    <button
                      onClick={() => handleDecision(pay.orderId, pay.paymentStatus === "PAID" ? "FAILED" : "PAID")}
                      disabled={isUpdating}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}
                    >
                      تغيير القرار
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
