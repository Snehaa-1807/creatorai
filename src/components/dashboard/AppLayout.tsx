"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

// ─── SVG Icons ──────────────────────────────────────────────
function Ico({ d, size = 16 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const I = {
  dashboard:  ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  idea:       ["M12 2a7 7 0 0 1 5 11.9V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2.1A7 7 0 0 1 12 2z", "M9 21h6"],
  hook:       ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  script:     ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
  trend:      ["M22 12h-4l-3 9L9 3l-3 9H2"],
  calendar:   ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  saved:      ["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],
  settings:   ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  billing:    ["M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z", "M1 10h22"],
  logout:     ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  menu:       ["M3 12h18", "M3 6h18", "M3 18h18"],
  close:      ["M18 6L6 18", "M6 6l12 12"],
  spark:      ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
};

const NAV = [
  { key: "dashboard", label: "Dashboard",       href: "/dashboard" },
  { key: "idea",      label: "Idea Generator",  href: "/ideas" },
  { key: "hook",      label: "Hook Writer",      href: "/hooks" },
  { key: "script",    label: "Script Writer",    href: "/scripts" },
  { key: "trend",     label: "Trend Analyzer",   href: "/trends" },
  { key: "calendar",  label: "Content Calendar", href: "/calendar" },
  { key: "saved",     label: "Saved Library",    href: "/saved" },
] as const;

const BOTTOM = [
  { key: "settings", label: "Settings", href: "/settings" },
  { key: "billing",  label: "Billing",  href: "/billing" },
] as const;

function SidebarLink({ href, iconKey, label, active }: {
  href: string; iconKey: keyof typeof I; label: string; active: boolean;
}) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 10px", borderRadius: 9, fontSize: 13,
      fontWeight: active ? 600 : 400,
      color: active ? "var(--accent-purple-light)" : "var(--text-secondary)",
      background: active ? "rgba(124,92,252,0.12)" : "transparent",
      textDecoration: "none", transition: "all 0.15s", marginBottom: 1,
    }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
    >
      <span style={{ width: 18, flexShrink: 0, display: "flex", opacity: active ? 1 : 0.6 }}>
        <Ico d={I[iconKey]} />
      </span>
      {label}
    </Link>
  );
}

// ─── Topbar ─────────────────────────────────────────────────
function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();
  const [userOpen, setUserOpen] = useState(false);
  const plan = session?.user?.plan ?? "free";

  return (
    <header style={{
      height: 57, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 20px",
      background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-subtle)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      {/* Left: mobile menu + logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onMenuClick}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", padding: 4 }}>
          <Ico d={I.menu} size={18} />
        </button>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,var(--accent-purple),var(--accent-pink))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico d={I.spark} size={14} />
          </div>
          <span style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>CreatorAI</span>
        </Link>
      </div>

      {/* Center quick links */}
      <div style={{ display: "flex", gap: 2 }}>
        {[{ label: "Ideas", href: "/ideas" }, { label: "Hooks", href: "/hooks" }, { label: "Scripts", href: "/scripts" }, { label: "Trends", href: "/trends" }].map((l) => (
          <Link key={l.href} href={l.href} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right: upgrade + user */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
        {plan === "free" && (
          <Link href="/billing" style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(124,92,252,0.12)", color: "var(--accent-purple-light)", border: "1px solid rgba(124,92,252,0.3)", textDecoration: "none" }}>
            Upgrade
          </Link>
        )}
        <button onClick={() => setUserOpen((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "5px 10px 5px 6px", cursor: "pointer" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent-purple),var(--accent-pink))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 800, flexShrink: 0 }}>
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <span style={{ fontSize: 13, color: "var(--text-primary)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {session?.user?.name ?? "Creator"}
          </span>
        </button>

        {userOpen && (
          <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 190, background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", borderRadius: 14, padding: 6, zIndex: 200, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session?.user?.email}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, textTransform: "capitalize" }}>{plan} plan</div>
            </div>
            {[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings", href: "/settings" }, { label: "Billing", href: "/billing" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setUserOpen(false)}
                style={{ display: "block", padding: "8px 12px", fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", borderRadius: 8 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-quaternary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                {item.label}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: 4, paddingTop: 4 }}>
              <button onClick={() => { setUserOpen(false); signOut({ callbackUrl: "/" }); }}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", fontSize: 13, color: "var(--accent-red)", background: "none", border: "none", cursor: "pointer", borderRadius: 8, fontFamily: "var(--font-manrope)" }}>
                <Ico d={I.logout} size={14} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Main Layout ─────────────────────────────────────────────
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const credits    = session?.user?.credits    ?? 0;
  const maxCredits = session?.user?.maxCredits ?? 50;
  const plan       = session?.user?.plan       ?? "free";
  const pct        = Math.min(100, Math.round((credits / maxCredits) * 100));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Topbar onMenuClick={() => setSidebarOpen((v) => !v)} />

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? 224 : 0,
          overflow: "hidden",
          transition: "width 0.25s ease",
          flexShrink: 0,
          background: "var(--bg-secondary)",
          borderRight: sidebarOpen ? "1px solid var(--border-subtle)" : "none",
          height: "calc(100vh - 57px)",
          position: "sticky",
          top: 57,
          display: "flex",
          flexDirection: "column",
          padding: sidebarOpen ? "16px 12px" : 0,
        }}>
          {/* Tools */}
          <div style={{ marginBottom: 4 }}>
            <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", padding: "0 10px", marginBottom: 8, whiteSpace: "nowrap" }}>
              Tools
            </p>
            {NAV.map((item) => (
              <SidebarLink key={item.href} href={item.href} iconKey={item.key} label={item.label} active={pathname === item.href} />
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "10px 0" }} />

          {/* Account */}
          <div>
            {BOTTOM.map((item) => (
              <SidebarLink key={item.href} href={item.href} iconKey={item.key} label={item.label} active={pathname === item.href} />
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Credits widget */}
          <div style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 14, whiteSpace: "nowrap" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>AI Credits</span>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, fontWeight: 700, textTransform: "uppercase", background: plan === "pro" ? "rgba(124,92,252,0.2)" : "rgba(255,255,255,0.06)", color: plan === "pro" ? "var(--accent-purple-light)" : "var(--text-secondary)" }}>
                {plan}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{plan === "free" ? `${credits} of ${maxCredits}` : "Unlimited"}</span>
              {plan === "free" && <span style={{ fontSize: 11, color: pct < 20 ? "var(--accent-red)" : "var(--accent-purple-light)", fontWeight: 600 }}>{pct}%</span>}
            </div>
            {plan === "free" && (
              <>
                <div style={{ background: "var(--bg-quaternary)", borderRadius: 99, height: 5, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: pct < 20 ? "#f87171" : "linear-gradient(90deg,var(--accent-purple),var(--accent-pink))", transition: "width 0.5s" }} />
                </div>
                <Link href="/billing" style={{ display: "block", textAlign: "center", fontSize: 12, fontWeight: 700, padding: "7px", borderRadius: 8, background: "linear-gradient(135deg,var(--accent-purple),#9333ea)", color: "#fff", textDecoration: "none" }}>
                  Upgrade Plan
                </Link>
              </>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowX: "hidden", minHeight: "calc(100vh - 57px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
