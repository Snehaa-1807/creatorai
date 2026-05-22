"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS: Record<string, string> = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  idea:      "M12 2a7 7 0 0 1 5 11.9V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2.1A7 7 0 0 1 12 2z M9 21h6",
  hook:      "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  script:    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  trend:     "M22 12h-4l-3 9L9 3l-3 9H2",
  calendar:  "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  saved:     "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
  settings:  "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  billing:   "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22",
};

const NAV = [
  { icon: "dashboard", label: "Dashboard",       href: "/dashboard" },
  { icon: "idea",      label: "Idea Generator",  href: "/ideas" },
  { icon: "hook",      label: "Hook Writer",      href: "/hooks" },
  { icon: "script",    label: "Script Writer",    href: "/scripts" },
  { icon: "trend",     label: "Trend Analyzer",   href: "/trends" },
  { icon: "calendar",  label: "Content Calendar", href: "/calendar" },
  { icon: "saved",     label: "Saved Library",    href: "/saved" },
];

const BOTTOM = [
  { icon: "settings", label: "Settings", href: "/settings" },
  { icon: "billing",  label: "Billing",  href: "/billing" },
];

function NavLink({ item, active }: { item: typeof NAV[0]; active: boolean }) {
  return (
    <Link
      href={item.href}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px", borderRadius: 9, fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: active ? "var(--accent-purple-light)" : "var(--text-secondary)",
        background: active ? "rgba(124,92,252,0.13)" : "transparent",
        textDecoration: "none", transition: "all 0.15s", marginBottom: 2,
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
    >
      <span style={{ width: 18, flexShrink: 0, display: "flex", opacity: active ? 1 : 0.65 }}>
        <Icon d={ICONS[item.icon]} />
      </span>
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const credits    = session?.user?.credits    ?? 0;
  const maxCredits = session?.user?.maxCredits ?? 50;
  const pct        = Math.min(100, Math.round((credits / maxCredits) * 100));
  const plan       = session?.user?.plan       ?? "free";

  return (
    <aside style={{
      width: 220, background: "var(--bg-secondary)",
      borderRight: "1px solid var(--border-subtle)",
      display: "flex", flexDirection: "column",
      padding: "16px 12px", flexShrink: 0,
      overflowY: "auto", height: "calc(100vh - 57px)",
      position: "sticky", top: 57,
    }}>
      <div style={{ marginBottom: 4 }}>
        <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", padding: "0 10px", marginBottom: 8 }}>
          Tools
        </p>
        {NAV.map((item) => <NavLink key={item.href} item={item} active={pathname === item.href} />)}
      </div>

      <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "10px 0" }} />

      <div style={{ marginBottom: 8 }}>
        {BOTTOM.map((item) => <NavLink key={item.href} item={item} active={pathname === item.href} />)}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>AI Credits</span>
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.5px",
            background: plan === "pro" ? "rgba(124,92,252,0.2)" : plan === "enterprise" ? "rgba(45,212,191,0.2)" : "rgba(255,255,255,0.06)",
            color: plan === "pro" ? "var(--accent-purple-light)" : plan === "enterprise" ? "var(--accent-teal)" : "var(--text-secondary)",
          }}>{plan}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{plan === "free" ? `${credits} of ${maxCredits}` : "Unlimited"}</span>
          {plan === "free" && <span style={{ fontSize: 11, color: pct < 20 ? "var(--accent-red)" : "var(--accent-purple-light)", fontWeight: 600 }}>{pct}%</span>}
        </div>
        {plan === "free" && (
          <>
            <div style={{ background: "var(--bg-quaternary)", borderRadius: 99, height: 5, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: pct < 20 ? "#f87171" : "linear-gradient(90deg, var(--accent-purple), var(--accent-pink))", transition: "width 0.5s" }} />
            </div>
            <Link href="/billing" style={{ display: "block", textAlign: "center", fontSize: 12, fontWeight: 700, padding: "7px", borderRadius: 8, background: "linear-gradient(135deg, var(--accent-purple), #9333ea)", color: "#fff", textDecoration: "none" }}>
              Upgrade Plan
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
