"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Building2, 
  Search, 
  ShieldCheck, 
  MapPin, 
  UserCheck, 
  Printer, 
  Sparkles 
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    // Sync React theme state with DOM data attribute set by layout script
    const currentTheme = document.documentElement.getAttribute("data-theme") as "dark" | "light" | null;
    if (currentTheme) {
      setTheme(currentTheme);
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      background: scrolled 
        ? "var(--surface-overlay)" 
        : "rgba(8, 16, 36, 0.75)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--glass-border)",
      boxShadow: scrolled ? "0 10px 30px rgba(0, 0, 0, 0.3)" : "none",
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: scrolled ? "12px clamp(20px, 5vw, 40px)" : "16px clamp(24px, 6vw, 48px)",
        position: "relative",
        transition: "padding 0.3s ease",
      }}>
        
        {/* Logo Section */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "14px" }} className="cursor-pointer">
          <div style={{
            width: "44px", height: "44px",
            background: "linear-gradient(135deg, var(--gold-400), var(--gold-600))",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 18px rgba(245, 184, 55, 0.35)",
            overflow: "hidden",
            flexShrink: 0,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            <img 
              src="/logo.jpeg" 
              alt="شعار مطبعة السلاموني" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
          <div>
            <div style={{
              fontSize: "18px",
              fontWeight: 800,
              fontFamily: "var(--font-heading)",
              color: "var(--gold-400)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              السلاموني
              <span style={{ 
                fontSize: "10px", 
                padding: "2px 6px", 
                borderRadius: "4px", 
                background: "rgba(245, 184, 55, 0.15)", 
                color: "var(--gold-300)",
                border: "1px solid rgba(245, 184, 55, 0.3)",
                fontWeight: 600
              }}>مطبعة</span>
            </div>
            <div style={{
              fontSize: "11px",
              color: "var(--foreground-subtle)",
              fontWeight: 500,
              letterSpacing: "0.02em",
              transition: "color 0.3s ease",
            }}>
              Elsalamony Printing House
            </div>
          </div>
        </Link>

        {/* Navigation & Controls (Desktop) */}
        <div className="desktop-nav-controls" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <Link 
              href="/" 
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Printer size={16} style={{ opacity: 0.8 }} />
              الرئيسية
            </Link>
            <Link 
              href="/products" 
              className={`nav-link ${pathname?.startsWith("/products") ? "active" : ""}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Sparkles size={16} style={{ opacity: 0.8 }} />
              المنتجات والكتالوج
            </Link>
            <Link 
              href="/b2b" 
              className={`nav-link ${pathname === "/b2b" ? "active" : ""}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Building2 size={16} style={{ opacity: 0.8 }} />
              بوابة الشركات
            </Link>
            <Link 
              href="/order-tracking" 
              className={`nav-link ${pathname === "/order-tracking" ? "active" : ""}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <ShieldCheck size={16} style={{ opacity: 0.8 }} />
              تتبع الطلب
            </Link>
            <Link 
              href="/branches" 
              className={`nav-link ${pathname === "/branches" ? "active" : ""}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <MapPin size={16} style={{ opacity: 0.8 }} />
              فروعنا
            </Link>
          </nav>

          <div style={{ height: "22px", width: "1px", background: "var(--border)" }} />

          {/* Theme Switcher & Dashboard Access */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button
              onClick={toggleTheme}
              className="cursor-pointer"
              style={{
                background: "rgba(245, 184, 55, 0.1)",
                border: "1px solid var(--border)",
                color: "var(--gold-400)",
                borderRadius: "50%",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
              }}
              title={theme === "dark" ? "الوضع المضيء" : "الوضع المظلم"}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.background = "rgba(245, 184, 55, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(245, 184, 55, 0.1)";
              }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link href="/dashboard" className="btn btn-gold btn-sm cursor-pointer" style={{ gap: "6px" }}>
              <UserCheck size={15} />
              دخول الموظفين
            </Link>
          </div>
        </div>

        {/* Mobile Header Action Controls */}
        <div className="mobile-header-controls" style={{ display: "none", alignItems: "center", gap: "10px", zIndex: 110 }}>
          <button
            onClick={toggleTheme}
            className="cursor-pointer"
            style={{
              background: "rgba(245, 184, 55, 0.1)",
              border: "1px solid var(--border)",
              color: "var(--gold-400)",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={theme === "dark" ? "الوضع المضيء" : "الوضع المظلم"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            className="mobile-menu-btn cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(245, 184, 55, 0.12)",
              border: "1px solid var(--gold-500)",
              color: "var(--gold-400)",
              borderRadius: "10px",
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
            }}
            title="القائمة"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer Overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay animate-in" style={{
          position: "fixed",
          top: "68px",
          left: 0,
          right: 0,
          height: "calc(100vh - 68px)",
          background: "linear-gradient(180deg, rgba(8, 16, 36, 0.96) 0%, rgba(4, 8, 18, 0.98) 100%)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "24px 20px 40px",
          zIndex: 99,
          borderTop: "1px solid var(--border)",
          overflowY: "auto",
        }}>
          <nav style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            <Link 
              href="/" 
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "16px",
                fontWeight: pathname === "/" ? 700 : 500,
                color: pathname === "/" ? "var(--gold-400)" : "var(--foreground)",
                background: pathname === "/" ? "rgba(245, 184, 55, 0.12)" : "rgba(255,255,255,0.02)",
                border: pathname === "/" ? "1px solid var(--border-strong)" : "1px solid var(--border)",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Printer size={20} style={{ color: "var(--gold-400)" }} />
                <span>الرئيسية</span>
              </div>
              <span style={{ fontSize: "18px", opacity: 0.5 }}>‹</span>
            </Link>

            <Link 
              href="/products" 
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "16px",
                fontWeight: pathname?.startsWith("/products") ? 700 : 500,
                color: pathname?.startsWith("/products") ? "var(--gold-400)" : "var(--foreground)",
                background: pathname?.startsWith("/products") ? "rgba(245, 184, 55, 0.12)" : "rgba(255,255,255,0.02)",
                border: pathname?.startsWith("/products") ? "1px solid var(--border-strong)" : "1px solid var(--border)",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Sparkles size={20} style={{ color: "var(--gold-400)" }} />
                <span>المنتجات والكتالوج</span>
              </div>
              <span style={{ fontSize: "18px", opacity: 0.5 }}>‹</span>
            </Link>

            <Link 
              href="/b2b" 
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "16px",
                fontWeight: pathname === "/b2b" ? 700 : 500,
                color: pathname === "/b2b" ? "var(--gold-400)" : "var(--foreground)",
                background: pathname === "/b2b" ? "rgba(245, 184, 55, 0.12)" : "rgba(255,255,255,0.02)",
                border: pathname === "/b2b" ? "1px solid var(--border-strong)" : "1px solid var(--border)",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Building2 size={20} style={{ color: "var(--gold-400)" }} />
                <span>بوابة الشركات</span>
              </div>
              <span style={{ fontSize: "18px", opacity: 0.5 }}>‹</span>
            </Link>

            <Link 
              href="/order-tracking" 
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "16px",
                fontWeight: pathname === "/order-tracking" ? 700 : 500,
                color: pathname === "/order-tracking" ? "var(--gold-400)" : "var(--foreground)",
                background: pathname === "/order-tracking" ? "rgba(245, 184, 55, 0.12)" : "rgba(255,255,255,0.02)",
                border: pathname === "/order-tracking" ? "1px solid var(--border-strong)" : "1px solid var(--border)",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ShieldCheck size={20} style={{ color: "var(--gold-400)" }} />
                <span>تتبع الطلب</span>
              </div>
              <span style={{ fontSize: "18px", opacity: 0.5 }}>‹</span>
            </Link>

            <Link 
              href="/branches" 
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "16px",
                fontWeight: pathname === "/branches" ? 700 : 500,
                color: pathname === "/branches" ? "var(--gold-400)" : "var(--foreground)",
                background: pathname === "/branches" ? "rgba(245, 184, 55, 0.12)" : "rgba(255,255,255,0.02)",
                border: pathname === "/branches" ? "1px solid var(--border-strong)" : "1px solid var(--border)",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <MapPin size={20} style={{ color: "var(--gold-400)" }} />
                <span>فروعنا</span>
              </div>
              <span style={{ fontSize: "18px", opacity: 0.5 }}>‹</span>
            </Link>
          </nav>

          {/* Quick Footer Action Button */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
            <Link 
              href="/dashboard" 
              onClick={() => setMenuOpen(false)}
              className="btn btn-gold cursor-pointer" 
              style={{ width: "100%", padding: "16px", textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", fontSize: "15px" }}
            >
              <UserCheck size={18} />
              <span>دخول الموظفين واللوحة</span>
            </Link>

            <div style={{ textAlign: "center", fontSize: "12px", color: "var(--foreground-subtle)" }}>
              مطبعة السلاموني © {new Date().getFullYear()} — جميع الحقوق محفوظة
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
