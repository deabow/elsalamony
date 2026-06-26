"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--navy-950)",
      position: "relative",
      overflow: "hidden",
      padding: "24px"
    }}>
      {/* Background decorations */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,150,42,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 20%, rgba(26,47,92,0.4) 0%, transparent 60%)
        `
      }} />

      <div style={{
        position: "absolute", top: "40px", right: "40px",
        color: "rgba(244,185,66,0.1)", fontSize: "80px", userSelect: "none"
      }}>❖</div>

      <div className="animate-in" style={{
        width: "100%",
        maxWidth: "460px",
        background: "var(--gradient-card-premium)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        padding: "48px 36px",
        position: "relative",
        zIndex: 10
      }}>
        {/* Logo Section */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: "56px", height: "56px",
            background: "linear-gradient(135deg, var(--gold-500), var(--gold-400))",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--shadow-glow)",
            overflow: "hidden",
            margin: "0 auto 16px"
          }}>
            <img src="/logo.jpeg" alt="لوجو مطبعة السلاموني" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <h1 style={{ fontSize: "24px", fontFamily: "var(--font-heading)", color: "var(--gold-400)", marginBottom: "6px" }}>
            مطبعة السلاموني
          </h1>
          <p style={{ fontSize: "12px", color: "var(--foreground-muted)" }}>
            بوابة تسجيل دخول الموظفين والطاقم الفني
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {errorMsg && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "var(--status-cancelled-text)",
              padding: "12px",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px",
              marginBottom: "24px",
              textAlign: "right"
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">البريد الإلكتروني للعمل *</label>
            <input
              id="login-email"
              type="email"
              className="form-control ltr"
              placeholder="name@elsalamony.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "28px" }}>
            <label className="form-label" htmlFor="login-password">كلمة المرور *</label>
            <input
              id="login-password"
              type="password"
              className="form-control ltr"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold btn-lg"
            style={{ width: "100%", fontSize: "16px" }}
            disabled={isLoading}
          >
            {isLoading ? "⌛ جاري التحقق..." : "🔑 تسجيل الدخول"}
          </button>
        </form>

        <div style={{
          marginTop: "28px",
          borderTop: "1px solid var(--border)",
          paddingTop: "20px",
          textAlign: "center"
        }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--foreground-subtle)", textDecoration: "underline" }}>
            ← العودة إلى المتجر الرئيسي
          </Link>
        </div>
      </div>
    </div>
  );
}
