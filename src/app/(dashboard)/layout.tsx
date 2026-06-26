"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "نظرة عامة",         path: "/dashboard",          icon: "📊", roles: ["ADMIN", "DESIGNER", "ACCOUNTANT"] },
  { label: "طوابير الطلبات",    path: "/dashboard/orders",   icon: "📦", roles: ["ADMIN", "DESIGNER"] },
  { label: "مراجعة المدفوعات",  path: "/dashboard/payments", icon: "💳", roles: ["ADMIN", "ACCOUNTANT"] },
  { label: "استفسارات الشركات", path: "/dashboard/b2b",      icon: "🏢", roles: ["ADMIN", "ACCOUNTANT"] },
  { label: "إدارة المنتجات",    path: "/dashboard/catalog",  icon: "🏷️", roles: ["ADMIN"] },
];

type Role = "ADMIN" | "DESIGNER" | "ACCOUNTANT";

const ROLE_LABELS: Record<Role, string> = {
  ADMIN:      "مدير النظام",
  DESIGNER:   "مصمم",
  ACCOUNTANT: "محاسب",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<Role>("ADMIN");
  const [collapsed, setCollapsed] = useState(false);

  const visibleNav = NAV_ITEMS.filter((n) => n.roles.includes(activeRole));

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", background: "var(--navy-950)" }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{
        width: collapsed ? "72px" : "280px",
        minWidth: collapsed ? "72px" : "280px",
        background: "var(--navy-900)",
        borderLeft: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: collapsed ? "20px 10px" : "24px 20px",
        transition: "width 0.3s ease, min-width 0.3s ease, padding 0.3s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}>

        {/* Logo Row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "28px",
          justifyContent: collapsed ? "center" : "space-between",
        }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg, var(--gold-500), var(--gold-400))",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "var(--shadow-glow)",
                overflow: "hidden",
              }}>
                <img src="/logo.jpeg" alt="لوجو مطبعة السلاموني" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "var(--gold-400)", fontFamily: "var(--font-heading)", lineHeight: 1.1 }}>
                  السلاموني
                </div>
                <div style={{ fontSize: "10px", color: "var(--foreground-subtle)" }}>Staff Workspace</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "6px 8px",
              cursor: "pointer",
              color: "var(--foreground-muted)",
              fontSize: "12px",
              flexShrink: 0,
            }}
            title={collapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* Role Picker */}
        {!collapsed && (
          <div style={{
            background: "rgba(244,185,66,0.05)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "14px",
            marginBottom: "24px",
          }}>
            <span style={{ display: "block", fontSize: "11px", color: "var(--foreground-subtle)", marginBottom: "10px", fontWeight: 600 }}>
              الصلاحية الحالية:
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {(["ADMIN", "DESIGNER", "ACCOUNTANT"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRole(r)}
                  style={{
                    padding: "7px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    borderRadius: "var(--radius-xs)",
                    border: activeRole === r ? "1px solid var(--gold-500)" : "1px solid var(--border)",
                    cursor: "pointer",
                    background: activeRole === r ? "rgba(244,185,66,0.15)" : "transparent",
                    color: activeRole === r ? "var(--gold-400)" : "var(--foreground-muted)",
                    textAlign: "right",
                    fontFamily: "var(--font-arabic)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {visibleNav.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                title={collapsed ? item.label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: collapsed ? "12px" : "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isActive ? "var(--gold-300)" : "var(--foreground-muted)",
                  background: isActive ? "rgba(244, 185, 66, 0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(244, 185, 66, 0.3)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Links */}
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "13px",
              color: "var(--foreground-subtle)",
              padding: "10px",
              borderRadius: "var(--radius-xs)",
              transition: "color 0.2s ease",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            title="عرض المتجر الإلكتروني"
          >
            <span>🏪</span>
            {!collapsed && <span>الرجوع للمتجر</span>}
          </Link>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <main style={{
        flex: 1,
        background: "#0a0f1e",
        overflowY: "auto",
        minHeight: "100vh",
      }}>
        {/* Top bar */}
        <div style={{
          background: "rgba(9, 18, 37, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>لوحة التحكم</span>
            <span style={{ color: "var(--border-strong)" }}>›</span>
            <span style={{ fontSize: "13px", color: "var(--gold-400)", fontWeight: 600 }}>
              {NAV_ITEMS.find((n) => n.path === pathname)?.label ?? "نظرة عامة"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="badge badge-gold" style={{ fontSize: "11px" }}>
              {ROLE_LABELS[activeRole]}
            </span>
            <div style={{
              width: "34px", height: "34px",
              background: "linear-gradient(135deg, var(--gold-600), var(--earth-400))",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px",
            }}>
              👤
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "36px 40px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
