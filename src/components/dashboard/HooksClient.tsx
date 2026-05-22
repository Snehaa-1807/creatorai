"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { ViralHook, Platform, HookStyle } from "@/types";
import { copyToClipboard } from "@/utils";
import { ToolPageHeader } from "./shared/ToolPageHeader";
import { EmptyState } from "./shared/ResultCard";
import { LoadingCards } from "./shared/ResultCard";

const PLATFORMS: Platform[] = ["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter/X"];
const STYLES: HookStyle[] = ["Curiosity Gap", "Controversy", "Story-based", "Statistic", "Challenge", "Question"];
const EMOTIONS = ["Curiosity", "FOMO", "Inspiration", "Shock", "Motivation", "Relatability"];

export function HooksClient() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("YouTube");
  const [style, setStyle] = useState<HookStyle>("Curiosity Gap");
  const [emotion, setEmotion] = useState("Curiosity");
  const [count] = useState(8);
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState<ViralHook[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const generate = async () => {
    if (!topic.trim()) { toast.error("Please enter your content topic"); return; }
    setLoading(true); setHooks([]);
    try {
      const res = await fetch("/api/generate/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, style, emotion, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHooks(data.hooks);
      toast.success(`${data.hooks.length} hooks generated!`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  };

  const saveHook = async (hook: ViralHook) => {
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "hook", title: hook.hook.slice(0, 80), content: hook, platform }),
    });
    setSaved((p) => new Set([...p, hook.id]));
    toast.success("Saved!");
  };

  return (
    <div className="p-6">
      <ToolPageHeader iconName="hook" iconBg="rgba(244,114,182,0.15)" title="Viral Hook Writer" desc="Craft scroll-stopping first lines that skyrocket your CTR" />
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-start">
        {/* Form */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <FG label="Video / Post Topic">
            <textarea className="creator-input min-h-[90px] resize-none" value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe what your content is about..." />
          </FG>
          <FG label="Platform">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={`tag-pill ${platform === p ? "selected" : ""}`}>{p}</button>
              ))}
            </div>
          </FG>
          <FG label="Hook Style">
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(s)}
                  className={`tag-pill ${style === s ? "selected" : ""}`}>{s}</button>
              ))}
            </div>
          </FG>
          <FG label="Emotion to Trigger">
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((e) => (
                <button key={e} onClick={() => setEmotion(e)}
                  className={`tag-pill ${emotion === e ? "selected" : ""}`}>{e}</button>
              ))}
            </div>
          </FG>
          <button className="btn-generate mt-2" onClick={generate} disabled={loading}>
            {loading ? <><span className="spinner" />Generating...</> : "Generate Hooks"}
          </button>
        </div>

        {/* Results */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              {hooks.length > 0 ? `${hooks.length} Hooks Generated` : "Generated Hooks"}
            </h3>
            {hooks.length > 0 && (
              <button onClick={generate} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "var(--bg-quaternary)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>↺</button>
            )}
          </div>
          {loading ? <LoadingCards count={4} /> : hooks.length === 0 ? (
            <EmptyState iconName="hook" text="Describe your topic and generate scroll-stopping hooks" />
          ) : (
            <div className="space-y-3">
              {hooks.map((hook) => (
                <div key={hook.id} className="result-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="tag-pill text-xs" style={{ background: "rgba(244,114,182,0.1)", borderColor: "rgba(244,114,182,0.2)", color: "var(--accent-pink)" }}>{hook.style}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{hook.strength}% viral strength</span>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed mb-3" style={{ color: "var(--text-primary)" }}>&ldquo;{hook.hook}&rdquo;</p>
                  <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: "var(--bg-quaternary)" }}>
                    <div className="h-full rounded-full" style={{ width: `${hook.strength}%`, background: "linear-gradient(90deg, var(--accent-pink), var(--accent-purple))" }} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <IconBtn onClick={() => { copyToClipboard(hook.hook); toast.success("Copied!"); }}>⎘</IconBtn>
                    <IconBtn onClick={() => saveHook(hook)} disabled={saved.has(hook.id)}>{saved.has(hook.id) ? "Saved" : "Save"}</IconBtn>
                  </div>
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

function IconBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
      style={{ background: "var(--bg-quaternary)", border: "1px solid var(--border-default)", color: "var(--text-secondary)", cursor: disabled ? "default" : "pointer" }}>
      {children}
    </button>
  );
}
