"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const PLATFORMS = ["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter/X"];

export function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        paddingTop: 120,
        paddingBottom: 80,
        paddingLeft: 24,
        paddingRight: 24,
        overflow: "hidden",
      }}
    >
      {/* Orbs */}
      <div className="orb w-[700px] h-[700px] -top-48 -left-32 opacity-20"
        style={{ background: "radial-gradient(circle, var(--accent-purple), transparent)" }} />
      <div className="orb w-[500px] h-[500px] -top-24 -right-24 opacity-15"
        style={{ background: "radial-gradient(circle, var(--accent-pink), transparent)" }} />
      <div className="orb w-[400px] h-[400px] bottom-0 left-1/2 -translate-x-1/2 opacity-10"
        style={{ background: "radial-gradient(circle, var(--accent-teal), transparent)" }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8"
          style={{
            border: "1px solid rgba(124,92,252,0.4)",
            background: "rgba(124,92,252,0.1)",
            color: "var(--accent-purple-light)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Now powered by Groq Llama 3.3 — 10x faster AI generation
        </div>

        {/* Heading */}
        <h1
          className="font-display font-black leading-[1.05] mb-6"
          style={{ fontSize: "clamp(42px, 7vw, 88px)", letterSpacing: "-2px", color: "var(--text-primary)" }}
        >
          Your AI{" "}
          <span className="gradient-text">Co-Pilot</span>
          <br />
          for Viral Content
        </h1>

        {/* Sub */}
        <p
          className="text-lg md:text-xl mb-4 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Generate ideas, hooks, scripts, captions & content calendars for{" "}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {PLATFORMS.map((p) => (
            <span
              key={p}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
            >
              {p}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-xl text-base font-bold text-white no-underline transition-all"
            style={{
              background: "linear-gradient(135deg, var(--accent-purple), #9333ea)",
              boxShadow: "0 8px 32px rgba(124,92,252,0.4)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Start Creating Free
          </Link>
          <Link
            href="#demo"
            className="px-8 py-4 rounded-xl text-base font-semibold no-underline transition-all"
            style={{
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            ▶ Watch Demo
          </Link>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          {[
            { num: "50K+", label: "Content Creators" },
            { num: "2M+", label: "Ideas Generated" },
            { num: "98%", label: "Satisfaction Rate" },
            { num: "10x", label: "Faster Workflow" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-display font-black text-3xl mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {stat.num}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
