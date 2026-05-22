"use client";

import { useState } from "react";
import { ToolPageHeader } from "./shared/ToolPageHeader";
import { getPlatformColor } from "@/utils";
import toast from "react-hot-toast";

const TRENDS_2026 = [
  { tag: "#AIVideoCreator",    platform: "YouTube",   views: "3.2B",  growth: 97, category: "AI Tools",      desc: "AI-generated video content is dominating feeds in 2026" },
  { tag: "#AgenticAI",         platform: "LinkedIn",  views: "1.1B",  growth: 94, category: "Tech",          desc: "Autonomous AI agents taking over workflows" },
  { tag: "#CreatorAI",         platform: "TikTok",    views: "2.8B",  growth: 92, category: "Creator",       desc: "Creators using AI tools to 10x their output" },
  { tag: "#VibeCoding",        platform: "YouTube",   views: "890M",  growth: 89, category: "Tech",          desc: "Prompt-first development replacing traditional coding" },
  { tag: "#DigitalProduct2026",platform: "Instagram", views: "1.5B",  growth: 86, category: "Business",      desc: "Digital products as primary income for creators" },
  { tag: "#MicroSaaS",         platform: "LinkedIn",  views: "640M",  growth: 83, category: "Business",      desc: "Solo founders building $10K/mo SaaS products" },
  { tag: "#ShortFormPodcast",  platform: "TikTok",    views: "2.1B",  growth: 80, category: "Audio",         desc: "Podcast clips driving massive discovery" },
  { tag: "#AIInfluencer",      platform: "Instagram", views: "1.8B",  growth: 78, category: "Creator",       desc: "AI avatars and virtual influencers going mainstream" },
  { tag: "#NoCodeAI",          platform: "YouTube",   views: "760M",  growth: 75, category: "AI Tools",      desc: "Building real products without writing a single line" },
  { tag: "#FinanceCreator",    platform: "TikTok",    views: "3.4B",  growth: 73, category: "Finance",       desc: "Personal finance content still dominates all platforms" },
  { tag: "#SlowLifestyle",     platform: "Instagram", views: "1.2B",  growth: 70, category: "Lifestyle",     desc: "Anti-hustle movement gaining massive traction" },
  { tag: "#BuildInPublic",     platform: "LinkedIn",  views: "540M",  growth: 68, category: "Business",      desc: "Sharing startup journey in real-time" },
  { tag: "#AIFitness",         platform: "YouTube",   views: "880M",  growth: 65, category: "Health",        desc: "AI-personalized fitness plans and coaching" },
  { tag: "#FutureOfWork",      platform: "LinkedIn",  views: "920M",  growth: 62, category: "Career",        desc: "Remote-first and AI-augmented work discussion" },
  { tag: "#ContentOS",         platform: "TikTok",    views: "1.4B",  growth: 60, category: "Creator",       desc: "Systems and SOPs for content creator businesses" },
  { tag: "#GenZMoney",         platform: "TikTok",    views: "2.6B",  growth: 58, category: "Finance",       desc: "Gen Z redefining wealth building on their terms" },
];

const PLATFORMS  = ["All", "YouTube", "TikTok", "Instagram", "LinkedIn"];
const CATEGORIES = ["All", "AI Tools", "Creator", "Business", "Finance", "Tech", "Lifestyle", "Health", "Career", "Audio"];

const PLATFORM_ICONS: Record<string, string> = {
  YouTube: "▶", TikTok: "♪", Instagram: "◈", LinkedIn: "in",
};

function GrowthBadge({ growth }: { growth: number }) {
  const color = growth >= 90 ? "#f87171" : growth >= 75 ? "#fbbf24" : "#34d399";
  return (
    <span style={{ fontSize: 11, fontWeight: 800, color, background: `${color}18`, padding: "2px 8px", borderRadius: 999 }}>
      ↑ {growth}%
    </span>
  );
}

