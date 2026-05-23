"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        toast.error("Invalid email or password");
        setLoading(false);
      } else if (res?.ok) {
        toast.success("Welcome back!");
        // Use window.location for reliable redirect in Next.js 15 production
        window.location.href = "/dashboard";
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      // Use absolute URL for callbackUrl — relative paths break in production
      const baseUrl = window.location.origin;
      await signIn("google", { callbackUrl: `${baseUrl}/dashboard` });
    } catch {
      toast.error("Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-purple), transparent)", opacity: 0.12, filter: "blur(100px)", top: -100, left: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-pink), transparent)", opacity: 0.08, filter: "blur(100px)", bottom: -100, right: -100, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 20, color: "var(--text-primary)" }}>CreatorAI</span>
          </Link>
          <h1 style={{ fontFamily: "var(--font-manrope)", fontSize: 26, fontWeight: 800, color: "var(--text-primary)", marginTop: 24, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Sign in to your account to continue creating</p>
        </div>

        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 20, padding: 32 }}>
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1px solid var(--border-default)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20, fontFamily: "var(--font-manrope)", opacity: googleLoading ? 0.7 : 1 }}
          >
            {googleLoading ? (
              <span className="spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
            )}
            {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="creator-input" placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Password</label>
                <Link href="#" style={{ fontSize: 12, color: "var(--accent-purple-light)", textDecoration: "none" }}>Forgot password?</Link>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="creator-input" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-generate">
              {loading ? <><span className="spinner" /> Signing in...</> : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)", marginTop: 20 }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "var(--accent-purple-light)", fontWeight: 600, textDecoration: "none" }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}