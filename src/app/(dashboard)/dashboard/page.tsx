export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";

// ── Stat card component ──
function StatCard({
  label,
  value,
  sub,
  colorVar,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  colorVar: string;
  icon: string;
}) {
  return (
    <div className="card-premium ornament-card gold-top" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ fontSize: "11px", color: "var(--foreground-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </div>
        <div style={{
          width: "38px", height: "38px",
          background: "rgba(244,185,66,0.08)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: "30px", fontWeight: 900, color: colorVar, marginBottom: "6px", fontFamily: "var(--font-heading)" }}>
        {value}
      </div>
      <div style={{ fontSize: "11px", color: "var(--foreground-subtle)" }}>{sub}</div>
    </div>
  );
}

export default async function DashboardOverview() {
  // ── Live stats from DB (with fallback) ──
  let stats = {
    revenue: 0,
    activeJobs: 0,
    pendingPayments: 0,
    inquiriesCount: 0,
  };

  try {
    const [orderSum, activeCount, pendingCount, inquiryCount] = await Promise.all([
      prisma.order.aggregate({ where: { status: "DELIVERED" }, _sum: { total_price: true } }),
      prisma.order.count({ where: { status: { in: ["PENDING", "PRINTING", "READY"] } } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.corporateInquiry.count({
        where: { created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
    ]);
    stats = {
      revenue: Number(orderSum._sum.total_price ?? 0),
      activeJobs: activeCount,
      pendingPayments: pendingCount,
      inquiriesCount: inquiryCount,
    };
  } catch {
    // DB not yet migrated — fallback values shown
  }

  const STAT_CARDS = [
    {
      label: "الإيرادات المحصّلة",
      value: `${stats.revenue.toLocaleString("ar-EG")} ج.م`,
      sub: "إجمالي الطلبات المُسلَّمة والمدفوعة",
      colorVar: "var(--status-delivered-text)",
      icon: "💰",
    },
    {
      label: "وظائف الطباعة النشطة",
      value: `${stats.activeJobs} طلب`,
      sub: "قيد الجدولة أو الطباعة أو التعبئة",
      colorVar: "var(--status-printing-text)",
      icon: "⚙️",
    },
    {
      label: "مدفوعات بانتظار التحقق",
      value: `${stats.pendingPayments} إيصال`,
      sub: "في انتظار مراجعة المحاسب",
      colorVar: "var(--status-pending-text)",
      icon: "💳",
    },
    {
      label: "استفسارات الشركات (30 يوم)",
      value: `${stats.inquiriesCount} استفسار`,
      sub: "بانتظار مراجعة وإعداد العرض",
      colorVar: "var(--status-ready-text)",
      icon: "🏢",
    },
  ];

  const workflowStages = [
    { label: "⌛ بانتظار ما قبل الطباعة (Pre-Press)", status: "pending", count: stats.pendingPayments },
    { label: "⚙️ جارٍ تحميلها على الماكينة", status: "printing", count: Math.max(0, stats.activeJobs - stats.pendingPayments) },
    { label: "📦 جاهزة للاستلام / التسليم", status: "ready", count: 0 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

      {/* ── Page header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontFamily: "var(--font-heading)", color: "var(--foreground)", marginBottom: "6px" }}>
            لوحة التحكم الرئيسية
          </h1>
          <p style={{ color: "var(--foreground-subtle)", fontSize: "14px" }}>
            نظرة عامة على عمليات مطبعة السلاموني — محدّثة لحظياً
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard/orders" className="btn btn-gold btn-sm">
            📦 &nbsp; طوابير الطلبات
          </Link>
          <Link href="/dashboard/payments" className="btn btn-navy btn-sm">
            💳 &nbsp; مراجعة الدفع
          </Link>
        </div>
      </div>

      <div className="divider-gold" />

      {/* ── Stats Grid ── */}
      <div className="grid grid-4">
        {STAT_CARDS.map((sc) => (
          <StatCard key={sc.label} {...sc} />
        ))}
      </div>

      {/* ── Main split area ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "28px" }}>

        {/* Workflow board */}
        <div className="card-premium">
          <h2 style={{ fontSize: "17px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>🗂️</span>
            <span>ملخص حالة الطلبات</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {workflowStages.map((ws) => (
              <div key={ws.label} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
              }}>
                <span style={{ fontSize: "14px" }}>{ws.label}</span>
                <span className={`badge badge-${ws.status}`}>{ws.count} طلب</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", marginTop: "20px", textAlign: "center" }}>
            <Link href="/dashboard/orders" className="btn btn-ghost btn-sm" style={{ width: "100%" }}>
              عرض كل الطلبات ←
            </Link>
          </div>
        </div>

        {/* Operations log */}
        <div className="card-premium">
          <h2 style={{ fontSize: "17px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>📋</span>
            <span>سجل التنبيهات والأنشطة</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { time: "منذ 10 دقائق", text: "تم رفع إيصال دفع فودافون كاش لطلب #ord-8372", type: "payment" },
              { time: "منذ ساعة", text: "استفسار B2B جديد من مصنع حديد الإسكندرية", type: "b2b" },
              { time: "منذ ساعتين", text: "طلب #ord-3829 تم تحديث حالته إلى «جارٍ الطباعة»", type: "status" },
              { time: "أمس", text: "تم تسليم طلب #ord-2210 للعميل بنجاح", type: "delivered" },
            ].map((a, idx, arr) => (
              <div key={idx} style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                borderBottom: idx < arr.length - 1 ? "1px solid var(--border)" : "none",
                paddingBottom: idx < arr.length - 1 ? "14px" : 0,
              }}>
                <span style={{ fontSize: "11px", color: "var(--gold-600)", fontWeight: 600 }}>{a.time}</span>
                <span style={{ fontSize: "13px", color: "var(--foreground-muted)", lineHeight: 1.6 }}>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="card-premium">
        <h2 style={{ fontSize: "17px", marginBottom: "20px" }}>⚡ إجراءات سريعة</h2>
        <div className="grid grid-4">
          {[
            { href: "/dashboard/catalog", icon: "➕", label: "إضافة منتج جديد" },
            { href: "/dashboard/orders", icon: "📦", label: "عرض الطلبات المعلقة" },
            { href: "/dashboard/payments", icon: "✅", label: "مراجعة الإيصالات" },
            { href: "/dashboard/b2b", icon: "🏢", label: "استفسارات الشركات" },
          ].map((qa) => (
            <Link
              key={qa.href}
              href={qa.href}
              className="dashboard-quick-action"
            >
              <span style={{ fontSize: "26px" }}>{qa.icon}</span>
              <span>{qa.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
