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

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "rgba(245, 184, 55, 0.1)",
            border: "1px solid var(--border)",
            color: "var(--gold-400)",
            borderRadius: "10px",
            width: "42px",
            height: "42px",
            display: "none", // Managed by CSS media query
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s ease",
            zIndex: 110,
          }}
          title="القائمة"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Mobile Menu Drawer Overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay animate-in" style={{
          position: "fixed",
          top: "72px", // Height of sticky header
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
            gap: "22px",
          }}>
            <Link 
              href="/" 
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
              style={{ fontSize: "18px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Printer size={18} />
              الرئيسية
            </Link>
            <Link 
              href="/b2b" 
              className={`nav-link ${pathname === "/b2b" ? "active" : ""}`}
              style={{ fontSize: "18px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Building2 size={18} />
              بوابة الشركات
            </Link>
            <Link 
              href="/order-tracking" 
              className={`nav-link ${pathname === "/order-tracking" ? "active" : ""}`}
              style={{ fontSize: "18px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}
            >
              <ShieldCheck size={18} />
              تتبع الطلب
            </Link>
            <Link 
              href="/branches" 
              className={`nav-link ${pathname === "/branches" ? "active" : ""}`}
              style={{ fontSize: "18px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}
            >
              <MapPin size={18} />
              فروعنا
            </Link>
          </nav>

          <div style={{ width: "100px", height: "1px", background: "var(--border)" }} />

          {/* Theme Switcher & Dashboard Access */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: "100%", maxWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "14px", color: "var(--foreground-muted)" }}>الوضع الحالي:</span>
              <button
                onClick={toggleTheme}
                className="cursor-pointer"
                style={{
                  background: "rgba(245, 184, 55, 0.1)",
                  border: "1px solid var(--border)",
                  color: "var(--gold-400)",
                  borderRadius: "50%",
                  width: "42px",
                  height: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <Link 
              href="/dashboard" 
              className="btn btn-gold cursor-pointer" 
              style={{ width: "100%", padding: "14px 20px", textAlign: "center", display: "flex", justifyContent: "center" }}
            >
              <UserCheck size={18} />
              دخول الموظفين
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
