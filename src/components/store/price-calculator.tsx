"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [quantity, setQuantity] = useState<number>(100); // Default to bulk/batch quantity
  const [unitPrice, setUnitPrice] = useState<number>(product.basePrice);
  const [totalPrice, setTotalPrice] = useState<number>(product.basePrice * 100);

  // Banner specific dimensions
  const [bannerWidth, setBannerWidth] = useState<number>(1.0);
  const [bannerHeight, setBannerHeight] = useState<number>(1.0);

  // Guest details state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Uploaded files state (simulated S3 metadata for UI display)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; type: string; url: string }>>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Manual payment state
  const [paymentMethod, setPaymentMethod] = useState("VODAFONE_CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [receiptImage, setReceiptImage] = useState("");
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
      setQuantity(1); // Banners default to quantity of 1
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    setErrorMessage("");

    try {
      const file = e.target.files[0];
      setRawFiles((prev) => [...prev, file]);
      
      // Prototyping: mock-uploading in 1.5 seconds.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUrl = `https://print-house-bucket.s3.amazonaws.com/uploads/${Date.now()}-${file.name}`;
      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: file.size,
          type: file.type,
          url: mockUrl,
        },
      ]);
    } catch (err) {
      setErrorMessage("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setRawFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage("Verified Customer Name and Phone Number are mandatory before checkout.");
      return;
    }

    if (rawFiles.length === 0) {
      setErrorMessage("Please upload at least one design file (PDF, PSD, or image) before printing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("guest_name", customerName);
      formData.append("guest_phone", customerPhone);

      const optionValueIds = Object.values(selectedOptions);

      // Construct item payload mapping file indices and banner dimensions
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

      // Append binary files
      rawFiles.forEach((file) => {
        formData.append("design_files", file);
      });

      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order.");
      }

      setSuccessMessage(`Order placed successfully! Tracking ID: ${data.orderId}`);
      
      // Redirect to guest tracking after a short delay
      setTimeout(() => {
        router.push(`/order-tracking?orderId=${data.orderId}&phone=${customerPhone}`);
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }} className="grid-cols-2">
      
      {/* LEFT COLUMN: Custom Configuration & File Upload */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Dynamic Options */}
        <div className="premium-card">
          <h3 style={{ marginBottom: "20px" }}>1. Configure Specifications</h3>
          
          {product.options.map((opt) => (
            <div key={opt.id} className="form-group">
              <span className="form-label">{opt.name}</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {opt.values.map((val) => {
                  const isSelected = selectedOptions[opt.name] === val.id;
                  const mod = val.priceModifier;
                  const labelModifier = mod === 0 ? "" : mod > 0 ? ` (+EGP ${mod})` : ` (-EGP ${Math.abs(mod)})`;
                  
                  return (
                    <button
                      key={val.id}
                      type="button"
                      onClick={() => handleOptionChange(opt.name, val.id)}
                      className={`btn ${isSelected ? "btn-primary" : "btn-secondary"}`}
                      style={{
                        padding: "8px 16px",
                        fontSize: "13px",
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

          {/* Banner Dimensions Input (If Category is Banners) */}
          {product.category?.toLowerCase() === "banners" && (
            <div style={{
              margin: "24px 0",
              padding: "24px 20px",
              background: "rgba(244, 185, 66, 0.03)",
              border: "1px dashed var(--border-strong)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <h4 style={{ fontSize: "15px", color: "var(--gold-400)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                📐 أبعاد البانر المطلوبة (بالأمتار)
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
                <div style={{ fontSize: "18px", color: "var(--gold-500)", fontWeight: "bold", marginTop: "20px" }}>×</div>
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
              <div style={{ fontSize: "12px", color: "var(--foreground-subtle)", borderTop: "1px dashed var(--border)", width: "100%", paddingTop: "8px", textAlign: "center" }}>
                المساحة الإجمالية: <strong style={{ color: "var(--gold-400)" }}>{(bannerWidth * bannerHeight).toFixed(2)} متر مربع</strong>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="form-group" style={{ marginTop: "24px" }}>
            <label className="form-label" htmlFor="qty-select">الكمية المطلوبة (العدد)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {product.category?.toLowerCase() === "banners" ? (
                <input
                  id="qty-select"
                  type="number"
                  min="1"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  style={{ maxWidth: "150px", textAlign: "center", fontWeight: "bold" }}
                />
              ) : (
                <select
                  id="qty-select"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ maxWidth: "150px" }}
                >
                  <option value={50}>50 pcs</option>
                  <option value={100}>100 pcs</option>
                  <option value={250}>250 pcs</option>
                  <option value={500}>500 pcs</option>
                  <option value={1000}>1000 pcs</option>
                  <option value={2500}>2500 pcs</option>
                </select>
              )}
              <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                Unit Cost: <strong>EGP {unitPrice.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* File Upload Box */}
        <div className="premium-card" style={{ borderColor: isUploading ? "var(--primary)" : "var(--card-border)" }}>
          <h3 style={{ marginBottom: "12px" }}>2. Upload Design Files</h3>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
            PDF, PSD, AI, or High-Resolution images (Max 100MB per file) are supported.
          </p>

          <div style={{
            border: "2px dashed var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "30px 20px",
            textAlign: "center",
            cursor: "pointer",
            position: "relative"
          }}>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.psd,.ai,.png,.jpeg,.jpg"
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
            {isUploading ? (
              <span style={{ color: "var(--primary)" }}>Uploading & validating metadata...</span>
            ) : (
              <div>
                <span style={{ display: "block", fontSize: "30px", marginBottom: "8px" }}>📂</span>
                <span style={{ fontWeight: 600 }}>Click to choose or drag files here</span>
              </div>
            )}
          </div>

          {/* List of uploaded files */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {uploadedFiles.map((file, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.03)",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  border: "1px solid var(--border)"
                }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
                    📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    style={{ background: "none", border: "none", color: "var(--status-cancelled-text)", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Contact Details & Checkout Proof */}
      <form onSubmit={handleCheckoutSubmit} className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>3. Customer & Checkout Information</h3>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-name">Full Name <span style={{ color: "var(--status-cancelled-text)" }}>*</span></label>
          <input
            id="cust-name"
            type="text"
            className="form-control"
            placeholder="John Doe"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-phone">Phone Number <span style={{ color: "var(--status-cancelled-text)" }}>*</span></label>
          <input
            id="cust-phone"
            type="tel"
            className="form-control"
            placeholder="01020243667"
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-email">Email Address (Optional)</label>
          <input
            id="cust-email"
            type="email"
            className="form-control"
            placeholder="johndoe@example.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-address">Shipping / Delivery Address</label>
          <textarea
            id="cust-address"
            className="form-control"
            rows={3}
            placeholder="Enter full physical address for delivery, or leave blank to pickup at Elsalamony showroom"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cust-notes">Printing Notes / Instructions</label>
          <textarea
            id="cust-notes"
            className="form-control"
            rows={2}
            placeholder="E.g., Please ensure margins are preserved."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Phase 1 Manual Payment Portal */}
        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", marginTop: "12px" }}>
          <h4 style={{ fontSize: "15px", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
            <span>💰 Manual Payment Verification</span>
            <span className="badge badge-pending" style={{ fontSize: "9px" }}>Phase 1</span>
          </h4>

          <div className="form-group">
            <span className="form-label">Payment Method</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className={`btn ${paymentMethod === "VODAFONE_CASH" ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "8px 12px", fontSize: "12px" }}
                onClick={() => setPaymentMethod("VODAFONE_CASH")}
              >
                Vodafone Cash
              </button>
              <button
                type="button"
                className={`btn ${paymentMethod === "BANK_TRANSFER" ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "8px 12px", fontSize: "12px" }}
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
              >
                Bank Transfer
              </button>
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "var(--muted)", margin: "8px 0" }}>
            {paymentMethod === "VODAFONE_CASH" 
              ? "Send the total amount to Vodafone Cash wallet: 01020243667" 
              : "Transfer to CIB Egypt Account Number: 100020304050"}
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="pay-ref">Transaction Reference / Sender's Wallet Number</label>
            <input
              id="pay-ref"
              type="text"
              className="form-control"
              placeholder="E.g., Wallet 01020243667 / Tx ID 928372"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Order Summary & Pricing */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "13px", color: "var(--muted)", display: "block" }}>Total Order Cost</span>
            <span style={{ fontSize: "28px", fontWeight: 800 }}>EGP {totalPrice.toFixed(2)}</span>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || isUploading}
            style={{ padding: "14px 28px" }}
          >
            {isSubmitting ? "Processing..." : "Place Print Order"}
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--status-cancelled-text)", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "13px", textAlign: "center" }}>
            ⚠️ {errorMessage}
          </div>
        )}
        {successMessage && (
          <div style={{ background: "rgba(34, 197, 94, 0.1)", color: "var(--status-delivered-text)", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "13px", textAlign: "center" }}>
            ✅ {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}
