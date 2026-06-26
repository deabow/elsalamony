"use client";

import React, { useState } from "react";

interface PaymentRecord {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: "vodafone_cash" | "instapay" | "cib_transfer" | "cash";
  referenceNumber: string;
  receiptUrl: string;
  status: "VERIFYING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

const METHOD_AR: Record<string, string> = {
  vodafone_cash: "فودافون كاش",
  instapay:      "إنستاباي",
  cib_transfer:  "تحويل CIB",
  cash:          "نقداً",
};

const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-001",
    orderId: "ord-8372",
    customerName: "محمد علي",
    amount: 270.00,
    method: "vodafone_cash",
    referenceNumber: "VC-8732647",
    receiptUrl: "#",
    status: "VERIFYING",
    submittedAt: new Date().toISOString(),
  },
  {
    id: "pay-002",
    orderId: "ord-5541",
    customerName: "سارة خالد",
    amount: 450.00,
    method: "instapay",
    referenceNumber: "IP-3391882",
    receiptUrl: "#",
    status: "VERIFYING",
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "pay-003",
    orderId: "ord-3210",
    customerName: "مصنع النور",
    amount: 2100.00,
    method: "cib_transfer",
    referenceNumber: "CIB-00987234",
    receiptUrl: "#",
    status: "APPROVED",
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function PaymentsVerification() {
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const handleDecision = (id: string, decision: "APPROVED" | "REJECTED") => {
    setPayments((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: decision } : p)
    );
  };

  const filtered = payments.filter((p) =>
    filterStatus === "ALL" || p.status === filterStatus
  );

  const pendingCount = payments.filter((p) => p.status === "VERIFYING").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontFamily: "var(--font-heading)", marginBottom: "6px" }}>
            💳 مراجعة المدفوعات
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px" }}>
            تحقق من إيصالات الدفع وقرر القبول أو الرفض لتحديث حالة الطلب
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="badge badge-pending" style={{ fontSize: "14px", padding: "8px 18px" }}>
            ⏳ {pendingCount} إيصال بانتظار المراجعة
          </div>
        )}
      </div>

      <div className="divider-gold" />

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { key: "ALL", label: "الكل" },
          { key: "VERIFYING", label: "بانتظار التحقق" },
          { key: "APPROVED", label: "مقبول" },
          { key: "REJECTED", label: "مرفوض" },
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
        {filtered.length === 0 ? (
          <div className="card-premium" style={{ textAlign: "center", padding: "48px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>✅</div>
            <p style={{ color: "var(--foreground-muted)" }}>لا توجد إيصالات في هذه الفئة</p>
          </div>
        ) : (
          filtered.map((pay) => (
            <div key={pay.id} className="card-premium" style={{
              borderColor: pay.status === "APPROVED" ? "rgba(74,222,128,0.3)" :
                           pay.status === "REJECTED" ? "rgba(248,113,113,0.3)" :
                           "var(--border)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "14px" }}>
                <div>
                  <h3 style={{ fontSize: "17px", marginBottom: "4px" }}>
                    <span style={{ color: "var(--gold-400)" }}>#{pay.orderId}</span>
                    {" — "}
                    {pay.customerName}
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>
                    وصل الإيصال: {new Date(pay.submittedAt).toLocaleString("ar-EG")}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={`badge ${
                    pay.status === "VERIFYING" ? "badge-printing" :
                    pay.status === "APPROVED"  ? "badge-delivered" : "badge-cancelled"
                  }`}>
                    {pay.status === "VERIFYING" ? "جارٍ التحقق" :
                     pay.status === "APPROVED"  ? "مقبول" : "مرفوض"}
                  </span>
                  <span style={{ fontWeight: 900, fontSize: "18px", color: "var(--gold-400)" }}>
                    {pay.amount.toFixed(2)} ج.م
                  </span>
                </div>
              </div>

              {/* Payment details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px", fontSize: "14px" }}>
                <div>
                  <span style={{ color: "var(--foreground-subtle)", fontSize: "12px" }}>طريقة الدفع:</span>
                  <div style={{ fontWeight: 700, marginTop: "4px" }}>{METHOD_AR[pay.method] ?? pay.method}</div>
                </div>
                <div>
                  <span style={{ color: "var(--foreground-subtle)", fontSize: "12px" }}>رقم المرجع / العملية:</span>
                  <div style={{ fontWeight: 700, marginTop: "4px", direction: "ltr", textAlign: "right" }}>{pay.referenceNumber}</div>
                </div>
                <div>
                  <span style={{ color: "var(--foreground-subtle)", fontSize: "12px" }}>صورة الإيصال:</span>
                  <div style={{ marginTop: "4px" }}>
                    <a href={pay.receiptUrl} style={{ color: "var(--gold-400)", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      🖼️ عرض الإيصال
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {pay.status === "VERIFYING" && (
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                  <button
                    onClick={() => handleDecision(pay.id, "APPROVED")}
                    className="btn btn-gold btn-sm"
                  >
                    ✅ قبول الإيصال — تأكيد الدفع
                  </button>
                  <button
                    onClick={() => handleDecision(pay.id, "REJECTED")}
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--status-cancelled-text)", borderColor: "rgba(248,113,113,0.3)" }}
                  >
                    ❌ رفض الإيصال
                  </button>
                </div>
              )}
              {pay.status !== "VERIFYING" && (
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: pay.status === "APPROVED" ? "var(--status-delivered-text)" : "var(--status-cancelled-text)" }}>
                    {pay.status === "APPROVED" ? "✔️ تم قبول الدفع وتأكيده" : "✗ تم رفض الإيصال"}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
