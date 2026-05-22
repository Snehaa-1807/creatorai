"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "none",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 no-underline">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <span className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>
          CreatorAI
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        {[
          { label: "Features", href: "#features" },
          { label: "Demo", href: "#demo" },
          { label: "Pricing", href: "/pricing" },
          { label: "Blog", href: "#" },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="px-4 py-2 rounded-lg text-sm transition-colors no-underline"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-tertiary)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3">
        {session ? (
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white no-underline"
            style={{ background: "linear-gradient(135deg, var(--accent-purple), #9333ea)" }}
          >
            Dashboard →
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm no-underline transition-colors"
              style={{ color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white no-underline"
              style={{ background: "linear-gradient(135deg, var(--accent-purple), #9333ea)" }}
            >
              Start Free →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
