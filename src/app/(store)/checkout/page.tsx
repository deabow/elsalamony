"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/store/header";
import Footer from "@/components/store/footer";

interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  options: string[]; // option_value_ids
  option_names: string[]; // e.g. ["كرتون 400 جرام", "مقاس قياسي"]
  banner_width?: number; // for banners
  banner_height?: number; // for banners
  category?: string; // "banners" or others
}

const BRANCHES = [
  { id: "sadat", name: "فرع السادات" },
  { id: "alex", name: "فرع إسكندرية" },
];

export default function CheckoutPage() {
  const router = useRouter();

  // State for cart items
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Guest details state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Payment configuration state
  const [paymentMethod, setPaymentMethod] = useState<"VODAFONE_CASH" | "CASH_ON_PICKUP">("VODAFONE_CASH");
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0].id);

  // File uploads per cart item index
  const [filesPerItem, setFilesPerItem] = useState<Record<number, File[]>>({});
  const [dragActiveItem, setDragActiveItem] = useState<number | null>(null);

  // Submission / Loading / Success status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: string; totalPrice: number } | null>(null);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("elsalamony_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  // Sync cart changes back to localStorage
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    try {
      localStorage.setItem("elsalamony_cart", JSON.stringify(updatedCart));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  };

  // Populate mock data for testing/debugging purposes
  const populateMockCart = () => {
    const mockItems: CartItem[] = [
      {
        product_id: "business-cards",
        product_name: "Premium Business Cards (كروت شخصية فاخرة)",
        quantity: 200,
        unit_price: 1.5,
        options: ["opt-0-1", "opt-2-0"],
        option_names: ["ورق كوشيه 350 جرام", "سلوفان مطفي وجه واحد"],
        category: "other",
      },
      {
        product_id: "rollups-banners",
        product_name: "Retractable Roll-up Banner (بانر رول أب إعلاني)",
        quantity: 2,
        unit_price: 850,
        options: ["opt-1-1"],
        option_names: ["استاند ألومنيوم اقتصادي", "مقاس 100x200 سم"],
        banner_width: 1.2,
        banner_height: 2.0,
        category: "banners",
      },
    ];
    saveCartToStorage(mockItems);
  };

  const clearCart = () => {
    saveCartToStorage([]);
    setFilesPerItem({});
  };

  // Remove single item from cart
  const removeCartItem = (indexToRemove: number) => {
    const updated = cart.filter((_, idx) => idx !== indexToRemove);
    saveCartToStorage(updated);
    
    // Cleanup files associated with this item
    const updatedFiles = { ...filesPerItem };
    delete updatedFiles[indexToRemove];
    setFilesPerItem(updatedFiles);
  };

  // Form validations
  const validatePhone = (input: string) => {
    const egyptianPhoneRegex = /^01[0125]\d{8}$/;
    if (!input) {
      setPhoneError("رقم التليفون للتواصل مطلوب.");
      return false;
    } else if (!egyptianPhoneRegex.test(input)) {
      setPhoneError("رقم هاتف غير صحيح. يجب أن يتكون من 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    if (value) validatePhone(value);
    else setPhoneError("");
  };

  // File upload handlers for drag & drop
  const handleDrag = (e: React.DragEvent, itemIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveItem(itemIndex);
    } else if (e.type === "dragleave") {
      setDragActiveItem(null);
    }
  };

  const handleDrop = (e: React.DragEvent, itemIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveItem(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFilesToItem(itemIndex, Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
    if (e.target.files && e.target.files[0]) {
      addFilesToItem(itemIndex, Array.from(e.target.files));
    }
  };

  const addFilesToItem = (itemIndex: number, newFiles: File[]) => {
    // Validate file types and sizes
    const allowedExtensions = [".pdf", ".psd", ".ai", ".png", ".jpg", ".jpeg"];
    const maxSize = 100 * 1024 * 1024; // 100MB

    const validated = newFiles.filter((file) => {
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      const isValidExt = allowedExtensions.includes(ext) || file.type.startsWith("image/");
      const isValidSize = file.size <= maxSize;
      return isValidExt && isValidSize;
    });

    if (validated.length === 0) {
      alert("الملفات المرفوعة غير صالحة. يرجى التأكد من الصيغة (PDF, PSD, AI, صور) وأن حجم الملف لا يتعدى 100 ميجابايت.");
      return;
    }

    setFilesPerItem((prev) => ({
      ...prev,
      [itemIndex]: [...(prev[itemIndex] || []), ...validated],
    }));
  };

  const removeFileFromItem = (itemIndex: number, fileIndex: number) => {
    setFilesPerItem((prev) => {
      const itemFiles = prev[itemIndex] || [];
      const updatedFiles = itemFiles.filter((_, idx) => idx !== fileIndex);
      return {
        ...prev,
        [itemIndex]: updatedFiles,
      };
    });
  };

  // Calculations
  const calculateItemSubtotal = (item: CartItem) => {
    const isBanner = item.category?.toLowerCase() === "banners";
    if (isBanner) {
      const width = item.banner_width || 1.0;
      const height = item.banner_height || 1.0;
      return width * height * item.unit_price * item.quantity;
    }
    return item.unit_price * item.quantity;
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
  };

  // Submit Order Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!name.trim()) {
      alert("الرجاء إدخال الاسم بالكامل.");
      return;
    }

    if (!validatePhone(phone)) {
      return;
    }

    // Verify each item has at least one design file
    const itemsMissingFiles = cart.some((_, idx) => !filesPerItem[idx] || filesPerItem[idx].length === 0);
    if (itemsMissingFiles) {
      setSubmitError("الرجاء رفع ملف تصميم واحد على الأقل لكل عنصر في السلة قبل إرسال الطلب.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("guest_name", name);
      formData.append("guest_phone", phone);

      // Build items payload mapping files to a flat list
      const flatFilesList: File[] = [];
      let currentFileIndex = 0;

      const itemsPayload = cart.map((item, itemIdx) => {
        const itemFiles = filesPerItem[itemIdx] || [];
        const file_indices = itemFiles.map(() => {
          const idx = currentFileIndex;
          currentFileIndex++;
          return idx;
        });

        // Push files to flat list
        flatFilesList.push(...itemFiles);

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          options: item.options,
          file_indices,
          banner_width: item.category?.toLowerCase() === "banners" ? item.banner_width : undefined,
          banner_height: item.category?.toLowerCase() === "banners" ? item.banner_height : undefined,
        };
      });

      formData.append("items", JSON.stringify(itemsPayload));

      // Append binary files
      flatFilesList.forEach((file) => {
        formData.append("design_files", file);
      });

      // Submit to backend
      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء معالجة الطلب.");
      }

      // Success
      setOrderSuccess({
        orderId: data.orderId,
        totalPrice: data.totalPrice || calculateTotal(),
      });

      // Clear local storage cart
      localStorage.removeItem("elsalamony_cart");

    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCost = calculateTotal();

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh" }}>
      <Header />

      {/* Hero Header */}
      <section style={{
        padding: "60px 0 40px",
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,150,42,0.05) 0%, transparent 70%)`,
        borderBottom: "1px solid var(--border)",
        textAlign: "center"
      }}>
        <div className="container">
          <div className="badge badge-gold" style={{ marginBottom: "16px" }}>🛒 الدفع الآمن للضيوف</div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontFamily: "var(--font-heading)", marginBottom: "8px" }}>
            إتمام الطلب وتأكيد البيانات
          </h1>
          <div className="arabic-divider" style={{ color: "var(--gold-500)", maxWidth: "240px", margin: "0 auto" }}>
            <span>◆</span>
          </div>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px", marginTop: "8px" }}>
            يرجى مراجعة تفاصيل مطبوعاتك وتأكيد بيانات التواصل وملفات التصميم.
          </p>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="section" style={{ flex: 1, padding: "50px 0" }}>
        <div className="container">
          {/* SUCCESS SCREEN */}
          {orderSuccess ? (
            <div className="animate-in" style={{
              maxWidth: "680px",
              margin: "0 auto",
              textAlign: "center",
              padding: "48px 32px",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-lg)",
              background: "var(--gradient-card-premium)",
              boxShadow: "var(--shadow-lg)",
              position: "relative"
            }}>
              <div style={{
                position: "absolute", top: "15px", right: "20px",
                color: "var(--gold-500)", opacity: 0.25, fontSize: "28px"
              }}>❖</div>
              <div style={{
                position: "absolute", bottom: "15px", left: "20px",
                color: "var(--gold-500)", opacity: 0.25, fontSize: "28px"
              }}>❖</div>

              {/* Decorative Big Check */}
              <div style={{
                width: "80px", height: "80px",
                margin: "0 auto 24px",
                background: "rgba(34, 197, 94, 0.15)",
                border: "2px solid var(--status-delivered-text)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--status-delivered-text)", fontSize: "40px",
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)"
              }}>
                ✓
              </div>

              <h2 style={{ fontSize: "28px", color: "var(--gold-300)", marginBottom: "16px" }}>
                تم استلام طلبك بنجاح!
              </h2>

              <p style={{ color: "var(--foreground-muted)", fontSize: "15px", lineHeight: 1.8, marginBottom: "32px" }}>
                شكراً لثقتك بمطبعة السلاموني. تم إنشاء طلبك بنجاح وجارٍ مراجعة ملفات التصميم المرفقة من قبل فريقنا المختص.
              </p>

              {/* Order Info Card */}
              <div style={{
                background: "rgba(5, 12, 26, 0.4)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "24px",
                marginBottom: "36px",
                textAlign: "right"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "var(--foreground-subtle)" }}>رقم الطلب (Order ID):</span>
                  <strong style={{ color: "var(--gold-400)", fontFamily: "var(--font-mono)", fontSize: "15px" }}>{orderSuccess.orderId}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "var(--foreground-subtle)" }}>الاسم المسجل:</span>
                  <strong>{name}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "var(--foreground-subtle)" }}>رقم التواصل:</span>
                  <strong className="ltr">{phone}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                  <span style={{ color: "var(--foreground-subtle)" }}>طريقة الدفع المختارة:</span>
                  <strong>
                    {paymentMethod === "VODAFONE_CASH" ? "محفظة إلكترونية (فودافون كاش)" : "الدفع نقداً في الفرع عند الاستلام"}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--foreground-subtle)", fontWeight: "bold" }}>المبلغ الإجمالي:</span>
                  <strong style={{ color: "var(--gold-400)", fontSize: "18px" }}>{Number(orderSuccess.totalPrice).toFixed(2)} ج.م</strong>
                </div>
              </div>

              {/* Vodafone Cash reminder */}
              {paymentMethod === "VODAFONE_CASH" && (
                <div style={{
                  background: "rgba(245, 158, 11, 0.08)",
                  border: "1px dashed rgba(245, 158, 11, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                  color: "var(--status-pending-text)",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  marginBottom: "36px",
                  textAlign: "center"
                }}>
                  ⚠️ <strong>تنبيه هام للتحويل:</strong> يرجى التأكد من تحويل <strong>{Number(orderSuccess.totalPrice).toFixed(2)} ج.م</strong> للرقم الموحد <strong>01020243667</strong>. سيبقى الطلب بحالة (PENDING) حتى تأكيد التحويل.
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href={`/order-tracking?orderId=${encodeURIComponent(orderSuccess.orderId)}&phone=${encodeURIComponent(phone)}`}
                  className="btn btn-gold"
                  style={{ padding: "12px 32px" }}
                >
                  📦 تتبع حالة طلبك الآن
                </Link>
                <Link
                  href="/"
                  className="btn btn-navy"
                  style={{ padding: "12px 32px" }}
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          ) : (
            /* REGULAR CHECKOUT FORM & SUMMARY */
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* Empty state */}
              {isCartLoaded && cart.length === 0 ? (
                <div className="card-premium" style={{
                  textAlign: "center",
                  maxWidth: "600px",
                  margin: "0 auto",
                  padding: "48px 24px"
                }}>
                  <div style={{ fontSize: "52px", marginBottom: "16px" }}>🧺</div>
                  <h3 style={{ fontSize: "22px", marginBottom: "12px" }}>سلة المشتريات فارغة</h3>
                  <p style={{ color: "var(--foreground-muted)", fontSize: "14px", marginBottom: "28px" }}>
                    لم تقم بإضافة أي مطبوعات إلى السلة بعد. تصفح كتالوج المنتجات واختر المواصفات المناسبة لبدء طلبك.
                  </p>
                  <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/" className="btn btn-gold">🖨️ تصفح كتالوج المطبوعات</Link>
                    <button type="button" onClick={populateMockCart} className="btn btn-navy">
                      ⚡ تعبئة سلة تجريبية للتجربة
                    </button>
                  </div>
                </div>
              ) : (
                /* CHECKOUT WORKSPACE GRID */
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr",
                  gap: "40px",
                  alignItems: "start"
                }} className="grid-cols-2">

                  {/* LEFT COLUMN: Checkout Info Form */}
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    
                    {/* Guest Contact Details */}
                    <div className="card-premium ornament-card gold-top">
                      <h3 style={{ fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>👤 بيانات العميل للتواصل</span>
                      </h3>
                      
                      <div className="form-group">
                        <label className="form-label" htmlFor="client-name">الاسم بالكامل *</label>
                        <input
                          id="client-name"
                          type="text"
                          className="form-control"
                          placeholder="مثال: أحمد محمد علي"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="client-phone">رقم التليفون للتواصل (موبايل مصري) *</label>
                        <input
                          id="client-phone"
                          type="tel"
                          className="form-control ltr"
                          placeholder="01020243667"
                          required
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                        {phoneError && (
                          <span style={{
                            color: "var(--status-cancelled-text)",
                            fontSize: "12px",
                            marginTop: "4px",
                            display: "block"
                          }}>
                            ⚠️ {phoneError}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="card-premium ornament-card gold-top">
                      <h3 style={{ fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>💳 طريقة الدفع والتسليم</span>
                      </h3>

                      <div className="form-group" style={{ gap: "14px" }}>
                        {/* Vodafone cash selection */}
                        <label style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          padding: "16px",
                          border: `1.5px solid ${paymentMethod === "VODAFONE_CASH" ? "var(--gold-400)" : "var(--border)"}`,
                          borderRadius: "var(--radius-sm)",
                          background: paymentMethod === "VODAFONE_CASH" ? "rgba(244,185,66,0.03)" : "rgba(255,255,255,0.01)",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}>
                          <input
                            type="radio"
                            name="payment_method"
                            value="VODAFONE_CASH"
                            checked={paymentMethod === "VODAFONE_CASH"}
                            onChange={() => setPaymentMethod("VODAFONE_CASH")}
                            style={{ marginTop: "5px", accentColor: "var(--gold-400)" }}
                          />
                          <div>
                            <span style={{ fontWeight: 700, fontSize: "15px", color: paymentMethod === "VODAFONE_CASH" ? "var(--gold-300)" : "var(--foreground)" }}>
                              تحويل فودافون كاش / محفظة إلكترونية
                            </span>
                            <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "4px", lineHeight: 1.6 }}>
                              التحويل على محفظتنا المركزية الموحدة وتأكيد الدفع من قبل حساباتنا.
                            </p>
                          </div>
                        </label>

                        {/* Store Pickup cash selection */}
                        <label style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          padding: "16px",
                          border: `1.5px solid ${paymentMethod === "CASH_ON_PICKUP" ? "var(--gold-400)" : "var(--border)"}`,
                          borderRadius: "var(--radius-sm)",
                          background: paymentMethod === "CASH_ON_PICKUP" ? "rgba(244,185,66,0.03)" : "rgba(255,255,255,0.01)",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}>
                          <input
                            type="radio"
                            name="payment_method"
                            value="CASH_ON_PICKUP"
                            checked={paymentMethod === "CASH_ON_PICKUP"}
                            onChange={() => setPaymentMethod("CASH_ON_PICKUP")}
                            style={{ marginTop: "5px", accentColor: "var(--gold-400)" }}
                          />
                          <div>
                            <span style={{ fontWeight: 700, fontSize: "15px", color: paymentMethod === "CASH_ON_PICKUP" ? "var(--gold-300)" : "var(--foreground)" }}>
                              الدفع عند الاستلام / في الفرع
                            </span>
                            <p style={{ fontSize: "12px", color: "var(--foreground-muted)", marginTop: "4px", lineHeight: 1.6 }}>
                              الدفع نقداً أو بالفيزا داخل فرع المطبعة المختار عند استلام المطبوعات الجاهزة.
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Condition Specific Displays */}
                      {paymentMethod === "VODAFONE_CASH" ? (
                        <div style={{
                          background: "rgba(244,185,66,0.05)",
                          border: "1px dashed var(--border-strong)",
                          borderRadius: "var(--radius-sm)",
                          padding: "16px",
                          marginTop: "16px",
                          fontSize: "13px",
                          lineHeight: 1.8
                        }}>
                          📌 <strong>تعليمات التحويل:</strong>
                          <p style={{ color: "var(--foreground-muted)", marginTop: "6px" }}>
                            يرجى تحويل قيمة الفاتورة بالكامل (<strong>{totalCost.toFixed(2)} ج.م</strong>) إلى رقم المحفظة:
                          </p>
                          <div style={{
                            textAlign: "center",
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "var(--gold-400)",
                            margin: "10px 0",
                            letterSpacing: "1px"
                          }}>
                            01020243667
                          </div>
                          <span style={{ color: "var(--status-pending-text)", display: "block", fontSize: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px", marginTop: "4px" }}>
                            * يرجى ملاحظة أن حالة الطلب ستبقى <strong>معلق (PENDING)</strong> ولن يبدأ التنفيذ والطباعة إلا بعد مراجعة وتأكيد استلام الحسابات للمبلغ.
                          </span>
                        </div>
                      ) : (
                        <div style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          padding: "16px",
                          marginTop: "16px"
                        }} className="form-group">
                          <label className="form-label" htmlFor="pickup-branch">اختر فرع الاستلام المفضل للتجهيز:</label>
                          <select
                            id="pickup-branch"
                            className="form-control"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
                          >
                            {BRANCHES.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Submit Section & Error alerts */}
                    {submitError && (
                      <div style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "var(--status-cancelled-text)",
                        padding: "14px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        textAlign: "right"
                      }}>
                        ⚠️ {submitError}
                      </div>
                    )}

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: "1px solid var(--border)",
                      paddingTop: "20px"
                    }}>
                      <div>
                        <span style={{ color: "var(--foreground-muted)", fontSize: "13px", display: "block" }}>إجمالي قيمة الفاتورة</span>
                        <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--gold-400)" }}>{totalCost.toFixed(2)} ج.م</span>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-gold btn-lg"
                        disabled={isSubmitting}
                        style={{ padding: "14px 40px", fontSize: "16px" }}
                      >
                        {isSubmitting ? "⌛ جاري إرسال طلبك..." : "🖨️ تأكيد وإرسال طلب الطباعة"}
                      </button>
                    </div>

                  </form>

                  {/* RIGHT COLUMN: Order Summary & File Uploads */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    
                    {/* Cart list panel */}
                    <div className="card-premium ornament-card gold-top">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "18px" }}>📋 سلة المشتريات ({cart.length})</h3>
                        <button
                          type="button"
                          onClick={clearCart}
                          className="btn btn-ghost btn-sm"
                          style={{ color: "var(--status-cancelled-text)", borderColor: "rgba(239,68,68,0.15)" }}
                        >
                          مسح السلة
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {cart.map((item, idx) => {
                          const isBanner = item.category?.toLowerCase() === "banners";
                          const subtotal = calculateItemSubtotal(item);
                          const bannerWidth = item.banner_width || 1.0;
                          const bannerHeight = item.banner_height || 1.0;
                          const squareMeters = (bannerWidth * bannerHeight).toFixed(2);

                          return (
                            <div key={idx} style={{
                              background: "rgba(255, 255, 255, 0.02)",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--radius-sm)",
                              padding: "16px",
                              position: "relative"
                            }}>
                              {/* Remove item button */}
                              <button
                                type="button"
                                onClick={() => removeCartItem(idx)}
                                style={{
                                  position: "absolute",
                                  top: "12px",
                                  left: "12px",
                                  background: "none",
                                  border: "none",
                                  color: "var(--foreground-subtle)",
                                  cursor: "pointer",
                                  fontSize: "14px"
                                }}
                                title="حذف العنصر"
                                onMouseEnter={(e) => e.currentTarget.style.color = "var(--status-cancelled-text)"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "var(--foreground-subtle)"}
                              >
                                ✕
                              </button>

                              <div style={{ paddingLeft: "15px" }}>
                                <span className="badge badge-gold" style={{ fontSize: "10px", marginBottom: "6px" }}>
                                  {isBanner ? "لافتات وبانر" : "مطبوعات ورقية"}
                                </span>
                                
                                <h4 style={{ fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-arabic)" }}>
                                  {item.product_name}
                                </h4>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                                  {item.option_names.map((optName, oIdx) => (
                                    <span key={oIdx} style={{
                                      fontSize: "11px",
                                      background: "rgba(244,185,66,0.06)",
                                      color: "var(--foreground-muted)",
                                      border: "1px solid var(--border)",
                                      borderRadius: "4px",
                                      padding: "2px 8px"
                                    }}>
                                      {optName}
                                    </span>
                                  ))}
                                </div>

                                {/* Banner Dimensions Specific Panel */}
                                {isBanner && (
                                  <div style={{
                                    margin: "12px 0 8px",
                                    padding: "8px 12px",
                                    background: "rgba(244, 185, 66, 0.02)",
                                    border: "1px dashed rgba(244, 185, 66, 0.15)",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    color: "var(--gold-300)",
                                    display: "flex",
                                    justifyContent: "space-between"
                                  }}>
                                    <span>📏 الأبعاد المطلوبة للطباعة:</span>
                                    <strong>{bannerWidth} م × {bannerHeight} م ({squareMeters} متر مربع)</strong>
                                  </div>
                                )}

                                <div style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginTop: "14px",
                                  borderTop: "1px solid rgba(255,255,255,0.04)",
                                  paddingTop: "10px",
                                  fontSize: "13px"
                                }}>
                                  <span style={{ color: "var(--foreground-muted)" }}>
                                    الكمية: <strong>{item.quantity}</strong> × {isBanner ? `EGP ${item.unit_price} / متر` : `EGP ${item.unit_price} / قطعة`}
                                  </span>
                                  <span style={{ fontWeight: 700, color: "var(--gold-400)", fontSize: "15px" }}>
                                    {subtotal.toFixed(2)} ج.م
                                  </span>
                                </div>
                              </div>

                              {/* DESIGN FILE UPLOAD SECTION FOR THIS SPECIFIC ITEM */}
                              <div style={{
                                borderTop: "1px solid var(--border)",
                                marginTop: "16px",
                                paddingTop: "14px"
                              }}>
                                <span style={{
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "var(--foreground-muted)",
                                  display: "block",
                                  marginBottom: "8px"
                                }}>
                                  📂 ملف التصميم للتنفيذ * <span style={{ fontSize: "10px", color: "var(--foreground-subtle)" }}>(مطلوب لتنفيذ الطباعة)</span>
                                </span>

                                {/* Drag-Drop Area */}
                                <div
                                  onDragEnter={(e) => handleDrag(e, idx)}
                                  onDragOver={(e) => handleDrag(e, idx)}
                                  onDragLeave={(e) => handleDrag(e, idx)}
                                  onDrop={(e) => handleDrop(e, idx)}
                                  style={{
                                    border: `1.5px dashed ${dragActiveItem === idx ? "var(--gold-400)" : "var(--border)"}`,
                                    background: dragActiveItem === idx ? "rgba(244,185,66,0.08)" : "rgba(255,255,255,0.01)",
                                    borderRadius: "var(--radius-xs)",
                                    padding: "20px 14px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    position: "relative",
                                    transition: "all 0.2s ease"
                                  }}
                                >
                                  <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.psd,.ai,.png,.jpeg,.jpg"
                                    onChange={(e) => handleFileInput(e, idx)}
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      opacity: 0,
                                      cursor: "pointer"
                                    }}
                                  />
                                  <span style={{ fontSize: "24px", display: "block", marginBottom: "4px" }}>📤</span>
                                  <span style={{ fontSize: "12px", color: "var(--foreground-muted)", display: "block" }}>
                                    اضغط لاختيار ملف التصميم أو اسحبه إلى هنا
                                  </span>
                                  <span style={{ fontSize: "10px", color: "var(--foreground-subtle)", display: "block", marginTop: "2px" }}>
                                    صيغ مدعومة: PDF, PSD, AI, صور (بحد أقصى 100MB)
                                  </span>
                                </div>

                                {/* Attached Files List Indicator */}
                                {filesPerItem[idx] && filesPerItem[idx].length > 0 && (
                                  <div style={{
                                    marginTop: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px"
                                  }}>
                                    {filesPerItem[idx].map((file, fileIdx) => (
                                      <div key={fileIdx} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "rgba(34, 197, 94, 0.06)",
                                        border: "1px solid rgba(34,197,94,0.15)",
                                        borderRadius: "var(--radius-xs)",
                                        padding: "6px 12px",
                                        fontSize: "12px"
                                      }}>
                                        <span style={{
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          maxWidth: "240px",
                                          color: "var(--status-delivered-text)"
                                        }}>
                                          ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} ميجا)
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => removeFileFromItem(idx, fileIdx)}
                                          style={{
                                            background: "none",
                                            border: "none",
                                            color: "var(--status-cancelled-text)",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                          }}
                                        >
                                          حذف
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Summary statistics card */}
                    <div className="card-premium ornament-card gold-top">
                      <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>💵 تفاصيل الفاتورة</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--foreground-muted)" }}>المجموع الفرعي:</span>
                          <span>{totalCost.toFixed(2)} ج.م</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--foreground-muted)" }}>الشحن والتجهيز:</span>
                          <span style={{ color: "var(--status-delivered-text)", fontWeight: "bold" }}>مجاناً</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--foreground-muted)" }}>ضريبة القيمة المضافة:</span>
                          <span>مشمولة</span>
                        </div>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderTop: "1px solid var(--border)",
                          paddingTop: "12px",
                          marginTop: "4px",
                          fontSize: "16px"
                        }}>
                          <span style={{ fontWeight: 700 }}>الإجمالي النهائي:</span>
                          <strong style={{ color: "var(--gold-400)", fontSize: "18px" }}>{totalCost.toFixed(2)} ج.م</strong>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* SUBMIT LOADING OVERLAY */}
      {isSubmitting && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(5, 12, 26, 0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          color: "var(--foreground)",
          textAlign: "center",
          padding: "24px"
        }}>
          {/* Elegant Circular Arabic Pattern Spinner */}
          <div style={{
            position: "relative",
            width: "100px",
            height: "100px",
            marginBottom: "24px"
          }}>
            {/* outer spinning circle */}
            <div style={{
              position: "absolute",
              inset: 0,
              border: "3px solid transparent",
              borderTop: "3px solid var(--gold-400)",
              borderRight: "3px solid var(--gold-400)",
              borderRadius: "50%",
              animation: "rotateSlow 1.5s linear infinite"
            }} />
            {/* inner backward spinning circle */}
            <div style={{
              position: "absolute",
              inset: "10px",
              border: "2px solid transparent",
              borderBottom: "2px solid var(--gold-600)",
              borderLeft: "2px solid var(--gold-600)",
              borderRadius: "50%",
              animation: "rotateSlow 1s linear infinite reverse"
            }} />
            {/* center gold star/diamond */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "var(--gold-400)"
            }}>
              ◆
            </div>
          </div>

          <h3 style={{ fontSize: "20px", color: "var(--gold-300)", marginBottom: "8px", fontFamily: "var(--font-heading)" }}>
            جاري إرسال طلبك ورفع الملفات...
          </h3>
          <p style={{ color: "var(--foreground-muted)", fontSize: "14px", maxWidth: "420px", lineHeight: 1.6 }}>
            برجاء الانتظار وعدم إغلاق الصفحة. نقوم حالياً برفع ملفات التصميم الخاصة بك وتأمين الاتصال مع سيرفرات مطبعة السلاموني.
          </p>
        </div>
      )}

      {/* Inject custom rotation keyframe inline since we need rotateSlow */}
      <style jsx global>{`
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <Footer />
    </div>
  );
}
