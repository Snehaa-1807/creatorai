"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";

function Ico({ d, size = 18, color = "currentColor" }: { d: string | string[]; size?: number; color?: string }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const TOOL_ICONS: Record<string, string[]> = {
  ideas:    ["M12 2a7 7 0 0 1 5 11.9V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2.1A7 7 0 0 1 12 2z", "M9 21h6"],
  hooks:    ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  scripts:  ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"],
  trends:   ["M22 12h-4l-3 9L9 3l-3 9H2"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  saved:    ["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],
};

const QUICK_TOOLS = [
  { iconKey: "ideas",    label: "Idea Generator",    desc: "Viral ideas in seconds",   href: "/ideas",    color: "rgba(124,92,252,0.15)",  stroke: "var(--accent-purple-light)" },
  { iconKey: "hooks",    label: "Hook Writer",        desc: "Scroll-stopping openers",  href: "/hooks",    color: "rgba(244,114,182,0.15)", stroke: "var(--accent-pink)" },
  { iconKey: "scripts",  label: "Script Writer",      desc: "Full video scripts",        href: "/scripts",  color: "rgba(45,212,191,0.15)",  stroke: "var(--accent-teal)" },
  { iconKey: "trends",   label: "Trend Analyzer",     desc: "What's viral now",          href: "/trends",   color: "rgba(251,191,36,0.15)",  stroke: "var(--accent-amber)" },
  { iconKey: "calendar", label: "Content Calendar",   desc: "Your weekly plan",          href: "/calendar", color: "rgba(52,211,153,0.15)",  stroke: "var(--accent-green)" },
  { iconKey: "saved",    label: "Saved Library",      desc: "Your content archive",      href: "/saved",    color: "rgba(167,139,250,0.15)", stroke: "var(--accent-purple-light)" },
];

const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  idea:     { bg: "rgba(124,92,252,0.15)",  color: "var(--accent-purple-light)" },
  hook:     { bg: "rgba(244,114,182,0.15)", color: "var(--accent-pink)" },
  script:   { bg: "rgba(45,212,191,0.15)",  color: "var(--accent-teal)" },
  title:    { bg: "rgba(251,191,36,0.15)",  color: "var(--accent-amber)" },
  caption:  { bg: "rgba(96,165,250,0.15)",  color: "var(--accent-blue)" },
  calendar: { bg: "rgba(52,211,153,0.15)",  color: "var(--accent-green)" },
};

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 172800) return "Yesterday";
  return `${Math.floor(s / 86400)}d ago`;
}

interface RecentItem { _id: string; type: string; prompt: string; createdAt: string; }

