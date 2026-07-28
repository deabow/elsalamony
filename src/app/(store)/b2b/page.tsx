"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";
import { 
  Building2, 
  UserCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Truck, 
  FileCheck, 
  Layers, 
  Sparkles, 
  ChevronLeft 
} from "lucide-react";

const PRODUCT_TYPES = [
  "دفاتر وسجلات شركات مخصوصة",
  "لافتات ورول أب المعارض",
  "بروشورات وكتالوجات منتجات",
  "كروت شركات وبزنس كارد بالجملة",
  "لوحات السلامة والصحة المهنية",
  "ملصق واستيكر العبوات والمنتجات",
  "أكياس ومواد تعبئة وتغليف",
  "غير ذلك (حدد بالتفصيل في الملاحظات)",
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
      setSuccess(`تم استلام استفسارك بنجاح! سيتواصل معك فريقنا خلال 24 ساعة بعرض السعر المعتمد. رقم الطلب: ${data.inquiryId || "—"}`);
      setCompanyName(""); setContactName(""); setContactPhone(""); setContactEmail("");
      setQuantity(""); setSpecifications("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذّر إرسال الاستفسار. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh" }}>

      {/* ══ HEADER ══ */}
      <Header />

      {/* ══ HERO ══ */}
      <section style={{
        padding: "80px 0 60px",
        background: `
          radial-gradient(ellipse 60% 50% at 15% 50%, rgba(245,184,55,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 40% 50% at 85% 30%, rgba(26,44,90,0.6) 0%, transparent 60%)
        `,
        position: "relative",
      }}>
        <div className="container">
          <div className="badge badge-gold" style={{ marginBottom: "20px", gap: "6px" }}>
            <Building2 size={15} />
            <span>خدمات الشركات والمصانع B2B</span>
          </div>
          <h1 className="animate-in" style={{
            fontSize: "clamp(32px, 5vw, 58px)",
            fontFamily: "var(--font-heading)",
            marginBottom: "20px",
            lineHeight: 1.25,
          }}>
            بوابة خدمات الطباعة{" "}
            <span className="gradient-gold-text">للشركات والمصانع</span>
          </h1>
          <div className="arabic-divider" style={{ color: "var(--gold-400)", maxWidth: "300px", marginBottom: "20px" }}>
            <span>◆</span>
          </div>
          <p style={{ color: "var(--foreground-muted)", fontSize: "17.5px", maxWidth: "640px", lineHeight: 1.85 }}>
            سواء كنت منشأة صناعية بمدينة السادات أو الإسكندرية — نوفر حلول طباعة الأوفست والدعاية المتكاملة بعروض أسعار للكميات، فواتير ضريبية، وجودة خامات معتمدة.
          </p>
        </div>
      </section>

      <div className="divider-gold" />

      {/* ══ MAIN FORM & INFO SPLIT ══ */}
      <section className="section">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "48px",
            alignItems: "flex-start",
          }}>

            {/* ── Inquiry Form ── */}
            <div className="card-premium" style={{ padding: "36px" }}>
              <h2 style={{ fontSize: "22px", marginBottom: "8px", fontFamily: "var(--font-heading)" }}>إرسال طلب عرض سعر</h2>
              <p style={{ color: "var(--foreground-muted)", fontSize: "14.5px", marginBottom: "28px" }}>
                قم بملء البيانات الفنية أدناه وسيقوم مسؤولي مبيعات الشركات بالتواصل معك خلال ساعات.
              </p>

              {success ? (
                <div style={{
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.35)",
                  borderRadius: "var(--radius-md)",
                  padding: "32px",
                  textAlign: "center",
                }}>
                  <CheckCircle2 size={48} style={{ color: "var(--status-delivered-text)", margin: "0 auto 16px" }} />
                  <h3 style={{ marginBottom: "10px", color: "var(--status-delivered-text)", fontFamily: "var(--font-heading)" }}>تم إرسال الطلب بنجاح!</h3>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "14.5px", lineHeight: 1.8 }}>{success}</p>
                  <button onClick={() => setSuccess("")} className="btn btn-gold cursor-pointer" style={{ marginTop: "24px" }}>
                    إرسال استفسار آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {error && (
                    <div style={{
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: "var(--radius-sm)",
                      padding: "14px 16px",
                      marginBottom: "20px",
                      fontSize: "14px",
                      color: "var(--status-cancelled-text)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <AlertCircle size={18} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="company-name">اسم الشركة / المصنع *</label>
                      <input id="company-name" type="text" className="form-control" placeholder="شركة مصر للخدمات..." value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">اسم الشخص المسؤول *</label>
                      <input id="contact-name" type="text" className="form-control" placeholder="أحمد السلاموني" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-phone">رقم تليفون التواصل *</label>
                      <input id="contact-phone" type="tel" className="form-control ltr" placeholder="01020243667" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-email">البريد الإلكتروني للشركة</label>
                      <input id="contact-email" type="email" className="form-control ltr" placeholder="elsalamony.press@gmail.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px" }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="product-type">نوع المطبوعات المطلوبة *</label>
                      <select id="product-type" className="form-control cursor-pointer" value={productType} onChange={(e) => setProductType(e.target.value)} required>
                        {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="quantity">الكمية التقديرية *</label>
                      <input id="quantity" type="number" min="1" className="form-control ltr" placeholder="5000" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="specifications">المواصفات التفصيلية</label>
                    <textarea
                      id="specifications"
                      className="form-control"
                      rows={4}
                      placeholder="المقاسات المطلوبة، درجة سمك الورق، نوع التغليف، مواعيد التوريد..."
                      value={specifications}
                      onChange={(e) => setSpecifications(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold btn-lg cursor-pointer"
                    style={{ width: "100%", marginTop: "12px", gap: "8px" }}
                    disabled={isSubmitting}
                  >
                    <Send size={18} />
                    <span>{isSubmitting ? "جاري إرسال الاستفسار..." : "إرسال طلب عرض السعر"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* ── Info Panel ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="card-premium ornament-card">
                <h3 style={{ fontSize: "19px", marginBottom: "24px", color: "var(--gold-300)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={20} />
                  مزایا التعاقد مع مطبعة السلاموني
                </h3>
                {[
                  { icon: Layers, title: "قدرات إنتاجية ضخمة", desc: "نمتلك خطوط أوفست وطباعة رقمية سريعة قادرة على توريد الكميات الضخمة في أوقات قياسية." },
                  { icon: FileCheck, title: "فواتير رسمية وعقود معتمدة", desc: "إصدار فواتير ضريبية معتمدة وعقود توريد دورية ميسرة للشركات والمصانع." },
                  { icon: UserCheck, title: "مراجعة تصميمات وحلول مجانية", desc: "يقوم مهندسي ومصممي المطبعة بمراجعة عينات الألوان والقطع مجاناً قبل الإنتاج." },
                  { icon: Truck, title: "توصيل مباشر للموقع", desc: "خدمة شحن وتوصيل آمنة لمقرات الشركات والمصانع بجميع المناطق الصناعية." },
                ].map((f) => {
                  const FIcon = f.icon;
                  return (
                    <div key={f.title} style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                      <div style={{
                        width: "44px", height: "44px",
                        background: "rgba(245,184,55,0.12)",
                        border: "1px solid var(--border-strong)",
                        borderRadius: "12px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--gold-400)",
                        flexShrink: 0,
                      }}>
                        <FIcon size={22} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px", color: "var(--foreground)" }}>{f.title}</div>
                        <div style={{ color: "var(--foreground-muted)", fontSize: "13.5px", lineHeight: 1.7 }}>{f.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="glass-panel" style={{ textAlign: "center", padding: "28px" }}>
                <PhoneCall size={32} style={{ color: "var(--gold-400)", margin: "0 auto 12px" }} />
                <h4 style={{ marginBottom: "8px", fontSize: "17px", color: "var(--foreground)" }}>هل تحتاج رد فوري أو استشارة عاجلة؟</h4>
                <p style={{ color: "var(--foreground-muted)", fontSize: "13.5px", marginBottom: "20px" }}>
                  فريق مبيعات B2B متواجد للرد على اتصالاتك واستفساراتك
                </p>
                <a href="tel:01020243667" className="btn btn-outline-gold btn-sm cursor-pointer" style={{ width: "100%", justifyContent: "center", gap: "8px" }}>
                  <PhoneCall size={16} />
                  <span>تواصل هاتفياً مع قسم الشركات</span>
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
