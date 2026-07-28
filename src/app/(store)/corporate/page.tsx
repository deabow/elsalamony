"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";

export default function CorporatePortalPage() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/corporate-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          contact_person: contactName,
          phone,
          email,
          details,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء معالجة الطلب.");
      }

      setSuccessMessage(data.message || "تم استلام طلبك، هنتواصل معاك في أسرع وقت.");
      // Clear fields
      setCompanyName("");
      setContactName("");
      setPhone("");
      setEmail("");
      setDetails("");
    } catch (err: any) {
      setError(err.message || "فشل إرسال طلب الشركة. يرجى إعادة المحاولة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh" }}>
      <Header />

      {/* Hero Banner */}
      <section style={{
        padding: "80px 0 60px",
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,150,42,0.06) 0%, transparent 70%)`,
        borderBottom: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <div className="container">
          <div className="badge badge-gold" style={{ marginBottom: "20px", fontSize: "13px" }}>
            🏢 بوابة التعاقدات والمصانع (B2B)
          </div>
          <h1 className="animate-in" style={{
            fontSize: "clamp(30px, 5vw, 56px)",
            fontFamily: "var(--font-heading)",
            lineHeight: 1.2,
            marginBottom: "20px"
          }}>
            حلول الطباعة المتكاملة <span className="gradient-gold-text">للشركات والمؤسسات</span>
          </h1>
          <div className="arabic-divider" style={{ color: "var(--gold-500)", maxWidth: "260px", margin: "0 auto 20px" }}>
            <span>◆</span>
          </div>
          <p style={{
            color: "var(--foreground-muted)",
            fontSize: "17px",
            maxWidth: "680px",
            margin: "0 auto",
            lineHeight: 1.8
          }}>
            تجهيز دفاتر الحسابات، لوحات السلامة والصحة المهنية للمصانع، المطبوعات التجارية بالكامل، والهدايا الدعائية بعقود سنوية وتسهيلات مرنة في السداد.
          </p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* Main Form and Content Area */}
      <main className="section" style={{ flex: 1, padding: "64px 0" }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "start", gap: "48px" }}>
            
            {/* LEFT COLUMN: Corporate Inquiry Form */}
            <div className="card-premium ornament-card gold-top">
              <h2 style={{ fontSize: "22px", marginBottom: "8px", fontFamily: "var(--font-heading)" }}>
                طلب عقد أو عرض أسعار للشركات
              </h2>
              <p style={{ color: "var(--foreground-muted)", fontSize: "14px", marginBottom: "28px" }}>
                سجل متطلبات شركتك ومقاسات المطبوعات وسيقوم مدير الحسابات بالتواصل معك فوراً.
              </p>

              {successMessage ? (
                <div className="animate-in" style={{
                  background: "rgba(34, 197, 94, 0.08)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  borderRadius: "var(--radius-md)",
                  padding: "36px 20px",
                  textAlign: "center"
                }}>
                  <div style={{
                    width: "60px", height: "60px",
                    background: "rgba(34, 197, 94, 0.15)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--status-delivered-text)", fontSize: "30px",
                    margin: "0 auto 16px"
                  }}>
                    ✓
                  </div>
                  <h3 style={{ color: "var(--status-delivered-text)", marginBottom: "8px" }}>تم إرسال الطلب</h3>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "15px", lineHeight: 1.6 }}>{successMessage}</p>
                  <button
                    onClick={() => setSuccessMessage("")}
                    className="btn btn-outline-gold btn-sm"
                    style={{ marginTop: "24px" }}
                  >
                    إرسال استفسار جديد
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "var(--status-cancelled-text)",
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "13px",
                      marginBottom: "20px",
                      textAlign: "right"
                    }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="corp-company">اسم الشركة / المصنع *</label>
                    <input
                      id="corp-company"
                      type="text"
                      className="form-control"
                      placeholder="مثال: شركة السلاموني للإنشاءات"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="corp-contact">اسم المسؤول / مدير التعاقدات *</label>
                    <input
                      id="corp-contact"
                      type="text"
                      className="form-control"
                      placeholder="مثال: أ/ محمد عبد الرحمن"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="corp-phone">رقم التليفون للتواصل *</label>
                    <input
                      id="corp-phone"
                      type="tel"
                      className="form-control ltr"
                      placeholder="01020243667"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="corp-email">البريد الإلكتروني للشركة (اختياري)</label>
                    <input
                      id="corp-email"
                      type="email"
                      className="form-control ltr"
                      placeholder="elsalamony.press@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="corp-details">تفاصيل الطلبات أو عقود التوريد السنوية *</label>
                    <textarea
                      id="corp-details"
                      className="form-control"
                      rows={5}
                      placeholder="يرجى توضيح مواصفات الطباعة المطلوبة، الكميات التقريبية، ونوع ورق الدفاتر أو لوحات المصانع..."
                      required
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold btn-lg"
                    style={{ width: "100%", marginTop: "12px", fontSize: "16px" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "⌛ جاري إرسال الطلب..." : "📤 إرسال طلب عرض الأسعار"}
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT COLUMN: Marketing Copy / Benefits */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div className="card-premium ornament-card">
                <h3 style={{ fontSize: "18px", color: "var(--gold-300)", marginBottom: "20px" }}>
                  ⚙️ مزايا التعاقد مع مطبعة السلاموني
                </h3>
                
                {[
                  {
                    icon: "📊",
                    title: "أسعار خاصة وتسهيلات توريد",
                    desc: "خصومات حصرية على كميات الجملة وجداول دفع مرنة تتناسب مع الموازنات السنوية."
                  },
                  {
                    icon: "🛡️",
                    title: "ضمان جودة الألوان والخامات",
                    desc: "أحدث ماكينات الطباعة الألمانية وتجفيف فوري للأحبار يضمن أعلى تباين للعلامة التجارية لشركتك."
                  },
                  {
                    icon: "🚚",
                    title: "شحن مجاني وتوريد دوري",
                    desc: "خدمات توريد مجدولة شهرياً أو ربع سنوية لمقرات الشركة والمصانع مباشرة."
                  },
                  {
                    icon: "👔",
                    title: "مدير حسابات وتصميم مخصص",
                    desc: "تواصل مباشر مع مهندس تصميم لمراجعة وتدقيق ملفاتك قبل التنفيذ لتجنب أي أخطاء طباعية."
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                    <div style={{
                      width: "42px", height: "42px",
                      background: "rgba(244,185,66,0.1)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px", flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>{item.title}</h4>
                      <p style={{ color: "var(--foreground-muted)", fontSize: "13px", lineHeight: 1.7, marginTop: "4px" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call direct panel */}
              <div className="card" style={{
                textAlign: "center",
                padding: "32px 24px",
                border: "1px dashed var(--border-strong)"
              }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📞</div>
                <h4 style={{ fontSize: "16px", marginBottom: "6px" }}>هل تحتاج إلى تنسيق عاجل؟</h4>
                <p style={{ color: "var(--foreground-muted)", fontSize: "13px", marginBottom: "20px" }}>
                  يمكنك التواصل مباشرة مع إدارة مبيعات الشركات عبر الهاتف أو واتساب
                </p>
                <a
                  href="https://wa.me/201020243667"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-navy"
                  style={{ width: "100%", padding: "10px" }}
                >
                  💬 تواصل معنا واتساب مباشر
                </a>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
