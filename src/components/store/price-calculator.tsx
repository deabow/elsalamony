"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Sliders, 
  UploadCloud, 
  FileText, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Calculator, 
  Ruler, 
  HelpCircle,
  Plus,
  Minus
} from "lucide-react";

interface OptionValue {
  id: string;
  value: string;
  priceModifier: number;
}

interface ProductOption {
  id: string;
  name: string;
  isRequired: boolean;
  values: OptionValue[];
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  sku: string;
  category?: string;
  options: ProductOption[];
}

interface PriceCalculatorProps {
  product: ProductData;
}

export default function PriceCalculator({ product }: PriceCalculatorProps) {
  const router = useRouter();

  // State for selected options (optionName -> valueId)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(100);
  const [unitPrice, setUnitPrice] = useState<number>(product.basePrice);
  const [totalPrice, setTotalPrice] = useState<number>(product.basePrice * 100);

  // Banner specific dimensions
  const [bannerWidth, setBannerWidth] = useState<number>(1.0);
  const [bannerHeight, setBannerHeight] = useState<number>(1.0);

  // Customer details state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Uploaded files state — url is intentionally absent here.
  // The real upload to Cloudinary happens server-side during order submission.
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; type: string }>>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("VODAFONE_CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Set default option values on load
  useEffect(() => {
    const defaults: Record<string, string> = {};
    product.options.forEach((opt) => {
      if (opt.values.length > 0) {
        defaults[opt.name] = opt.values[0].id;
      }
    });
    setSelectedOptions(defaults);
    if (product.category?.toLowerCase() === "banners") {
      setQuantity(1);
    }
  }, [product]);

  // Recalculate price whenever options, quantity, or banner dimensions change
  useEffect(() => {
    let modifierSum = 0;
    product.options.forEach((opt) => {
      const selectedValueId = selectedOptions[opt.name];
      if (selectedValueId) {
        const val = opt.values.find((v) => v.id === selectedValueId);
        if (val) {
          modifierSum += Number(val.priceModifier);
        }
      }
    });

    const calculatedUnit = product.basePrice + modifierSum;
    setUnitPrice(calculatedUnit);

    const isBanner = product.category?.toLowerCase() === "banners";
    if (isBanner) {
      setTotalPrice(bannerWidth * bannerHeight * calculatedUnit * quantity);
    } else {
      setTotalPrice(calculatedUnit * quantity);
    }
  }, [selectedOptions, quantity, bannerWidth, bannerHeight, product]);

  const handleOptionChange = (optionName: string, valueId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: valueId,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setErrorMessage("");

    // Store actual File objects — the real upload to Cloudinary happens
    // server-side when the order is submitted via FormData.
    const incoming = Array.from(e.target.files);
    setRawFiles((prev) => [...prev, ...incoming]);
    setUploadedFiles((prev) => [
      ...prev,
      ...incoming.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    ]);

    // Reset the input value so the same file can be re-selected if removed.
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setRawFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage("يرجى كتابة اسم العميل ورقم الهاتف للتواصل قبل إتمام الطلب.");
      return;
    }

    if (rawFiles.length === 0) {
      setErrorMessage("يرجى رفع ملف التصميم المطلوبة طباعته (PDF, PSD, AI, أو صورة عالية الجودة).");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("guest_name", customerName);
      formData.append("guest_phone", customerPhone);

      const optionValueIds = Object.values(selectedOptions);

      const itemsPayload = [
        {
          product_id: product.id,
          quantity,
          options: optionValueIds,
          file_indices: rawFiles.map((_, idx) => idx),
          banner_width: product.category?.toLowerCase() === "banners" ? Number(bannerWidth) : undefined,
          banner_height: product.category?.toLowerCase() === "banners" ? Number(bannerHeight) : undefined,
        }
      ];

      formData.append("items", JSON.stringify(itemsPayload));

      rawFiles.forEach((file) => {
        formData.append("design_files", file);
      });

      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل إرسال الطلب، يرجى المحاولة لاحقاً.");
      }

      setSuccessMessage(`تم استلام طلبك بنجاح! كود التتبع الخاص بك هو: ${data.orderId}`);
      
      setTimeout(() => {
        router.push(`/order-tracking?orderId=${data.orderId}&phone=${customerPhone}`);
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ غير متوقع أثناء إرسال الطلب.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "36px", alignItems: "start" }}>
      
      {/* LEFT COLUMN: Specifications & File Upload */}
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        
        {/* Step 1: Product Specifications */}
        <div className="card-premium" style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "var(--gradient-gold)", color: "#040914",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: "16px"
            }}>١</div>
            <h3 style={{ fontSize: "20px", fontFamily: "var(--font-heading)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <Sliders size={20} style={{ color: "var(--gold-400)" }} />
              تحديد المواصفات الفنية
            </h3>
          </div>
          
          {product.options.map((opt) => (
            <div key={opt.id} className="form-group" style={{ marginBottom: "22px" }}>
              <span className="form-label" style={{ fontSize: "14.5px", color: "var(--foreground)", fontWeight: 700 }}>
                {opt.name}
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {opt.values.map((val) => {
                  const isSelected = selectedOptions[opt.name] === val.id;
                  const mod = val.priceModifier;
                  const labelModifier = mod === 0 ? "" : mod > 0 ? ` (+${mod} ج.م)` : ` (-${Math.abs(mod)} ج.م)`;
                  
                  return (
                    <button
                      key={val.id}
                      type="button"
                      onClick={() => handleOptionChange(opt.name, val.id)}
                      className={`btn cursor-pointer ${isSelected ? "btn-gold" : "btn-ghost"}`}
                      style={{
                        padding: "9px 18px",
                        fontSize: "13.5px",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      {val.value} {labelModifier}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Banner Dimensions Input */}
          {product.category?.toLowerCase() === "banners" && (
            <div style={{
              margin: "24px 0",
              padding: "24px 20px",
              background: "rgba(245, 184, 55, 0.04)",
              border: "1px dashed var(--border-strong)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}>
              <h4 style={{ fontSize: "15px", color: "var(--gold-400)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Ruler size={18} />
                أبعاد البانر المطلوبة (بالأمتار)
              </h4>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, textAlign: "center" }}>
                  <label htmlFor="banner-width" style={{ fontSize: "13px", color: "var(--foreground-muted)", fontWeight: "600" }}>العرض (متر)</label>
                  <input
                    id="banner-width"
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="form-control"
                    style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
                    value={bannerWidth}
                    onChange={(e) => setBannerWidth(Math.max(0.1, Number(e.target.value) || 0.1))}
                  />
                </div>
                <div style={{ fontSize: "20px", color: "var(--gold-400)", fontWeight: "bold", marginTop: "22px" }}>×</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, textAlign: "center" }}>
                  <label htmlFor="banner-height" style={{ fontSize: "13px", color: "var(--foreground-muted)", fontWeight: "600" }}>الطول (متر)</label>
                  <input
                    id="banner-height"
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="form-control"
                    style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
                    value={bannerHeight}
                    onChange={(e) => setBannerHeight(Math.max(0.1, Number(e.target.value) || 0.1))}
                  />
                </div>
              </div>
              <div style={{ fontSize: "13px", color: "var(--foreground-subtle)", borderTop: "1px dashed var(--border)", paddingTop: "10px", textAlign: "center" }}>
                المساحة الإجمالية المطلوبة: <strong style={{ color: "var(--gold-300)" }}>{(bannerWidth * bannerHeight).toFixed(2)} متر مربع</strong>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="form-group" style={{ marginTop: "24px" }}>
            <label className="form-label" htmlFor="qty-select" style={{ fontSize: "14.5px", color: "var(--foreground)", fontWeight: 700 }}>
              الكمية المطلوبة (بالعدد)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              {product.category?.toLowerCase() === "banners" ? (
                <input
                  id="qty-select"
                  type="number"
                  min="1"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  style={{ maxWidth: "160px", textAlign: "center", fontWeight: "bold" }}
                />
              ) : (
                <select
                  id="qty-select"
                  className="form-control cursor-pointer"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ maxWidth: "180px", fontWeight: 700 }}
                >
                  <option value={50}>50 قطعة</option>
                  <option value={100}>100 قطعة</option>
                  <option value={250}>250 قطعة</option>
                  <option value={500}>500 قطعة</option>
                  <option value={1000}>1000 قطعة</option>
                  <option value={2500}>2500 قطعة</option>
                  <option value={5000}>5000 قطعة</option>
                </select>
              )}
              <span style={{ fontSize: "14px", color: "var(--foreground-muted)", background: "rgba(245, 184, 55, 0.08)", padding: "8px 16px", borderRadius: "var(--radius-xs)", border: "1px solid var(--border)" }}>
                تكلفة القطعة الواحدة: <strong style={{ color: "var(--gold-400)" }}>{unitPrice.toFixed(2)} ج.م</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Upload Files */}
        <div className="card-premium" style={{ padding: "32px", borderColor: uploadedFiles.length > 0 ? "var(--gold-400)" : "var(--border-strong)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "var(--gradient-gold)", color: "#040914",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: "16px"
            }}>٢</div>
            <div>
              <h3 style={{ fontSize: "20px", fontFamily: "var(--font-heading)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <UploadCloud size={20} style={{ color: "var(--gold-400)" }} />
                رفع ملف التصميم
              </h3>
            </div>
          </div>

          <p style={{ fontSize: "13.5px", color: "var(--foreground-subtle)", marginBottom: "20px" }}>
            الملفات المقبولة: PDF, PSD, AI, أو صور عالية الدقة (JPG, PNG). الحد الأقصى لكل ملف: 100 ميجابايت.
          </p>

          <div style={{
            border: "2px dashed var(--border-strong)",
            borderRadius: "var(--radius-md)",
            padding: "36px 20px",
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
            background: "rgba(245, 184, 55, 0.03)",
            transition: "all 0.25s ease",
          }}>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.psd,.ai,.png,.jpeg,.jpg"
              multiple
              className="cursor-pointer"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <UploadCloud size={38} style={{ color: "var(--gold-400)" }} />
              <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--foreground)" }}>اضغط هنا لاختيار الملفات أو اسحبها داخل المربع</span>
              <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>يمكنك اختيار أكثر من ملف — سوف يراجع فريق التصميم الملفات مجاناً قبل بدء الطباعة</span>
            </div>
          </div>

          {/* List of uploaded files */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {uploadedFiles.map((file, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.04)",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "14px",
                  border: "1px solid var(--border-strong)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                    <FileText size={18} style={{ color: "var(--gold-400)", flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>
                      {file.name}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--foreground-subtle)" }}>
                      ({(file.size / 1024 / 1024).toFixed(2)} ميجابايت)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="cursor-pointer"
                    style={{ background: "none", border: "none", color: "var(--status-cancelled-text)", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <Trash2 size={16} />
                    <span>حذف</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Customer Information & Instant Checkout */}
      <form onSubmit={handleCheckoutSubmit} className="card-premium" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "var(--gradient-gold)", color: "#040914",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "16px"
          }}>٣</div>
          <h3 style={{ fontSize: "20px", fontFamily: "var(--font-heading)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <User size={20} style={{ color: "var(--gold-400)" }} />
            بيانات التواصل والتأكيد
          </h3>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-name">الاسم الكامل <span style={{ color: "var(--status-cancelled-text)" }}>*</span></label>
          <div style={{ position: "relative" }}>
            <input
              id="cust-name"
              type="text"
              className="form-control"
              placeholder="مثال: أحمد محمود السلاموني"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-phone">رقم الهاتف / الواتساب <span style={{ color: "var(--status-cancelled-text)" }}>*</span></label>
          <input
            id="cust-phone"
            type="tel"
            className="form-control"
            placeholder="مثال: 01020243667"
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-email">البريد الإلكتروني (اختياري)</label>
          <input
            id="cust-email"
            type="email"
            className="form-control"
            placeholder="elsalamony.press@gmail.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-address">عنوان الشحن بالتفصيل (أو استلام من المعرض)</label>
          <textarea
            id="cust-address"
            className="form-control"
            rows={2}
            placeholder="اكتب العنوان بالتفصيل للتوصيل، أو اكتب (استلام من فرع السادات/الإسكندرية)"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-notes">ملاحظات وتعليمات خاصة بالطباعة</label>
          <textarea
            id="cust-notes"
            className="form-control"
            rows={2}
            placeholder="أي تعليمات إضافية بخصوص الألوان، الهوامش، أو طريقة التغليف..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Payment Verification Box */}
        <div style={{ background: "rgba(245, 184, 55, 0.05)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-strong)" }}>
          <h4 style={{ fontSize: "15px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold-400)" }}>
              <Wallet size={18} />
              طريقة الدفع المتاحة
            </span>
            <span className="badge badge-gold" style={{ fontSize: "10px" }}>تأكيد فوري</span>
          </h4>

          <div className="form-group" style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className={`btn cursor-pointer ${paymentMethod === "VODAFONE_CASH" ? "btn-gold" : "btn-ghost"}`}
                style={{ padding: "8px 14px", fontSize: "12.5px", flex: 1 }}
                onClick={() => setPaymentMethod("VODAFONE_CASH")}
              >
                فودافون كاش
              </button>
              <button
                type="button"
                className={`btn cursor-pointer ${paymentMethod === "BANK_TRANSFER" ? "btn-gold" : "btn-ghost"}`}
                style={{ padding: "8px 14px", fontSize: "12.5px", flex: 1 }}
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
              >
                تحويل بنكي / InstaPay
              </button>
            </div>
          </div>

          <p style={{ fontSize: "12.5px", color: "var(--foreground-muted)", margin: "10px 0" }}>
            {paymentMethod === "VODAFONE_CASH" 
              ? "يرجى تحويل المبلغ المحسوب على محفظة فودافون كاش: 01020243667" 
              : "تحويل لحساب البنك التجاري الدولي (CIB) أو انستا باي: 100020304050"}
          </p>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="pay-ref" style={{ fontSize: "12px" }}>رقم العملية / رقم محفظة الراسل</label>
            <input
              id="pay-ref"
              type="text"
              className="form-control"
              placeholder="مثال: محفظة 01020243667 أو رقم العملية..."
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Order Total Summary Banner */}
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "13px", color: "var(--foreground-subtle)", display: "block" }}>إجمالي تكلفة الطلب</span>
              <span style={{ fontSize: "30px", fontWeight: 800, color: "var(--gold-400)", fontFamily: "var(--font-heading)" }}>
                {totalPrice.toFixed(2)} <span style={{ fontSize: "16px" }}>ج.م</span>
              </span>
            </div>
            <button
              type="submit"
              className="btn btn-gold btn-lg cursor-pointer"
              disabled={isSubmitting}
              style={{ padding: "14px 32px", gap: "8px" }}
            >
              <Send size={18} />
              <span>{isSubmitting ? "جاري الإرسال..." : "تأكيد وإرسال الطلب"}</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "var(--status-cancelled-text)", padding: "14px", borderRadius: "var(--radius-sm)", fontSize: "13.5px", display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)", color: "var(--status-delivered-text)", padding: "14px", borderRadius: "var(--radius-sm)", fontSize: "13.5px", display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}