export function TrendsClient() {
  const [platform, setPlatform]   = useState("All");
  const [category, setCategory]   = useState("All");
  const [search, setSearch]       = useState("");
  const [sortBy, setSortBy]       = useState<"growth" | "views">("growth");
  const [view, setView]           = useState<"grid" | "list">("grid");

  const filtered = TRENDS_2026
    .filter((t) =>
      (platform === "All" || t.platform === platform) &&
      (category === "All" || t.category === category) &&
      (t.tag.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => sortBy === "growth" ? b.growth - a.growth : parseFloat(b.views) - parseFloat(a.views));

  const topTrend = TRENDS_2026.reduce((a, b) => a.growth > b.growth ? a : b);

  return (
    <div style={{ padding: 24 }}>
      <ToolPageHeader icon="📈" iconBg="rgba(251,191,36,0.15)" title="Trend Analyzer" desc="What's exploding across platforms in 2026 — updated insights for creators" />

      {/* Top trend spotlight */}
      <div style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.12), rgba(244,114,182,0.08))", border: "1px solid rgba(124,92,252,0.25)", borderRadius: 16, padding: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ color: "var(--accent-amber)", opacity: 0.9 }}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent-purple-light)", marginBottom: 4 }}>Hottest Trend Right Now</div>
          <div style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 20, color: "var(--text-primary)", marginBottom: 4 }}>{topTrend.tag}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{topTrend.desc}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 28, color: "#f87171" }}>↑ {topTrend.growth}%</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>This week</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, alignItems: "center" }}>
        {/* Platform filter */}
        <div style={{ display: "flex", gap: 4, background: "var(--bg-tertiary)", borderRadius: 10, padding: 4 }}>
          {PLATFORMS.map((p) => (
            <button key={p} onClick={() => setPlatform(p)}
              style={{ padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "var(--font-manrope)", transition: "all 0.15s", background: platform === p ? "var(--bg-secondary)" : "transparent", color: platform === p ? "var(--accent-purple-light)" : "var(--text-secondary)", boxShadow: platform === p ? "0 1px 4px rgba(0,0,0,0.3)" : "none" }}>
              {p !== "All" ? `${PLATFORM_ICONS[p]} ` : ""}{p}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`tag-pill ${category === c ? "selected" : ""}`}
              style={{ fontSize: 11 }}>
              {c}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "growth" | "views")}
            style={{ padding: "6px 10px", borderRadius: 8, background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-manrope)" }}>
            <option value="growth">Sort: Growth %</option>
            <option value="views">Sort: Views</option>
          </select>
          <input className="creator-input" style={{ width: 190, fontSize: 12 }} value={search}
            onChange={(e) => setSearch(e.target.value)} placeholder="Search trends..." />
          {/* View toggle */}
          <div style={{ display: "flex", background: "var(--bg-tertiary)", borderRadius: 8, padding: 3, gap: 2 }}>
            {(["grid", "list"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                style={{ width: 28, height: 28, borderRadius: 6, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: view === v ? "var(--bg-secondary)" : "transparent", color: view === v ? "var(--text-primary)" : "var(--text-muted)", fontSize: 13 }}>
                {v === "grid" ? "▦" : "▤"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
        Showing <strong style={{ color: "var(--text-secondary)" }}>{filtered.length}</strong> trends
      </div>

      {/* Grid view */}
      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {filtered.map((trend) => {
            const pc = getPlatformColor(trend.platform);
            return (
              <div key={trend.tag}
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: 18, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600, background: `${pc}18`, color: pc }}>
                    {PLATFORM_ICONS[trend.platform]} {trend.platform}
                  </span>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--bg-tertiary)", color: "var(--text-muted)", fontWeight: 600 }}>{trend.category}</span>
                </div>
                <div style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)", marginBottom: 6 }}>{trend.tag}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>{trend.desc}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{trend.views} views</span>
                  <GrowthBadge growth={trend.growth} />
                </div>
                <div style={{ background: "var(--bg-quaternary)", borderRadius: 99, height: 3, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ width: `${trend.growth}%`, height: "100%", borderRadius: 99, background: "linear-gradient(90deg, var(--accent-purple), var(--accent-pink))" }} />
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(trend.tag); toast.success(`${trend.tag} copied!`); }}
                  style={{ width: "100%", padding: "7px", borderRadius: 8, border: "1px solid var(--border-default)", background: "var(--bg-tertiary)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-manrope)" }}>
                  Copy Hashtag
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((trend, i) => {
            const pc = getPlatformColor(trend.platform);
            return (
              <div key={trend.tag}
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-muted)", width: 24, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 15, color: "var(--text-primary)" }}>{trend.tag}</span>
                    <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 999, background: "var(--bg-tertiary)", color: "var(--text-muted)" }}>{trend.category}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{trend.desc}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: `${pc}18`, color: pc, fontWeight: 600 }}>
                    {PLATFORM_ICONS[trend.platform]} {trend.platform}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", width: 60, textAlign: "right" }}>{trend.views}</span>
                  <GrowthBadge growth={trend.growth} />
                  <button onClick={() => { navigator.clipboard.writeText(trend.tag); toast.success("Copied!"); }}
                    style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid var(--border-default)", background: "var(--bg-tertiary)", color: "var(--text-secondary)", fontSize: 11, cursor: "pointer" }}>
                    Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📈</div>
          <p style={{ fontSize: 14 }}>No trends match your filters. Try adjusting the platform or category.</p>
        </div>
      )}
    </div>
  );
}
