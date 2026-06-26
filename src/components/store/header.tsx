"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    // Sync React theme state with DOM data attribute set by layout script
    const currentTheme = document.documentElement.getAttribute("data-theme") as "dark" | "light" | null;
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--surface-overlay)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
      transition: "background 0.3s ease, border-color 0.3s ease",
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px clamp(24px, 6vw, 48px)", // Responsive premium horizontal padding
        position: "relative",
      }}>
        
        {/* Logo Section */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "42px", height: "42px",
            background: "linear-gradient(135deg, var(--gold-500), var(--gold-400))",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(244, 185, 66, 0.3)",
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <img 
              src="/logo.jpeg" 
              alt="شعار مطبعة السلاموني" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
          <div>
            <div style={{
              fontSize: "17px",
              fontWeight: 900,
              fontFamily: "var(--font-heading)",
              color: "var(--gold-400)",
              lineHeight: 1.1,
            }}>
              السلاموني
            </div>
            <div style={{
              fontSize: "10px",
              color: "var(--foreground-subtle)",
              transition: "color 0.3s ease",
            }}>
              Elsalamony Printing House
            </div>
          </div>
        </Link>

        {/* Navigation & Controls (Desktop) */}
        <div className="desktop-nav-controls" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <nav style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            <Link 
              href="/" 
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
            >
              الرئيسية
            </Link>
            <Link 
              href="/b2b" 
              className={`nav-link ${pathname === "/b2b" ? "active" : ""}`}
            >
              بوابة الشركات
            </Link>
            <Link 
              href="/order-tracking" 
              className={`nav-link ${pathname === "/order-tracking" ? "active" : ""}`}
            >
              تتبع الطلب
            </Link>
            <Link 
              href="/branches" 
              className={`nav-link ${pathname === "/branches" ? "active" : ""}`}
            >
              فروعنا
            </Link>
          </nav>

          <div style={{ height: "20px", width: "1px", background: "var(--border)" }} />

          {/* Theme Switcher & Dashboard Access */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={toggleTheme}
              style={{
                background: "rgba(244, 185, 66, 0.08)",
                border: "1px solid var(--border)",
                color: "var(--gold-400)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.25s ease",
                fontSize: "16px",
              }}
              title={theme === "dark" ? "الوضع المضيء" : "الوضع المظلم"}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.background = "rgba(244, 185, 66, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(244, 185, 66, 0.08)";
              }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <Link href="/dashboard" className="btn btn-gold btn-sm">
              دخول الموظفين
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "rgba(244, 185, 66, 0.08)",
            border: "1px solid var(--border)",
            color: "var(--gold-400)",
            borderRadius: "8px",
            width: "40px",
            height: "40px",
            display: "none", // Managed by CSS media query
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.25s ease",
            zIndex: 110,
          }}
          title="القائمة"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

      </div>

      {/* Mobile Menu Drawer Overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay animate-in" style={{
          position: "fixed",
          top: "75px", // Height of sticky header
          left: 0,
          right: 0,
          bottom: 0,
          background: "var(--surface-overlay)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          padding: "40px 24px",
          zIndex: 99,
          borderTop: "1px solid var(--border)",
        }}>
          <nav style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}>
            <Link 
              href="/" 
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
              style={{ fontSize: "18px", fontWeight: 600 }}
            >
              الرئيسية
            </Link>
            <Link 
              href="/b2b" 
              className={`nav-link ${pathname === "/b2b" ? "active" : ""}`}
              style={{ fontSize: "18px", fontWeight: 600 }}
            >
              بوابة الشركات
            </Link>
            <Link 
              href="/order-tracking" 
              className={`nav-link ${pathname === "/order-tracking" ? "active" : ""}`}
              style={{ fontSize: "18px", fontWeight: 600 }}
            >
              تتبع الطلب
            </Link>
            <Link 
              href="/branches" 
              className={`nav-link ${pathname === "/branches" ? "active" : ""}`}
              style={{ fontSize: "18px", fontWeight: 600 }}
            >
              فروعنا
            </Link>
          </nav>

          <div style={{ width: "80px", height: "1px", background: "var(--border)" }} />

          {/* Theme Switcher & Dashboard Access */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: "100%", maxWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "14px", color: "var(--foreground-muted)" }}>الوضع الحالي:</span>
              <button
                onClick={toggleTheme}
                style={{
                  background: "rgba(244, 185, 66, 0.08)",
                  border: "1px solid var(--border)",
                  color: "var(--gold-400)",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>

            <Link 
              href="/dashboard" 
              className="btn btn-gold" 
              style={{ width: "100%", padding: "12px 18px", textAlign: "center" }}
            >
              دخول الموظفين
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
