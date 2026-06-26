"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";

const PRODUCT_TYPES = [
  "دفاتر شركات مخصوصة",
  " لافتات رول أب",
  "بروشورات وكتيبات",
  "كروت شركات بالجملة",
  "لوحات سلامة صناعية",
  "ملصقات وأختام",
  "أكياس ومواد تعبئة",
  "غيره (حدد في التفاصيل)",
];

export default function B2BPage() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [productType, setProductType] = useState(PRODUCT_TYPES[0]);
  const [quantity, setQuantity] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setIsSubmitting(true);
    try {
      const res = await fetch("/api/b2b/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          contact_person: contactName,
          phone: contactPhone,
          email: contactEmail,
          details: `نوع المنتج: ${productType}\nالكمية: ${quantity}\nالمواصفات: ${specifications}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ في الإرسال");
      setSuccess(`تم استلام استفسارك بنجاح! سيتواصل معك فريقنا قريباً. رقم الطلب: ${data.inquiryId || "—"}`);
      setCompanyName(""); setContactName(""); setContactPhone(""); setContactEmail("");
      setQuantity(""); setSpecifications("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذّر إرسال الاستفسار. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

      {/* ══ HEADER ══ */}
      <Header />

      {/* ══ HERO ══ */}
      <section style={{
        padding: "80px 0 60px",
        background: `
          radial-gradient(ellipse 60% 50% at 15% 50%, rgba(212,150,42,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 40% 50% at 85% 30%, rgba(26,47,92,0.5) 0%, transparent 60%)
        `,
        position: "relative",
      }}>
        <div className="container">
          <div className="badge badge-gold" style={{ marginBottom: "20px" }}>🏢 &nbsp; خدمات الشركات والمصانع</div>
          <h1 className="animate-in" style={{
            fontSize: "clamp(32px, 5vw, 60px)",
            fontFamily: "var(--font-heading)",
            marginBottom: "20px",
          }}>
            بوابة الطباعة{" "}
            <span className="gradient-gold-text">للشركات والمصانع</span>
          </h1>
          <div className="arabic-divider" style={{ color: "var(--gold-500)", maxWidth: "300px", marginBottom: "20px" }}>
            <span>◆</span>
          </div>
          <p style={{ color: "var(--foreground-muted)", fontSize: "17px", maxWidth: "600px", lineHeight: 1.85 }}>
            سواء كنت شركة، مصنع، أو مدرسة — احنا هنا علشان نقدملك خدمة طباعة
            بالجملة بعروض أسعار تنافسية وفواتير رسمية وجودة ضمانة.
          </p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* ══ MAIN SPLIT ══ */}
      <section className="section">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "48px",
            alignItems: "flex-start",
          }}>

            {/* ── Inquiry Form ── */}
            <div>
              <h2 style={{ fontSize: "24px", marginBottom: "6px" }}>ابعت استفسارك دلوقتي</h2>
              <p style={{ color: "var(--foreground-muted)", fontSize: "14px", marginBottom: "28px" }}>
                املأ البيانات وسيتواصل معك فريقنا خلال 24 ساعة بعرض السعر.
              </p>

              {success ? (
                <div style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "28px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
                  <h3 style={{ marginBottom: "8px", color: "var(--status-delivered-text)" }}>تم الإرسال بنجاح!</h3>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "14px", lineHeight: 1.7 }}>{success}</p>
                  <button onClick={() => setSuccess("")} className="btn btn-outline-gold" style={{ marginTop: "20px" }}>
                    إرسال استفسار آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {error && (
                    <div style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: "var(--radius-sm)",
                      padding: "14px 16px",
                      marginBottom: "20px",
                      fontSize: "14px",
                      color: "var(--status-cancelled-text)",
                    }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="company-name">اسم الشركة / المنشأة *</label>
                      <input id="company-name" type="text" className="form-control" placeholder="شركة المثال للتجارة" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">اسم الشخص المسؤول *</label>
                      <input id="contact-name" type="text" className="form-control" placeholder="أحمد محمد" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-phone">رقم التليفون *</label>
                      <input id="contact-phone" type="tel" className="form-control ltr" placeholder="01020243667" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-email">البريد الإلكتروني</label>
                      <input id="contact-email" type="email" className="form-control ltr" placeholder="info@company.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="product-type">نوع المطبوعات المطلوبة *</label>
                      <select id="product-type" className="form-control" value={productType} onChange={(e) => setProductType(e.target.value)} required>
                        {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="quantity">الكمية المطلوبة *</label>
                      <input id="quantity" type="number" min="1" className="form-control ltr" placeholder="500" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="specifications">المواصفات التفصيلية</label>
                    <textarea
                      id="specifications"
                      className="form-control"
                      rows={5}
                      placeholder="اذكر المقاسات، الألوان المطلوبة، نوع الورق، التشطيب، وأي تفاصيل مهمة..."
                      value={specifications}
                      onChange={(e) => setSpecifications(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold btn-lg"
                    style={{ width: "100%", marginTop: "8px" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "جارٍ الإرسال..." : "📤 إرسال الاستفسار"}
                  </button>
                </form>
              )}
            </div>

            {/* ── Info Panel ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="card-premium ornament-card">
                <h3 style={{ fontSize: "18px", marginBottom: "20px", color: "var(--gold-300)" }}>
                  ✨ ليه تختارنا للشركات؟
                </h3>
                {[
                  { icon: "🏭", title: "إمكانيات طباعة ضخمة", desc: "قادرين نطبع بأي كمية من 100 حتى 100,000 قطعة بنفس جودة الكمية الصغيرة." },
                  { icon: "📄", title: "فواتير رسمية وعروض سعر", desc: "بنصدر فواتير رسمية معتمدة وعروض سعر تفصيلية جاهزة للموافقة." },
                  { icon: "🎨", title: "دعم تصميمي متكامل", desc: "فريقنا يساعدك في تجهيز الملفات إذا مش عندك مصمم، بدون رسوم إضافية." },
                  { icon: "🚚", title: "توصيل لموقعك", desc: "بنوفر خدمة التوصيل للموقع بعد الانتهاء من الطباعة، اتفق مع الفريق." },
                ].map((f) => (
                  <div key={f.title} style={{ display: "flex", gap: "14px", marginBottom: "18px" }}>
                    <div style={{
                      width: "40px", height: "40px",
                      background: "rgba(244,185,66,0.1)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", flexShrink: 0,
                    }}>
                      {f.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{f.title}</div>
                      <div style={{ color: "var(--foreground-muted)", fontSize: "13px", lineHeight: 1.7 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ textAlign: "center", padding: "24px" }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>📞</div>
                <h4 style={{ marginBottom: "6px" }}>محتاج رد أسرع؟</h4>
                <p style={{ color: "var(--foreground-muted)", fontSize: "13px", marginBottom: "16px" }}>
                  تواصل معنا مباشرة على واتساب أو التليفون
                </p>
                <a href="tel:+201XXXXXXXXX" className="btn btn-outline-gold btn-sm" style={{ width: "100%" }}>
                  📱 اتصل بينا دلوقتي
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <Footer />
    </div>
  );
}
