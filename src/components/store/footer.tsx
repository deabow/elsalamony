import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--navy-950)",
      borderTop: "1px solid var(--border-strong)",
      padding: "48px 0 32px",
      marginTop: "auto",
      width: "100%",
      transition: "background 0.3s ease, border-color 0.3s ease",
    }}>
      <div className="container">
        <div className="divider-gold" style={{ marginBottom: "40px" }} />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          marginBottom: "40px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg, var(--gold-500), var(--gold-400))",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                <img 
                  src="/logo.jpeg" 
                  alt="لوجو مطبعة السلاموني" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
              <div style={{ fontSize: "16px", fontWeight: 900, fontFamily: "var(--font-heading)", color: "var(--gold-400)" }}>
                مطبعة السلاموني
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--foreground-subtle)", lineHeight: 1.8 }}>
              طباعة احترافية راقية بخبرة سنين وضمان الجودة في كل طلب.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold-400)", marginBottom: "16px" }}>
              روابط سريعة
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/branches", label: "فروعنا" },
                { href: "/b2b", label: "بوابة الشركات" },
                { href: "/order-tracking", label: "تتبع الطلب" },
                { href: "/dashboard", label: "دخول الموظفين" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold-400)", marginBottom: "16px" }}>
              تواصل معنا
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "var(--foreground-subtle)" }}>
              <span>📍 القاهرة، مصر</span>
              <span>📞 +20 1XX XXX XXXX</span>
              <span>📧 info@elsalamony.com</span>
            </div>
          </div>
        </div>

        <div className="divider-gold" style={{ marginBottom: "24px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>
            © {new Date().getFullYear()} مطبعة السلاموني — جميع الحقوق محفوظة
          </p>
          <div style={{ color: "var(--gold-600)", fontSize: "12px" }}>
            صُنع بـ ❤️ للطباعة الاحترافية
          </div>
        </div>
      </div>
    </footer>
  );
}