export function DashboardClient({ session }: { session: Session }) {
  const name       = session.user?.name?.split(" ")[0] ?? "Creator";
  const credits    = session.user?.credits    ?? 0;
  const maxCredits = session.user?.maxCredits ?? 50;
  const plan       = session.user?.plan       ?? "free";
  const hour       = new Date().getHours();
  const greeting   = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const creditPct  = Math.min(100, Math.round((credits / maxCredits) * 100));

  const [recent, setRecent]   = useState<RecentItem[]>([]);
  const [stats, setStats]     = useState({ totalGenerated: 0, totalSaved: 0, scriptsCreated: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [genRes, savedRes] = await Promise.all([
          fetch("/api/generate/recent?limit=4"),
          fetch("/api/saved?limit=1"),
        ]);
        if (genRes.ok) {
          const g = await genRes.json();
          setRecent(g.items ?? []);
          setStats((prev) => ({ ...prev, totalGenerated: g.total ?? 0, scriptsCreated: g.scriptsCount ?? 0 }));
        }
        if (savedRes.ok) {
          const s = await savedRes.json();
          setStats((prev) => ({ ...prev, totalSaved: s.total ?? 0 }));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const card = { padding: 20, borderRadius: 16, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" } as const;

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 24, color: "var(--text-primary)", marginBottom: 4 }}>
          {greeting}, {name}
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Here&apos;s your CreatorAI workspace</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Content Generated", val: loading ? "—" : stats.totalGenerated, sub: "All time" },
          { label: "Items Saved",        val: loading ? "—" : stats.totalSaved,     sub: "In library" },
          { label: "Scripts Created",    val: loading ? "—" : stats.scriptsCreated, sub: "All time" },
          { label: "AI Credits Left",    val: plan === "free" ? credits : "∞",       sub: plan === "free" ? `of ${maxCredits}` : `${plan} plan` },
        ].map((s) => (
          <div key={s.label} style={card}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            {loading && s.label !== "AI Credits Left" ? (
              <div className="shimmer" style={{ height: 32, width: "60%", borderRadius: 6, marginBottom: 8 }} />
            ) : (
              <div style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 30, color: "var(--text-primary)", marginBottom: 4 }}>{String(s.val)}</div>
            )}
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Credits bar — free only */}
      {plan === "free" && (
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Free plan — {credits} credits remaining</span>
              <span style={{ color: creditPct < 20 ? "var(--accent-red)" : "var(--accent-purple-light)", fontWeight: 700 }}>{creditPct}%</span>
            </div>
            <div style={{ background: "var(--bg-quaternary)", borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${creditPct}%`, background: creditPct < 20 ? "#f87171" : "linear-gradient(90deg,var(--accent-purple),var(--accent-pink))", transition: "width 0.5s" }} />
            </div>
          </div>
          <Link href="/billing" style={{ padding: "8px 18px", borderRadius: 9, background: "linear-gradient(135deg,var(--accent-purple),#9333ea)", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* Quick tools */}
      <h2 style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 12, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.8px" }}>Quick Access</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {QUICK_TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} style={{ ...card, textDecoration: "none", display: "block", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: tool.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Ico d={TOOL_ICONS[tool.iconKey]} size={18} color={tool.stroke} />
            </div>
            <div style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>{tool.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{tool.desc}</div>
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent generations */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Recent Generations</h3>
            <Link href="/saved" style={{ fontSize: 12, color: "var(--accent-purple-light)", textDecoration: "none" }}>View all</Link>
          </div>
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div className="shimmer" style={{ height: 11, width: "35%", borderRadius: 4, marginBottom: 6 }} />
                <div className="shimmer" style={{ height: 13, width: "90%", borderRadius: 4 }} />
              </div>
            ))
          ) : recent.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ marginBottom: 8, opacity: 0.2, display: "flex", justifyContent: "center" }}>
                <Ico d={TOOL_ICONS.ideas} size={36} color="var(--text-muted)" />
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                No generations yet.{" "}
                <Link href="/ideas" style={{ color: "var(--accent-purple-light)", textDecoration: "none", fontWeight: 600 }}>Generate your first idea</Link>
              </p>
            </div>
          ) : (
            recent.map((item, i) => {
              const style = TYPE_STYLES[item.type] ?? TYPE_STYLES.idea;
              return (
                <div key={item._id} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < recent.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 700, background: style.bg, color: style.color, textTransform: "capitalize" }}>{item.type}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(item.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                    {item.prompt}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Account overview */}
        <div style={card}>
          <h3 style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 16 }}>Your Account</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, padding: "12px 14px", borderRadius: 12, background: "var(--bg-tertiary)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent-purple),var(--accent-pink))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: "#fff", fontWeight: 800, flexShrink: 0 }}>
              {session.user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user?.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user?.email}</div>
            </div>
          </div>
          {[
            { label: "Plan", value: <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 999, background: plan === "pro" ? "rgba(124,92,252,0.2)" : "var(--bg-quaternary)", color: plan === "pro" ? "var(--accent-purple-light)" : "var(--text-secondary)", fontWeight: 700, textTransform: "capitalize" as const }}>{plan}</span> },
            { label: "AI Credits", value: <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{plan === "free" ? `${credits} / ${maxCredits}` : "Unlimited"}</span> },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{row.label}</span>
              {row.value}
            </div>
          ))}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <Link href="/settings" style={{ flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 9, fontSize: 12, fontWeight: 600, border: "1px solid var(--border-default)", color: "var(--text-secondary)", textDecoration: "none" }}>Settings</Link>
            <Link href="/billing" style={{ flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 9, fontSize: 12, fontWeight: 700, background: "linear-gradient(135deg,var(--accent-purple),#9333ea)", color: "#fff", textDecoration: "none" }}>
              {plan === "free" ? "Upgrade Plan" : "Billing"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
