import Link from "next/link";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";
import { 
  Award, 
  Zap, 
  DollarSign, 
  Palette, 
  PackageCheck, 
  Building2, 
  CreditCard, 
  ScrollText, 
  FileText, 
  BookOpen, 
  ShieldAlert, 
  Tag, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Printer, 
  MapPin, 
  Clock, 
  ChevronLeft 
} from "lucide-react";

// ── Why choose us – feature cards with Lucide icons ──
const FEATURES = [
  {
    icon: Award,
    title: "جودة تتكلم عن نفسها",
    desc: "أحبار ألوان CMYK بمعايير عالمية، وتشطيبات مات وجلوس وذهبي بارز بلمسة احترافية.",
  },
  {
    icon: Zap,
    title: "تسليم سريع ومضمون",
    desc: "نلتزم بمواعيدك الدقيقة. معظم الطلبات تُجهز في غضون 24 إلى 72 ساعة حسب الكمية.",
  },
  {
    icon: DollarSign,
    title: "أسعار شفافة بدون مفاجآت",
    desc: "تسعير آلي ودقيق — احسب التكلفة الإجمالية بنفسك قبل إتمام الطلب بكل وضوح.",
  },
  {
    icon: Palette,
    title: "مراجعة تصميم مجانية",
    desc: "فريق من مصممي المطبعة يراجع ملفاتك ويرسل ملاحظات فنية لضمان دقة الألوان والقطع.",
  },
  {
    icon: PackageCheck,
    title: "تتبع حالة الطلب لحظياً",
    desc: "نظام تتبع ذكي يمنحك التحديثات الفورية من مرحلة تجهيز الملف وحتى التسليم النهائي.",
  },
  {
    icon: Building2,
    title: "حلول خاصة للمصانع والشركات",
    desc: "نخدم المؤسسات والمصانع الكبرى بعروض أسعار بالجملة وفواتير ضريبية معتمدة.",
  },
];

// ── Print services ──
const SERVICES = [
  {
    id: "business-cards",
    icon: CreditCard,
    name: "كروت الشركات والبزنس كارد",
    desc: "كروت شخصية على أوراق مصقولة فاخرة، سلوفان مات/جلوس، أو ذهبي بارز.",
    badge: "الأكثر طلباً",
  },
  {
    id: "roll-ups",
    icon: ScrollText,
    name: "بانر ورول أب الفعاليات",
    desc: "استاندات رول أب عالية الدقة بقاعدة ألمنيوم متينة وحقيبة سفر أنيقة.",
    badge: null,
  },
  {
    id: "brochures",
    icon: FileText,
    name: "بروشورات وكتالوجات",
    desc: "مطويات ملونة ثنائية ومثلثة الطي ومجلات تعريفية بالمنتجات والشركات.",
    badge: null,
  },
  {
    id: "logbooks",
    icon: BookOpen,
    name: "دفاتر وسجلات الشركات",
    desc: "دفاتر إيصالات وسجلات حسينية ومبيعات مخصصة بشعارك وألوانك الخاصة.",
    badge: "مميز للشركات",
  },
  {
    id: "safety-signs",
    icon: ShieldAlert,
    name: "لوحات السلامة والصحة المهنية",
    desc: "لوحات PVC وألمنيوم للمصانع والمنشآت بألوان طباعة UV المقاومة للظروف الجوية.",
    badge: "معتمد للمصانع",
  },
  {
    id: "stickers",
    icon: Tag,
    name: "ملصقات واستيكرات العبوات",
    desc: "استيكرات لاصقة عالية الجودة ومقاومة للماء للمنتجات والشحنات والتغليف.",
    badge: null,
  },
];

