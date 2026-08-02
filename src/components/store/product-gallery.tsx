"use client";

import React, { useState } from "react";
import { Image as ImageIcon, ChevronLeft, ChevronRight, ZoomIn, Layers } from "lucide-react";

interface ProductGalleryProps {
  images?: string[];
  productName: string;
}

export default function ProductGallery({ images = [], productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fallback demo images if product has no uploaded images
  const displayImages = images.length > 0 ? images : [];

  if (displayImages.length === 0) {
    return (
      <div className="card-premium" style={{
        padding: "48px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "320px",
        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(245,184,55,0.05) 0%, transparent 70%)"
      }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "20px",
          background: "rgba(245,184,55,0.1)",
          border: "1px solid var(--border-strong)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--gold-400)",
          marginBottom: "16px"
        }}>
          <ImageIcon size={36} />
        </div>
        <h3 style={{ fontSize: "18px", color: "var(--foreground)", marginBottom: "6px", fontFamily: "var(--font-heading)" }}>
          {productName}
        </h3>
        <p style={{ color: "var(--foreground-muted)", fontSize: "13.5px" }}>
          معاينة المطبوعات والتصميم المخصص
        </p>
      </div>
    );
  }

  const selectedImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      {/* Main Image Display */}
      <div className="card-premium" style={{
        position: "relative",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "#040812",
        minHeight: "360px",
        maxHeight: "520px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}>
        <img
          src={selectedImage}
          alt={`${productName} - صورة ${selectedIndex + 1}`}
          style={{
            maxWidth: "100%",
            maxHeight: "480px",
            objectFit: "contain",
            borderRadius: "var(--radius-md)",
            transition: "transform 0.3s ease, opacity 0.3s ease",
            cursor: "zoom-in"
          }}
          onClick={() => setIsZoomed(true)}
        />

        {/* Zoom Icon Badge */}
        <button
          onClick={() => setIsZoomed(true)}
          className="btn btn-ghost btn-sm"
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            background: "rgba(4,9,20,0.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--border)",
            color: "var(--gold-400)",
            padding: "8px",
            borderRadius: "50%"
          }}
          title="تكبير الصورة"
        >
          <ZoomIn size={18} />
        </button>

        {/* Counter Badge */}
        <div className="badge badge-gold" style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          fontSize: "12px",
          gap: "6px"
        }}>
          <Layers size={14} />
          <span>{selectedIndex + 1} / {displayImages.length}</span>
        </div>

        {/* Previous / Next Navigation Arrows for multi-image */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1))}
              className="btn btn-ghost btn-sm cursor-pointer"
              style={{
                position: "absolute",
                top: "50%",
                right: "16px",
                transform: "translateY(-50%)",
                background: "rgba(4,9,20,0.75)",
                border: "1px solid var(--border)",
                color: "var(--gold-400)",
                padding: "8px",
                borderRadius: "50%"
              }}
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0))}
              className="btn btn-ghost btn-sm cursor-pointer"
              style={{
                position: "absolute",
                top: "50%",
                left: "16px",
                transform: "translateY(-50%)",
                background: "rgba(4,9,20,0.75)",
                border: "1px solid var(--border)",
                color: "var(--gold-400)",
                padding: "8px",
                borderRadius: "50%"
              }}
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Gallery Carousel */}
      {displayImages.length > 1 && (
        <div style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "8px",
          scrollbarWidth: "thin"
        }}>
          {displayImages.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "var(--radius-sm)",
                border: selectedIndex === idx ? "2px solid var(--gold-400)" : "1px solid var(--border)",
                boxShadow: selectedIndex === idx ? "0 0 12px rgba(245,184,55,0.3)" : "none",
                overflow: "hidden",
                cursor: "pointer",
                background: "#040812",
                flexShrink: 0,
                padding: "4px",
                opacity: selectedIndex === idx ? 1 : 0.65,
                transition: "all 0.2s ease"
              }}
            >
              <img
                src={imgUrl}
                alt={`معاينة ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Lightbox */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out"
          }}
        >
          <img
            src={selectedImage}
            alt={productName}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 0 40px rgba(0,0,0,0.8)"
            }}
          />
          <button
            onClick={() => setIsZoomed(false)}
            style={{
              position: "absolute",
              top: "24px",
              left: "24px",
              color: "#fff",
              fontSize: "24px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
