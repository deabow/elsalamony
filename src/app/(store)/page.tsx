import Link from "next/link";
import prisma from "@/lib/prisma";
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

export const revalidate = 0; // Fetch fresh DB data

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

// ── Fallback Print services ──
const STATIC_SERVICES = [
  {
    id: "business-cards",
    icon: CreditCard,
    name: "كروت الشركات والبزنس كارد",
    desc: "كروت شخصية على أوراق مصقولة فاخرة، سلوفان مات/جلوس، أو ذهبي بارز.",
    badge: "الأكثر طلباً",
    basePrice: 150,
    images: [],
  },
  {
    id: "rollups-banners",
    icon: ScrollText,
    name: "بانر ورول أب الفعاليات",
    desc: "استاندات رول أب عالية الدقة بقاعدة ألمنيوم متينة وحقيبة سفر أنيقة.",
    badge: null,
    basePrice: 650,
    images: [],
  },
  {
    id: "corporate-logbooks",
    icon: BookOpen,
    name: "دفاتر وسجلات الشركات",
    desc: "دفاتر إيصالات وسجلات محاسبية ومبيعات مخصصة بشعارك وألوانك الخاصة.",
    badge: "مميز للشركات",
    basePrice: 450,
    images: [],
  },
  {
    id: "safety-signage",
    icon: ShieldAlert,
    name: "لوحات السلامة والصحة المهنية",
    desc: "لوحات PVC وألمنيوم للمصانع والمنشآت بألوان طباعة UV المقاومة للظروف الجوية.",
    badge: "معتمد للمصانع",
    basePrice: 120,
    images: [],
  },
];

export default async function StoreHome() {
  let dbProducts: Array<{
    id: string;
    name: string;
    description: string;
    base_price: any;
    category: string;
    images: string[];
    options: any[];
  }> = [];

  try {
    dbProducts = await prisma.product.findMany({
      include: { options: true },
      orderBy: { id: "desc" },
      take: 6,
    });
  } catch (err) {
    console.error("Failed to query DB products for home page:", err);
  }

  const hasDbProducts = dbProducts && dbProducts.length > 0;

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
                <Link href="/products" className="btn btn-gold btn-lg cursor-pointer" style={{ gap: "8px" }}>
                  <Printer size={20} />
                  <span>تصفح المنتجات واحسب السعر</span>
                </Link>
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

      {/* ══════════════════ DYNAMIC PRODUCTS SECTION ══════════════════ */}
      <section id="services" className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div className="badge badge-gold" style={{ marginBottom: "16px", gap: "6px" }}>
              <Printer size={14} />
              <span>كتالوج المنتجات والخدمات المتاحة</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: "16px" }}>
              منتجات المطبعة المتاحة للطلب الفوري
            </h2>
            <div className="arabic-divider" style={{ color: "var(--gold-400)", maxWidth: "300px", margin: "0 auto 20px" }}>
              <span>◆</span>
            </div>
            <p style={{ color: "var(--foreground-muted)", fontSize: "16.5px", maxWidth: "580px", margin: "0 auto", lineHeight: 1.8 }}>
              حدد المنتج، اضبط المقاسات والكميات بمرونة، واحصل على سعر فوري وشفاف قبل تقديم طلبك.
            </p>
          </div>

          {/* Dynamic Products Grid */}
          <div className="grid grid-3" style={{ gap: "28px" }}>
            {hasDbProducts ? (
              dbProducts.map((p) => {
                const hasImage = p.images && p.images.length > 0;
                return (
                  <div key={p.id} className="card-premium ornament-card gold-top cursor-pointer" style={{ display: "flex", flexDirection: "column", padding: "0", overflow: "hidden" }}>
                    {/* Image Thumbnail Header */}
                    <div style={{
                      height: "200px",
                      background: "#040812",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "1px solid var(--border)"
                    }}>
                      {hasImage ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "var(--gold-400)" }}>
                          <Printer size={32} />
                          <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>مطبعة السلاموني</span>
                        </div>
                      )}
                      <span className="badge badge-navy" style={{ position: "absolute", top: "12px", right: "12px", fontSize: "10.5px" }}>
                        {p.category}
                      </span>
                    </div>

                    {/* Product Content Body */}
                    <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <h3 style={{ fontSize: "19px", marginBottom: "10px", fontFamily: "var(--font-heading)", color: "var(--foreground)" }}>
                        {p.name}
                      </h3>
                      <p style={{ color: "var(--foreground-muted)", fontSize: "14px", lineHeight: 1.7, flex: 1, marginBottom: "20px" }}>
                        {p.description || "خامات ممتازة وتسعير دقيق مع إمكانية حسبة السعر تلقائياً."}
                      </p>
                      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: "11px", color: "var(--foreground-subtle)", display: "block" }}>السعر الأساسي:</span>
                          <strong style={{ color: "var(--gold-400)", fontSize: "18px", fontFamily: "var(--font-heading)" }}>
                            {Number(p.base_price).toFixed(2)} ج.م
                          </strong>
                        </div>
                        <Link href={`/products/${p.id}`} className="btn btn-gold btn-sm cursor-pointer" style={{ gap: "6px" }}>
                          <span>تحديد السعر</span>
                          <ChevronLeft size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="card-premium" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "64px 24px" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>📦</div>
                <h3 style={{ fontSize: "20px", fontFamily: "var(--font-heading)", color: "var(--gold-400)", marginBottom: "8px" }}>
                  لا توجد منتجات بالكتالوج حالياً
                </h3>
                <p style={{ color: "var(--foreground-muted)", fontSize: "14.5px" }}>
                  قم بإضافة منتجات جديدة من لوحة التحكم ليتم عرضها للعملاء هنا فوراً.
                </p>
              </div>
            )}
          </div>

          {/* CTA to View All Products page */}
          <div style={{ textAlign: "center", marginTop: "44px", padding: "0 16px" }}>
            <Link 
              href="/products" 
              className="btn btn-gold btn-lg cursor-pointer" 
              style={{ 
                gap: "8px", 
                maxWidth: "100%", 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center", 
                textAlign: "center" 
              }}
            >
              <Printer size={18} />
              <span>تصفح جميع منتجات الكتالوج</span>
              <ChevronLeft size={16} />
            </Link>
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
