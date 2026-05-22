"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function DashboardNav() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        height: 57,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: "#fff",
            fontWeight: 800,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-manrope)",
            fontWeight: 800,
            fontSize: 16,
            color: "var(--text-primary)",
          }}
        >
          CreatorAI
        </span>
      </Link>

      {/* Center quick links */}
      <div style={{ display: "flex", gap: 2 }}>
        {[
          { label: "Ideas", href: "/ideas" },
          { label: "Hooks", href: "/hooks" },
          { label: "Scripts", href: "/scripts" },
          { label: "Trends", href: "/trends" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--text-secondary)",
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-primary)";
              (e.target as HTMLElement).style.background = "var(--bg-tertiary)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "var(--text-secondary)";
              (e.target as HTMLElement).style.background = "transparent";
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right — user menu */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
        <Link
          href="/billing"
          style={{
            fontSize: 12,
            padding: "5px 12px",
            borderRadius: 8,
            border: "1px solid rgba(124,92,252,0.35)",
            background: "rgba(124,92,252,0.1)",
            color: "var(--accent-purple-light)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Upgrade
        </Link>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            padding: "5px 10px 5px 6px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#fff",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <span style={{ fontSize: 13, color: "var(--text-primary)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {session?.user?.name ?? "User"}
          </span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>▾</span>
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: 180,
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-default)",
              borderRadius: 12,
              padding: 6,
              zIndex: 100,
              boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session?.user?.email}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, textTransform: "capitalize" }}>
                {session?.user?.plan ?? "free"} plan
              </div>
            </div>
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Settings", href: "/settings" },
              { label: "Billing", href: "/billing" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  borderRadius: 8,
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "var(--bg-quaternary)";
                  (e.target as HTMLElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "transparent";
                  (e.target as HTMLElement).style.color = "var(--text-secondary)";
                }}
              >
                {item.label}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: 4, paddingTop: 4 }}>
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "var(--accent-red)",
                  background: "none",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "var(--font-manrope)",
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
