import React from "react";
import Link from "next/link";
import { 
  MapPin, 
  PhoneCall, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  ChevronLeft
} from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--navy-950)",
      borderTop: "1px solid var(--border-strong)",
      padding: "60px 0 36px",
      marginTop: "auto",
      width: "100%",
      position: "relative",
      overflow: "hidden",
      transition: "background 0.3s ease, border-color 0.3s ease",
    }}>
      {/* Soft background glow orb */}
      <div aria-hidden="true" style={{
        position: "absolute",
        bottom: "-100px",
        right: "10%",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245, 184, 55, 0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="divider-gold" style={{ marginBottom: "48px" }} />
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "48px",
          marginBottom: "48px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div style={{
                width: "42px", height: "42px",
                background: "linear-gradient(135deg, var(--gold-400), var(--gold-600))",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(245, 184, 55, 0.3)",
                overflow: "hidden",
              }}>
                <img 
                  src="/logo.jpeg" 
                  alt="لوجو مطبعة السلاموني" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--gold-400)" }}>
                  مطبعة السلاموني
                </div>
                <div style={{ fontSize: "11px", color: "var(--foreground-subtle)" }}>
                  Elsalamony Printing House
                </div>
              </div>
            </div>
            <p style={{ fontSize: "13.5px", color: "var(--foreground-muted)", lineHeight: 1.85 }}>
              شريكك الأول في حلول الطباعة والأوفست والدعاية والإعلان للمصانع والشركات الكبرى بمدينة السادات والإسكندرية.
            </p>
            <div style={{ marginTop: "18px", display: "inline-flex", alignItems: "center", gap: "6px" }} className="badge badge-gold">
              <ShieldCheck size={14} />
              <span>ضمان الجودة والتسليم في الموعد</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--gold-400)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={16} />
              روابط سريعة
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/b2b", label: "بوابة الشركات والمصانع" },
                { href: "/order-tracking", label: "تتبع حالة الطلب" },
                { href: "/branches", label: "فروع السادات والإسكندرية" },
                { href: "/dashboard", label: "بوابة دخول الموظفين" },
              ].map((l) => (
                <Link 
                  key={l.href} 
                  href={l.href} 
                  className="footer-link cursor-pointer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <ChevronLeft size={14} style={{ color: "var(--gold-500)", opacity: 0.7 }} />
                  <span>{l.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Branches & Locations */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--gold-400)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={16} />
              فروعنا الرئيسية
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13.5px", color: "var(--foreground-muted)" }}>
              <div style={{ background: "rgba(245, 184, 55, 0.05)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, color: "var(--gold-300)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Building2 size={14} /> فرع مدينة السادات
                </div>
                <p style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>المنطقة الصناعية - تخدم مصانع وشركات السادات والجيزة</p>
              </div>

              <div style={{ background: "rgba(245, 184, 55, 0.05)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, color: "var(--gold-300)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Building2 size={14} /> فرع الإسكندرية
                </div>
                <p style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>وسط البلد - تخدم المحافظات الساحلية والوجه البحري</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--gold-400)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <PhoneCall size={16} />
              التواصل والدعم
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13.5px", color: "var(--foreground-muted)" }}>
              <a href="tel:01020243667" style={{ display: "flex", alignItems: "center", gap: "10px", color: "inherit" }}>
                <PhoneCall size={16} style={{ color: "var(--gold-400)" }} />
                <span dir="ltr">01020243667</span>
              </a>
              <a href="mailto:elsalamony.press@gmail.com" style={{ display: "flex", alignItems: "center", gap: "10px", color: "inherit" }}>
                <Mail size={16} style={{ color: "var(--gold-400)" }} />
                <span>elsalamony.press@gmail.com</span>
              </a>
              <a 
                href="https://web.facebook.com/profile.php?id=61574792639388" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--gold-300)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--gold-400)" }}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>صفحتنا على فيسبوك</span>
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Clock size={16} style={{ color: "var(--gold-400)" }} />
                <span>السبت - الخميس: 9:00 ص - 9:00 م</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-gold" style={{ marginBottom: "28px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ fontSize: "13px", color: "var(--foreground-subtle)" }}>
            © {new Date().getFullYear()} مطبعة السلاموني — جميع الحقوق محفوظة | Elsalamony Printing House
          </p>
          <div style={{ color: "var(--gold-400)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={14} />
            <span>تصميم وتنفيذ عالي الجودة للطباعة الاحترافية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
