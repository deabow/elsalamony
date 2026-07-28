"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";
import { MapPin, Phone, ExternalLink, Clock } from "lucide-react";

// Branches details
const BRANCHES = [
  {
    name: "فرع مدينة السادات",
    location: "مول جرين جولف، أمام الشهر العقاري",
    mapsUrl: "https://www.google.com/maps/place/%D9%85%D8%B7%D8%A8%D8%B9%D8%A9+%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%D9%88%D9%86%D9%89+(%D9%81%D8%B1%D8%B9+%D8%A7%D9%84%D8%B3%D8%A7%D8%AF%D8%A7%D8%AA)%E2%80%AD/@30.3917842,30.5410534,21z/data=!4m6!3m5!1s0x1458970018ddd9e7:0x38528e56a121b215!8m2!3d30.3918167!4d30.5410866!16s%2Fg%2F11yr38q97h?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D",
    phone: "01020243667",
    workingHours: "من السبت إلى الخميس: 9:00 ص - 10:00 م",
  },
  {
    name: "فرع الإسكندرية",
    location: "محطة مصر، وسط البلد",
    mapsUrl: "https://maps.google.com/?q=Alexandria+Misr+Station",
    phone: "01020243667",
    workingHours: "من السبت إلى الخميس: 9:00 ص - 10:00 م",
  },
];

export default function BranchesPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>

      {/* Reusable Store Header */}
      <Header />

      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(180deg, var(--surface) 0%, var(--background) 100%)",
        padding: "90px 24px 70px", // Generous vertical padding for boutique spacing
        textAlign: "center",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div className="container" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "800px",
          margin: "0 auto",
        }}>
          <div className="badge badge-gold animate-in" style={{ marginBottom: "20px", fontSize: "13px", padding: "6px 16px" }}>
            📍 مواقعنا فروع مطبعة السلاموني
          </div>
          <h1 className="animate-in-2" style={{
            fontSize: "clamp(30px, 5vw, 50px)",
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            marginBottom: "16px",
            color: "var(--foreground)",
            lineHeight: 1.3,
            textAlign: "center",
          }}>
            زورنا في <span className="gradient-gold-text">أقرب فرع ليك</span>
          </h1>
          <p className="animate-in-3" style={{ 
            color: "var(--foreground-muted)", 
            maxWidth: "600px", 
            margin: "0 auto 28px", 
            fontSize: "16px", 
            lineHeight: 1.8,
            textAlign: "center",
          }}>
            يسعدنا استقبالكم في فروعنا لتقديم أفضل خامات وتطبيقات الطباعة، ومراجعة التصاميم الخاصة بطلباتكم مباشرة.
          </p>
          <div className="arabic-divider animate-in-3" style={{ color: "var(--gold-500)", width: "100%", maxWidth: "260px", margin: "0 auto" }}>
            <span>◆</span>
          </div>
        </div>
      </section>

      {/* Branches Grid Section */}
      <section className="section" style={{ 
        flex: 1, 
        background: "var(--background)",
        padding: "80px 24px", // Premium luxury vertical/horizontal padding
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div className="container" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px", // Breathing room/negative space
            maxWidth: "1000px",
            width: "100%",
            justifyContent: "center",
            alignItems: "stretch",
          }}>
            {BRANCHES.map((b, idx) => (
              <div
                key={idx}
                className="card-premium ornament-card gold-top animate-in-2"
                style={{
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  maxWidth: "460px", // max-w-md / max-w-lg containerized size
                  width: "100%",
                  margin: "0 auto", // Center the cards in their grid cells
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                {/* Title */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%" }}>
                  <h2 style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "var(--gold-400)",
                    fontFamily: "var(--font-heading)",
                    marginBottom: "4px",
                    textAlign: "center",
                  }}>
                    {b.name}
                  </h2>
                  <div style={{ height: "2.5px", width: "50px", background: "var(--gold-600)", borderRadius: "1.5px", margin: "0 auto" }} />
                </div>

                {/* Details list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", flex: 1, justifyContent: "center" }}>

                  {/* Location Info */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      <MapPin size={18} style={{ color: "var(--gold-500)" }} />
                      <span style={{ fontSize: "13px", color: "var(--foreground-subtle)" }}>
                        العنوان والموقع
                      </span>
                    </div>
                    <span style={{ fontSize: "15px", color: "var(--foreground)", fontWeight: 600, lineHeight: 1.6 }}>
                      {b.location}
                    </span>
                  </div>

                  {/* Phone Info */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      <Phone size={18} style={{ color: "var(--gold-500)" }} />
                      <span style={{ fontSize: "13px", color: "var(--foreground-subtle)" }}>
                        تليفون الفرع للتواصل
                      </span>
                    </div>
                    <a
                      href={`tel:${b.phone}`}
                      className="footer-link"
                      style={{ 
                        fontSize: "17px", 
                        fontWeight: 700, 
                        direction: "ltr", 
                        display: "inline-block",
                        color: "var(--gold-400)",
                        textDecoration: "none",
                      }}
                    >
                      {b.phone}
                    </a>
                  </div>

                  {/* Working Hours Info */}
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    gap: "8px", 
                    paddingTop: "20px", 
                    borderTop: "1px dashed var(--border)", 
                    marginTop: "8px",
                    textAlign: "center",
                  }}>
                    <span style={{ fontSize: "13px", color: "var(--foreground-subtle)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={16} style={{ color: "var(--gold-400)" }} />
                      مواعيد العمل
                    </span>
                    <span style={{ fontSize: "14px", color: "var(--foreground-muted)" }}>
                      {b.workingHours}
                    </span>
                  </div>

                </div>

                {/* Google Maps link button */}
                <a
                  href={b.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 20px",
                    fontSize: "14px",
                    marginTop: "8px",
                  }}
                >
                  <ExternalLink size={16} />
                  شوف اللوكيشن على الخريطة
                </a>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reusable Store Footer */}
      <Footer />

    </div>
  );
}
