import Link from "next/link";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";

// ── Arabic decorative SVG motif ──
const ArabicOrnament = () => (
  <svg width="60" height="16" viewBox="0 0 60 16" fill="none" aria-hidden="true">
    <path d="M0 8 Q15 0 30 8 Q45 16 60 8" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
    <circle cx="30" cy="8" r="2.5" fill="currentColor" opacity="0.8" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity="0.5" />
    <circle cx="52" cy="8" r="1.5" fill="currentColor" opacity="0.5" />
  </svg>
);

// ── Why choose us – feature cards ──
const FEATURES = [
  {
    icon: "🏆",
    title: "جودة تتكلم عن نفسها",
    desc: "أحبار ألوان CMYK بمعايير عالمية، وتشطيبات مات وجلوس وذهبي بلمسة يد محترفة.",
  },
  {
    icon: "⚡",
    title: "تسليم سريع ومضمون",
    desc: "نلتزم بمواعيدك. أغلب الطلبات بتتجهز في 24-72 ساعة حسب النوع والكمية.",
  },
  {
    icon: "💰",
    title: "أسعار واضحة بدون مفاجآت",
    desc: "تسعير ديناميكي شفاف — شوف السعر النهائي قبل ما تكمل الطلب بدون رسوم خفية.",
  },
  {
    icon: "🎨",
    title: "مصممين متخصصين",
    desc: "فريق تصميم محترف يراجع ملفاتك ويتواصل معاك لو في أي ملاحظة قبل الطباعة.",
  },
  {
    icon: "📦",
    title: "تتبع طلبك لحظة بلحظة",
    desc: "كل طلب ليه كود تتبع خاص بيه، تقدر تشوف مراحل شغلك من الطباعة للتسليم.",
  },
  {
    icon: "🏭",
    title: "خدمات الشركات والمصانع",
    desc: "بنخدم الشركات الكبيرة بعروض أسعار مخصوصة وفواتير رسمية وكميات ضخمة.",
  },
];

// ── Print services – no placeholder prices ──
const SERVICES = [
  {
    id: "business-cards",
    icon: "💳",
    name: "كروت الشركات",
    desc: "بزنس كارد على ورق فاخرذهبي أو رولاميلا.",
    badge: "الأكثر طلباً",
  },
  {
    id: "roll-ups",
    icon: "📜",
    name: "لافتات رول أب",
    desc: "استاند رول أب عالي الدقة بقاعدة ألمنيوم وحقيبة حمل أنيقة.",
    badge: null,
  },
  {
    id: "brochures",
    icon: "📋",
    name: "بروشورات وكتيبات",
    desc: "بروشورات ملونة أحادية وثنائية ومثلثة الطي على أوراق مصقولة.",
    badge: null,
  },
  {
    id: "logbooks",
    icon: "📒",
    name: "دفاتر الشركات",
    desc: "دفاتر وسجلات مخصوصة بغلاف مطبوع وشعار شركتك بألوان كاملة.",
    badge: "B2B مميز",
  },
  {
    id: "safety-signs",
    icon: "⚠️",
    name: "لوحات السلامة",
    desc: "لوحات PVC وألمنيوم للمصانع بألوان UV مقاومة للبيئة.",
    badge: "جديد",
  },
  {
    id: "stickers",
    icon: "🏷️",
    name: "ملصقات وأختام",
    desc: "ملصقات لاصقة عالية الجودة للمنتجات والشحنات والعبوات.",
    badge: null,
  },
];

