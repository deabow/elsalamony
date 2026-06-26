"use client";

import React, { useState, useEffect } from "react";

interface Inquiry {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  details: string;
  status: "NEW" | "REVIEWED" | "QUOTED" | "CLOSED";
  createdAt: string;
}

const STATUS_AR: Record<string, string> = {
  NEW:      "جديد",
  REVIEWED: "تمت المراجعة",
  QUOTED:   "تم إرسال العرض",
  CLOSED:   "مغلق",
};

const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "inq-001",
    companyName: "مصنع حديد الإسكندرية",
    contactPerson: "المهندس كريم صادق",
    email: "karim@ironalex.com",
    phone: "01020243667",
    details: "نوع المنتج: لوحات سلامة صناعية\nالكمية: 200 لوحة\nالمواصفات: PVC صلب 3mm — UV مقاوم — بأرقام الغرف",
    status: "NEW",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inq-002",
    companyName: "مجموعة أوركيد للتعليم",
    contactPerson: "أ. منة رمضان",
    email: "mona@orchid-edu.com",
    phone: "01020243667",
    details: "نوع المنتج: دفاتر شركات مخصوصة\nالكمية: 1000 دفتر\nالمواصفات: غلاف مطبوع بشعار الشركة — 96 ورقة — سلك معدني",
    status: "REVIEWED",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "inq-003",
    companyName: "شركة ريماكس للتسويق",
    contactPerson: "أحمد يوسف",
    email: "ahmed@remax-mkt.com",
    phone: "01020243667",
    details: "نوع المنتج: بروشورات ثلاثية الطي\nالكمية: 5000 بروشور\nالمواصفات: ورق 170 جرام — طباعة ألوان كاملة — جلوس",
    status: "QUOTED",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export default function B2BInquiriesDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const res = await fetch("/api/b2b/inquiries");
        if (res.ok) {
          const data = await res.json();
          if (data.inquiries?.length > 0) setInquiries(data.inquiries);
        }
      } catch { /* using mock */ }
    }
    fetchInquiries();
  }, []);

  const handleStatusChange = (id: string, newStatus: Inquiry["status"]) => {
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status: newStatus } : i));
  };

  const filtered = inquiries.filter((i) =>
    filterStatus === "ALL" || i.status === filterStatus
  );

  const newCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontFamily: "var(--font-heading)", marginBottom: "6px" }}>
            🏢 استفسارات الشركات والمصانع
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px" }}>
            راجع استفسارات B2B الواردة وتابع حالة عروض الأسعار
          </p>
        </div>
        {newCount > 0 && (
          <div className="badge badge-gold" style={{ fontSize: "14px", padding: "8px 18px" }}>
            ✉️ {newCount} استفسار جديد
          </div>
        )}
      </div>

      <div className="divider-gold" />

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[
          { key: "ALL",      label: "الكل" },
          { key: "NEW",      label: "جديد" },
          { key: "REVIEWED", label: "تمت المراجعة" },
          { key: "QUOTED",   label: "تم إرسال العرض" },
          { key: "CLOSED",   label: "مغلق" },
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

      {/* Inquiries */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filtered.length === 0 ? (
          <div className="card-premium" style={{ textAlign: "center", padding: "48px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📭</div>
            <p style={{ color: "var(--foreground-muted)" }}>لا توجد استفسارات في هذه الفئة</p>
          </div>
        ) : (
          filtered.map((inq) => {
            const isExpanded = expandedId === inq.id;
            return (
              <div key={inq.id} className="card-premium" style={{
                borderColor: inq.status === "NEW" ? "rgba(244,185,66,0.4)" : "var(--border)",
              }}>
                {/* Header */}
                <div
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    gap: "12px", cursor: "pointer",
                    paddingBottom: isExpanded ? "14px" : 0,
                    borderBottom: isExpanded ? "1px solid var(--border)" : "none",
                    marginBottom: isExpanded ? "14px" : 0,
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                >
                  <div>
                    <h3 style={{ fontSize: "17px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>🏢 {inq.companyName}</span>
                      <span className={`badge ${
                        inq.status === "NEW" ? "badge-gold" :
                        inq.status === "REVIEWED" ? "badge-printing" :
                        inq.status === "QUOTED" ? "badge-delivered" : "badge-cancelled"
                      }`} style={{ fontSize: "11px" }}>
                        {STATUS_AR[inq.status]}
                      </span>
                    </h3>
                    <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>
                      وصل في: {new Date(inq.createdAt).toLocaleString("ar-EG")}
                    </span>
                  </div>
                  <span style={{ color: "var(--foreground-subtle)", fontSize: "18px", userSelect: "none" }}>
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>

                {isExpanded && (
                  <>
                    {/* Details grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px", fontSize: "14px" }}>
                      <div>
                        <span style={{ color: "var(--foreground-subtle)", fontSize: "12px" }}>الشخص المسؤول:</span>
                        <div style={{ fontWeight: 700, marginTop: "4px" }}>👤 {inq.contactPerson}</div>
                      </div>
                      <div>
                        <span style={{ color: "var(--foreground-subtle)", fontSize: "12px" }}>التليفون:</span>
                        <div style={{ fontWeight: 700, marginTop: "4px", direction: "ltr", textAlign: "right" }}>📞 {inq.phone}</div>
                      </div>
                      <div>
                        <span style={{ color: "var(--foreground-subtle)", fontSize: "12px" }}>البريد الإلكتروني:</span>
                        <div style={{ marginTop: "4px" }}>
                          <a href={`mailto:${inq.email}`} style={{ color: "var(--gold-400)", fontSize: "13px" }}>
                            ✉️ {inq.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "14px 16px",
                      marginBottom: "16px",
                    }}>
                      <span style={{ fontSize: "12px", color: "var(--gold-600)", fontWeight: 700, display: "block", marginBottom: "8px" }}>
                        تفاصيل الطلب:
                      </span>
                      <pre style={{
                        fontSize: "13px",
                        color: "var(--foreground-muted)",
                        whiteSpace: "pre-wrap",
                        fontFamily: "var(--font-arabic)",
                        lineHeight: 1.8,
                      }}>
                        {inq.details}
                      </pre>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                      {inq.status === "NEW" && (
                        <button onClick={() => handleStatusChange(inq.id, "REVIEWED")} className="btn btn-navy btn-sm">
                          👁️ تحديد كـ «تمت المراجعة»
                        </button>
                      )}
                      {(inq.status === "NEW" || inq.status === "REVIEWED") && (
                        <button onClick={() => handleStatusChange(inq.id, "QUOTED")} className="btn btn-gold btn-sm">
                          📤 إرسال عرض السعر
                        </button>
                      )}
                      {inq.status !== "CLOSED" && (
                        <button onClick={() => handleStatusChange(inq.id, "CLOSED")} className="btn btn-ghost btn-sm" style={{ color: "var(--foreground-subtle)" }}>
                          ✕ إغلاق الاستفسار
                        </button>
                      )}
                      <a href={`tel:${inq.phone.replace(/-/g, "")}`} className="btn btn-ghost btn-sm" style={{ marginRight: "auto" }}>
                        📞 اتصل الآن
                      </a>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