export default function StoreHome() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh" }}>

      {/* ══════════════════ HEADER ══════════════════ */}
      <Header />

      {/* ══════════════════ HERO SECTION ══════════════════ */}
      <section className="animate-in" style={{
        position: "relative",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "80px 0 100px",
      }}>

        {/* Background decorative liquid light gradients */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 60% at 15% 45%, rgba(245, 184, 55, 0.12) 0%, transparent 65%),
            radial-gradient(ellipse 50% 50% at 85% 25%, rgba(26, 44, 90, 0.7) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 60% 85%, rgba(212, 150, 42, 0.08) 0%, transparent 55%)
          `,
        }} />

        {/* Floating backdrop graphic elements */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "50px", right: "5%",
          width: "140px", height: "140px",
          border: "1px solid rgba(245,184,55,0.18)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 0.7
        }}>
          <div style={{
            width: "90px", height: "90px",
            border: "1px stroke rgba(245,184,55,0.25)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--gold-400)", fontSize: "20px",
          }}>✦</div>
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "56px", alignItems: "center" }}>
            
            {/* Left Content Column */}
            <div style={{ textAlign: "right" }}>

              <div className="badge badge-gold animate-in cursor-pointer" style={{ marginBottom: "24px", fontSize: "13px", gap: "8px" }}>
                <Sparkles size={14} />
                <span>طباعة فاخرة بمدينة السادات والإسكندرية</span>
              </div>

              <h1 className="animate-in-2" style={{
                fontSize: "clamp(36px, 5.5vw, 68px)",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: "24px",
                letterSpacing: "-0.01em",
              }}>
                اطبع بأعلى{" "}
                <span className="gradient-gold-text">جودة وأرقى</span>
                <br />
                خامات مع مطبعة السلاموني
              </h1>

              <div className="arabic-divider animate-in-2" style={{ color: "var(--gold-400)", marginBottom: "24px", maxWidth: "340px" }}>
                <span>◆</span>
              </div>

              <p className="animate-in-3" style={{
                fontSize: "17.5px",
                color: "var(--foreground-muted)",
                marginBottom: "40px",
                maxWidth: "620px",
                lineHeight: 1.85,
              }}>
                من كروت البزنس الأنيقة وحتى لافتات المصانع ولوحات السلامة المهنية — نقدم خيارات طباعة رقمية وأوفست فائقة الجودة لخدمة الشركات والأفراد مع ضمان السرعة والتوصيل.
              </p>

              <div className="animate-in-3" style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                <a href="#services" className="btn btn-gold btn-lg cursor-pointer" style={{ gap: "8px" }}>
                  <Printer size={20} />
                  <span>اكتشف المنتجات واحسب السعر</span>
                </a>
                <Link href="/b2b" className="btn btn-navy btn-lg cursor-pointer" style={{ gap: "8px" }}>
                  <Building2 size={20} />
                  <span>بوابة الشركات والمصانع</span>
                </Link>
              </div>

              {/* Quick stats ribbon */}
              <div className="animate-in-3" style={{
                display: "flex",
                gap: "28px",
                marginTop: "48px",
                paddingTop: "24px",
                borderTop: "1px solid var(--border)",
                flexWrap: "wrap",
              }}>
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--gold-400)", fontFamily: "var(--font-heading)" }}>+١٥,٠٠٠</div>
                  <div style={{ fontSize: "12.5px", color: "var(--foreground-subtle)" }}>طلب مطبوع بنجاح</div>
                </div>
                <div style={{ width: "1px", height: "40px", background: "var(--border)" }} />
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--gold-400)", fontFamily: "var(--font-heading)" }}>٩٩.٤٪</div>
                  <div style={{ fontSize: "12.5px", color: "var(--foreground-subtle)" }}>نسبة رضا العملاء</div>
                </div>
                <div style={{ width: "1px", height: "40px", background: "var(--border)" }} />
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--gold-400)", fontFamily: "var(--font-heading)" }}>فرعين رئيسيين</div>
                  <div style={{ fontSize: "12.5px", color: "var(--foreground-subtle)" }}>السادات والإسكندرية</div>
                </div>
              </div>

            </div>

            {/* Right Interactive Card Preview */}
            <div className="animate-in-3" style={{ position: "relative" }}>
              <div className="card-premium float-pulse" style={{
                padding: "36px",
                background: "linear-gradient(160deg, rgba(18,32,70,0.9) 0%, rgba(8,16,36,0.95) 100%)",
                boxShadow: "var(--shadow-gold), var(--shadow-lg)",
                border: "1px solid var(--border-strong)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <span className="badge badge-gold">حاسبة الأسعار الفورية</span>
                  <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>خدمة 24/7</span>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: "rgba(245,184,55,0.15)", border: "1px solid var(--border-strong)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--gold-400)"
                  }}>
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "18px", color: "var(--foreground)", margin: 0 }}>كروت شخصية فاخرة</h3>
                    <p style={{ fontSize: "13px", color: "var(--foreground-subtle)", margin: 0 }}>ورق كوشيه 350 جرام + سلوفان</p>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", marginBottom: "8px" }}>
                    <span style={{ color: "var(--foreground-subtle)" }}>الكمية المحددة:</span>
                    <span style={{ fontWeight: 700, color: "var(--gold-300)" }}>1,000 كارت</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", marginBottom: "8px" }}>
                    <span style={{ color: "var(--foreground-subtle)" }}>نوع التشطيب:</span>
                    <span style={{ fontWeight: 700, color: "var(--gold-300)" }}>سلوفان مات وجهين</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                    <span style={{ color: "var(--foreground-subtle)" }}>زمن التسليم المتوقع:</span>
                    <span style={{ fontWeight: 700, color: "var(--status-delivered-text)" }}>خلال 48 ساعة</span>
                  </div>
                </div>

                <Link href="/products/business-cards" className="btn btn-gold cursor-pointer" style={{ width: "100%", justifyContent: "center" }}>
                  <span>احسب السعر واطلب الآن</span>
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════ DIVIDER ══════════════════ */}
      <div className="divider-gold" />

      {/* ══════════════════ SERVICES SECTION ══════════════════ */}
      <section id="services" className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div className="badge badge-gold" style={{ marginBottom: "16px", gap: "6px" }}>
              <Printer size={14} />
              <span>خدماتنا الأساسية</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: "16px" }}>
              تصفح خدمات الطباعة المتاحة
            </h2>
            <div className="arabic-divider" style={{ color: "var(--gold-400)", maxWidth: "300px", margin: "0 auto 20px" }}>
              <span>◆</span>
            </div>
            <p style={{ color: "var(--foreground-muted)", fontSize: "16.5px", maxWidth: "580px", margin: "0 auto", lineHeight: 1.8 }}>
              حدد المنتج، اضبط مقاساتك وكمياتك بمرونة، واحصل على سعر فوري وشفاف قبل تقديم طلبك.
            </p>
          </div>

          <div className="grid grid-3">
            {SERVICES.map((svc) => {
              const IconComp = svc.icon;
              return (
                <div key={svc.id} className="card-premium ornament-card gold-top cursor-pointer" style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
                    <div style={{
                      width: "54px", height: "54px",
                      background: "rgba(245, 184, 55, 0.12)",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "14px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--gold-400)",
                      boxShadow: "0 4px 14px rgba(245, 184, 55, 0.15)",
                    }}>
                      <IconComp size={26} />
                    </div>
                    {svc.badge && (
                      <span className="badge badge-gold" style={{ fontSize: "11.5px" }}>{svc.badge}</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: "20px", marginBottom: "12px", fontFamily: "var(--font-heading)" }}>
                    {svc.name}
                  </h3>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "14.5px", lineHeight: 1.8, flex: 1 }}>
                    {svc.desc}
                  </p>
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", marginTop: "24px" }}>
                    <Link href={`/products/${svc.id}`} className="btn btn-outline-gold btn-sm cursor-pointer" style={{ width: "100%", justifyContent: "center" }}>
                      <span>تحديد المواصفات والسعر</span>
                      <ChevronLeft size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ DIVIDER ══════════════════ */}
      <div className="divider-gold" />

      {/* ══════════════════ WHY US SECTION ══════════════════ */}
      <section className="section" style={{ background: "var(--gradient-bg-navy)", position: "relative" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", marginBottom: "12px" }}>
              لماذا تختار مطبعة السلاموني؟
            </h2>
            <div className="arabic-divider" style={{ color: "var(--gold-400)", maxWidth: "280px", margin: "0 auto" }}>
              <span>✦</span>
            </div>
          </div>
          <div className="grid grid-3">
            {FEATURES.map((f, i) => {
              const FIcon = f.icon;
              return (
                <div key={i} className="card cursor-pointer" style={{ textAlign: "right" }}>
                  <div style={{
                    width: "48px", height: "48px",
                    borderRadius: "12px",
                    background: "rgba(245, 184, 55, 0.1)",
                    border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--gold-400)",
                    marginBottom: "20px"
                  }}>
                    <FIcon size={24} />
                  </div>
                  <h3 style={{ fontSize: "19px", marginBottom: "10px", color: "var(--gold-300)", fontFamily: "var(--font-heading)" }}>{f.title}</h3>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "14.5px", lineHeight: 1.8 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ DIVIDER ══════════════════ */}
      <div className="divider-gold" />

      {/* ══════════════════ B2B CORPORATE SECTION ══════════════════ */}
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
            boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="badge badge-gold" style={{ marginBottom: "20px", gap: "6px" }}>
                <Building2 size={15} />
                <span>قطاع الشركات والمصانع B2B</span>
              </div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", marginBottom: "18px", lineHeight: 1.3 }}>
                هل تحتاج إلى طباعات ضخمة أو تعاقد دوري لمؤسستك؟
              </h2>
              <p style={{ color: "var(--foreground-muted)", fontSize: "15.5px", lineHeight: 1.9, marginBottom: "32px" }}>
                نوفر خدمات الطباعة المتكاملة للمصانع والشركات الكبرى بمدينة السادات والإسكندرية: فواتير ضريبية رسمية، تخصيص درجات الألوان المعيارية، وعروض أسعار تنافسية للكميات.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link href="/b2b" className="btn btn-gold cursor-pointer" style={{ gap: "8px" }}>
                  <span>تقديم طلب عرض سعر للشركات</span>
                  <ArrowLeft size={16} />
                </Link>
                <Link href="/branches" className="btn btn-ghost cursor-pointer" style={{ gap: "8px" }}>
                  <MapPin size={16} />
                  <span>زيارة أحد فروعنا</span>
                </Link>
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="glass-panel" style={{ padding: "32px", border: "1px solid var(--border-strong)" }}>
                <h3 style={{ marginBottom: "22px", fontSize: "18px", color: "var(--gold-300)", fontFamily: "var(--font-heading)" }}>
                  خطوات التعاقد وسير العمل
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {[
                    { step: "١", title: "طلب المواصفات", text: "إرسال ملفات التصميم والكميات المطلوبة عبر البوابة" },
                    { step: "٢", title: "عرض السعر والعينات", text: "مراجعة فنية وإصدار عرض سعر رسمي مع عينات خامات" },
                    { step: "٣", title: "الطباعة والتوريد", text: "بدء الإنتاج والتسليم المباشر لمقر شركتك أو مصنعك" },
                  ].map((s) => (
                    <div key={s.step} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <div style={{
                        width: "36px", height: "36px",
                        background: "rgba(245, 184, 55, 0.15)",
                        border: "1px solid var(--gold-500)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", fontWeight: 800, color: "var(--gold-400)",
                        flexShrink: 0,
                      }}>
                        {s.step}
                      </div>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>{s.title}</div>
                        <div style={{ fontSize: "13.5px", color: "var(--foreground-muted)", lineHeight: 1.6 }}>{s.text}</div>
                      </div>
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
          <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "var(--foreground)" }}>
            تريد متابعة طلب قائمة بالطباعة؟
          </h3>
          <p style={{ color: "var(--foreground-muted)", marginBottom: "24px", fontSize: "15px" }}>
            أدخل كود الطلب الخاص بك لاستعراض المرحلة الحالية مباشرة
          </p>
          <Link href="/order-tracking" className="btn btn-navy cursor-pointer" style={{ gap: "8px" }}>
            <PackageCheck size={18} />
            <span>تتبع طلبي الآن بواسطة كود التتبع</span>
          </Link>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <Footer />
    </div>
  );
}