export default function StoreHome() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

      {/* ══════════════════ HEADER ══════════════════ */}
      <Header />

      {/* ══════════════════ HERO SECTION ══════════════════ */}
      <section className="animate-in" style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "80px 0",
      }}>

        {/* Background decorative elements */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 60% at 20% 50%, rgba(212,150,42,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 20%, rgba(26,47,92,0.6) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 60% 80%, rgba(122, 92, 53, 0.06) 0%, transparent 50%)
          `,
        }} />

        {/* Geometric corner ornaments */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "40px", right: "60px",
          width: "120px", height: "120px",
          border: "1px solid rgba(244,185,66,0.15)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: "80px", height: "80px",
            border: "1px solid rgba(244,185,66,0.25)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--gold-500)", fontSize: "28px",
          }}>◆</div>
        </div>

        <div aria-hidden="true" style={{
          position: "absolute", bottom: "40px", left: "60px",
          color: "rgba(244,185,66,0.1)", fontSize: "120px", lineHeight: 1,
          fontFamily: "var(--font-heading)", userSelect: "none",
        }}>
          ❖
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "720px", textAlign: "right" }}>

            <div className="badge badge-gold animate-in" style={{ marginBottom: "24px", fontSize: "13px" }}>
              ✦ &nbsp; طباعة راقية — جودة لا تنافس
            </div>

            <h1 className="animate-in-2" style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "24px",
            }}>
              اطبع بأعلى{" "}
              <span className="gradient-gold-text">جودة وأرقى</span>
              <br />
              خامات مع مطبعة السلاموني
            </h1>

            <div className="arabic-divider animate-in-2" style={{ color: "var(--gold-500)", marginBottom: "24px" }}>
              <span></span>
            </div>

            <p className="animate-in-3" style={{
              fontSize: "18px",
              color: "var(--foreground-muted)",
              marginBottom: "40px",
              maxWidth: "600px",
              lineHeight: 1.8,
            }}>
              من كروت الشركات وحتى لافتات المصانع — بنقدم خدمة طباعة احترافية
              بأسعار تنافسية وتسليم سريع. ارفع ملفك دلوقتي واترك الباقي علينا.
            </p>

            <div className="animate-in-3" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a href="#services" className="btn btn-gold btn-lg">
                🖨️&nbsp; اكتشف منتجاتنا
              </a>
              <Link href="/b2b" className="btn btn-navy btn-lg">
                🏢&nbsp; بوابة الشركات
              </Link>
            </div>

            {/* Quick stats */}

          </div>
        </div>
      </section>

      {/* ══════════════════ DIVIDER ══════════════════ */}
      <div className="divider-gold" />

      {/* ══════════════════ SERVICES SECTION ══════════════════ */}
      <section id="services" className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div className="badge badge-gold" style={{ marginBottom: "16px" }}>منتجاتنا اللي بنتميز بيها</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: "16px" }}>
              خدمات الطباعة اللي نقدمها
            </h2>
            <div className="arabic-divider" style={{ color: "var(--gold-500)", maxWidth: "300px", margin: "0 auto 20px" }}>
              <span>◆</span>
            </div>
            <p style={{ color: "var(--foreground-muted)", fontSize: "16px", maxWidth: "560px", margin: "0 auto" }}>
              اختار المنتج المناسب، حدد المواصفات اللي تناسبك، وارفع الملف —
              والباقي علينا بضمان الجودة
            </p>
          </div>

          <div className="grid grid-3">
            {SERVICES.map((svc) => (
              <div key={svc.id} className="card-premium ornament-card gold-top" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div style={{
                    width: "52px", height: "52px",
                    background: "rgba(244, 185, 66, 0.1)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px",
                  }}>
                    {svc.icon}
                  </div>
                  {svc.badge && (
                    <span className="badge badge-gold" style={{ fontSize: "11px" }}>{svc.badge}</span>
                  )}
                </div>
                <h3 style={{ fontSize: "20px", marginBottom: "10px", fontFamily: "var(--font-heading)" }}>
                  {svc.name}
                </h3>
                <p style={{ color: "var(--foreground-muted)", fontSize: "14px", lineHeight: 1.8, flex: 1 }}>
                  {svc.desc}
                </p>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", marginTop: "20px" }}>
                  <Link href={`/products/${svc.id}`} className="btn btn-outline-gold btn-sm" style={{ width: "100%" }}>
                    اطلب دلوقتي ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ DIVIDER ══════════════════ */}
      <div className="divider-gold" />

      {/* ══════════════════ WHY US SECTION ══════════════════ */}
      <section className="section" style={{ background: "var(--gradient-bg-navy)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", marginBottom: "12px" }}>
              ليه مطبعة السلاموني؟
            </h2>
            <div className="arabic-divider" style={{ color: "var(--gold-500)", maxWidth: "280px", margin: "0 auto" }}>
              <span>✦</span>
            </div>
          </div>
          <div className="grid grid-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ textAlign: "right" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "var(--gold-300)" }}>{f.title}</h3>
                <p style={{ color: "var(--foreground-muted)", fontSize: "14px", lineHeight: 1.8 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ DIVIDER ══════════════════ */}
      <div className="divider-gold" />

      {/* ══════════════════ B2B SECTION ══════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{
            background: "var(--gradient-b2b)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(40px, 6vw, 72px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "48px",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative background */}
            <div aria-hidden="true" style={{
              position: "absolute", top: "-40px", left: "-40px",
              width: "200px", height: "200px",
              border: "1px solid rgba(244,185,66,0.1)",
              borderRadius: "50%", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", bottom: "-60px", right: "-60px",
              width: "240px", height: "240px",
              border: "1px solid rgba(244,185,66,0.08)",
              borderRadius: "50%", pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="badge badge-gold" style={{ marginBottom: "20px" }}>
                🏢 &nbsp; خدمات الشركات والمصانع
              </div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", marginBottom: "16px" }}>
                محتاج طباعة بالجملة أو عرض سعر مخصوص؟
              </h2>
              <p style={{ color: "var(--foreground-muted)", fontSize: "15px", lineHeight: 1.9, marginBottom: "32px" }}>
                بنخدم المصانع والشركات والمدارس بعروض أسعار تنافسية،
                فواتير رسمية، وكميات ضخمة. ابعت استفسارك دلوقتي وهنرد عليك في أسرع وقت.
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <Link href="/b2b" className="btn btn-gold">
                  سجل استفسار الشركة →
                </Link>
                <Link href="/order-tracking" className="btn btn-ghost">
                  تتبع طلبي
                </Link>
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                background: "rgba(5, 12, 26, 0.6)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "28px",
              }}>
                <h3 style={{ marginBottom: "20px", fontSize: "17px", color: "var(--gold-300)" }}>
                  إزاي بتشتغل خدمة الشركات؟
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { step: "١", text: "ابعت متطلباتك — الكميات، المقاسات، الديزاين" },
                    { step: "٢", text: "بنراجع الملفات ونبعتلك عرض سعر تفصيلي" },
                    { step: "٣", text: "بعد الموافقة، نبدأ الطباعة ونسلمك في الموعد" },
                  ].map((s) => (
                    <div key={s.step} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "34px", height: "34px",
                        background: "rgba(244, 185, 66, 0.15)",
                        border: "1px solid var(--gold-600)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", fontWeight: 800, color: "var(--gold-400)",
                        flexShrink: 0,
                      }}>
                        {s.step}
                      </div>
                      <span style={{ fontSize: "14px", color: "var(--foreground-muted)" }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ ORDER TRACKING CTA ══════════════════ */}
      <section className="section-sm" style={{
        background: "var(--navy-950)",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div className="container">
          <p style={{ color: "var(--foreground-muted)", marginBottom: "16px", fontSize: "15px" }}>
            عندك طلب وعايز تتابع حالته؟
          </p>
          <Link href="/order-tracking" className="btn btn-navy">
            📦 &nbsp; تتبع طلبي بكود الطلب
          </Link>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <Footer />
    </div>
  );
}
