"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { CalendarPost, Platform } from "@/types";
import { getPlatformColor } from "@/utils";
import { ToolPageHeader } from "./shared/ToolPageHeader";

const PLATFORMS: Platform[] = ["YouTube", "TikTok", "Instagram", "LinkedIn"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarClient() {
  const [niche, setNiche] = useState("Personal Finance");
  const [platforms, setPlatforms] = useState<Platform[]>(["YouTube", "TikTok", "Instagram"]);
  const [postsPerWeek, setPostsPerWeek] = useState(10);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<CalendarPost[]>([]);

  const togglePlatform = (p: Platform) =>
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const generate = async () => {
    if (!niche.trim()) { toast.error("Enter your niche"); return; }
    setLoading(true); setPosts([]);
    try {
      const weekStart = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/generate/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platforms, postsPerWeek, weekStart }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPosts(data.calendar);
      toast.success("Calendar generated!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  };

  // Group posts by day of week
  const postsByDay: Record<number, CalendarPost[]> = {};
  posts.forEach((post) => {
    const d = new Date(post.date).getDay();
    const adjusted = d === 0 ? 6 : d - 1; // Mon=0
    if (!postsByDay[adjusted]) postsByDay[adjusted] = [];
    postsByDay[adjusted].push(post);
  });

  return (
    <div className="p-6">
      <ToolPageHeader iconName="calendar" iconBg="rgba(52,211,153,0.15)" title="Content Calendar" desc="AI-generated weekly posting strategy tailored to your niche" />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
        {/* Form */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <FG label="Your Niche">
            <input className="creator-input" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. Personal Finance" />
          </FG>
          <FG label="Platforms">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => togglePlatform(p)} className={`tag-pill ${platforms.includes(p) ? "selected" : ""}`}>{p}</button>
              ))}
            </div>
          </FG>
          <FG label={`Posts Per Week: ${postsPerWeek}`}>
            <input type="range" min={3} max={21} value={postsPerWeek} onChange={(e) => setPostsPerWeek(Number(e.target.value))}
              className="w-full accent-purple-500" />
            <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              <span>3</span><span>21</span>
            </div>
          </FG>
          <button className="btn-generate mt-2" onClick={generate} disabled={loading}>
            {loading ? <><span className="spinner" />Generating...</> : "Generate Calendar"}
          </button>

          {/* Legend */}
          <div className="mt-5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Platform Colors</div>
            {PLATFORMS.map((p) => (
              <div key={p} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: getPlatformColor(p) }} />
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              Weekly Schedule
            </h3>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{posts.length} posts planned</span>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-bold uppercase tracking-wider py-2" style={{ color: "var(--text-muted)" }}>{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          {loading ? (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="shimmer h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 14 }).map((_, i) => {
                const dayPosts = postsByDay[i % 7] || [];
                const isWeek2 = i >= 7;
                const week2Posts = isWeek2 ? (postsByDay[(i % 7) + 7] || []) : dayPosts;
                const displayPosts = isWeek2 ? week2Posts : dayPosts;
                return (
                  <div key={i} className="min-h-[90px] p-2 rounded-xl transition-all cursor-pointer"
                    style={{ background: displayPosts.length ? "var(--bg-tertiary)" : "var(--bg-primary)", border: `1px solid ${displayPosts.length ? "rgba(124,92,252,0.2)" : "var(--border-subtle)"}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = displayPosts.length ? "rgba(124,92,252,0.2)" : "var(--border-subtle)")}>
                    {displayPosts.slice(0, 2).map((post, j) => (
                      <div key={j} className="text-xs p-1 rounded mb-1 truncate leading-tight"
                        style={{ background: `${getPlatformColor(post.platform)}22`, color: getPlatformColor(post.platform), fontSize: "10px" }}>
                        {post.platform.slice(0, 2)} · {post.contentType}
                      </div>
                    ))}
                    {displayPosts.length > 2 && (
                      <div className="text-xs" style={{ color: "var(--text-muted)", fontSize: "10px" }}>+{displayPosts.length - 2} more</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Strategy metrics */}
          {posts.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-5">
              {[
                { label: "Total Posts", val: posts.length.toString() },
                { label: "YT Videos", val: posts.filter((p) => p.platform === "YouTube").length.toString() },
                { label: "Short-form", val: posts.filter((p) => p.contentType === "Short/Reel").length.toString() },
                { label: "Est. Reach", val: `${(posts.length * 4.2).toFixed(0)}K` },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-xl text-center" style={{ background: "var(--bg-tertiary)" }}>
                  <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{m.label}</div>
                  <div className="font-display font-black text-lg" style={{ color: "var(--text-primary)" }}>{m.val}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FG({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>{label}</label>
      {children}
    </div>
  );
}
