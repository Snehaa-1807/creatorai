"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { copyToClipboard, timeAgo } from "@/utils";
import { ToolPageHeader } from "./shared/ToolPageHeader";

type SavedItem = {
  _id: string; type: string; title: string; platform?: string; createdAt: string;
  content: unknown; isFavorite: boolean;
};

const TYPE_COLORS: Record<string, { bg: string; color: string; icon: string }> = {
  idea: { bg: "rgba(124,92,252,0.15)", color: "var(--accent-purple-light)", icon: "idea" },
  hook: { bg: "rgba(244,114,182,0.15)", color: "var(--accent-pink)", icon: "hook" },
  script: { bg: "rgba(45,212,191,0.15)", color: "var(--accent-teal)", icon: "script" },
  title: { bg: "rgba(96,165,250,0.15)", color: "var(--accent-blue)", icon: "title" },
  caption: { bg: "rgba(251,191,36,0.15)", color: "var(--accent-amber)", icon: "✍️" },
  calendar: { bg: "rgba(52,211,153,0.15)", color: "var(--accent-green)", icon: "calendar" },
};

export function SavedClient() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saved");
      const data = await res.json();
      setItems(data.items || []);
    } catch { toast.error("Failed to load saved content"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const deleteItem = async (id: string) => {
    await fetch(`/api/saved/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i._id !== id));
    toast.success("Deleted");
  };

  const toggleFav = async (id: string) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;
    await fetch(`/api/saved/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !item.isFavorite }),
    });
    setItems((prev) => prev.map((i) => i._id === id ? { ...i, isFavorite: !i.isFavorite } : i));
  };

  const filtered = items.filter((i) =>
    (filter === "all" || i.type === filter) &&
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  const types = ["all", ...Array.from(new Set(items.map((i) => i.type)))];

  return (
    <div className="p-6">
      <ToolPageHeader iconName="saved" iconBg="rgba(167,139,250,0.15)" title="Content Library" desc="All your saved ideas, hooks, and scripts in one place" />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`tag-pill capitalize ${filter === t ? "selected" : ""}`}>{t}</button>
          ))}
        </div>
        <input className="creator-input ml-auto" style={{ maxWidth: "240px" }} value={search}
          onChange={(e) => setSearch(e.target.value)} placeholder="Search saved content..." />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer h-40 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div style={{ opacity: 0.2, marginBottom: 14, color: "var(--text-muted)", display: "flex", justifyContent: "center" }}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {items.length === 0 ? "No saved content yet — generate and save ideas to build your library" : "No results matching your filter"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const meta = TYPE_COLORS[item.type] ?? TYPE_COLORS.idea;
            return (
              <div key={item._id} className="p-5 rounded-2xl transition-all"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,92,252,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: meta.bg }}>{meta.icon}</div>
                  <div>
                    <span className="text-xs font-bold capitalize" style={{ color: meta.color }}>{item.type}</span>
                    {item.platform && <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>· {item.platform}</span>}
                  </div>
                  <button onClick={() => toggleFav(item._id)} className="ml-auto text-lg transition-colors"
                    style={{ color: item.isFavorite ? "var(--accent-amber)" : "var(--text-muted)" }}>★</button>
                </div>
                <h4 className="text-sm font-bold mb-2 leading-snug" style={{ color: "var(--text-primary)" }}>{item.title}</h4>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                  {typeof item.content === "string" ? item.content : JSON.stringify(item.content).slice(0, 120)}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{timeAgo(item.createdAt)}</span>
                  <div className="flex gap-1">
                    <IconBtn onClick={() => { copyToClipboard(item.title); toast.success("Copied!"); }}>⎘</IconBtn>
                    <IconBtn onClick={() => deleteItem(item._id)} danger>✕</IconBtn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, danger }: { children: React.ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors"
      style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", color: danger ? "var(--accent-red)" : "var(--text-secondary)" }}>
      {children}
    </button>
  );
}
