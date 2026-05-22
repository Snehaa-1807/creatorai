"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { GeneratedScript, Platform, ScriptType } from "@/types";
import { copyToClipboard } from "@/utils";
import { ToolPageHeader } from "./shared/ToolPageHeader";
import { EmptyState } from "./shared/ResultCard";
import { LoadingCards } from "./shared/ResultCard";

const PLATFORMS: Platform[] = ["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter/X", "Podcast"];
const SCRIPT_TYPES: ScriptType[] = [
  "YouTube Long-form (8-12 min)",
  "YouTube Shorts (60 sec)",
  "TikTok / Reel (30-60 sec)",
  "Podcast Outline",
  "LinkedIn Article",
  "Twitter Thread",
];
const INCLUDE_OPTIONS = ["Hook", "Story", "CTA", "B-roll cues", "Timestamps", "Chapter markers"];

export function ScriptClient() {
  const [topic, setTopic] = useState("");
  const [scriptType, setScriptType] = useState<ScriptType>("YouTube Long-form (8-12 min)");
  const [platform, setPlatform] = useState<Platform>("YouTube");
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [includes, setIncludes] = useState<string[]>(["Hook", "Story", "CTA"]);
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<GeneratedScript | null>(null);

  const toggleInclude = (opt: string) =>
    setIncludes((prev) => prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]);

  const generate = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic"); return; }
    setLoading(true); setScript(null);
    try {
      const res = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, type: scriptType, platform, niche: niche || "General", audience: audience || "General audience", includeSections: includes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScript(data.script);
      toast.success("Script generated!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  };

  const fullScriptText = script ? [
    `HOOK:\n${script.hook}`,
    `INTRO:\n${script.intro}`,
    ...script.sections.map((s) => `${s.title.toUpperCase()}:\n${s.content}`),
    `CALL TO ACTION:\n${script.cta}`,
  ].join("\n\n") : "";

  return (
    <div className="p-6">
      <ToolPageHeader iconName="script" iconBg="rgba(45,212,191,0.15)" title="AI Script Writer" desc="Full scripts with hooks, storytelling, and CTA — ready to record" />
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-start">
        {/* Form */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <FG label="Script Topic / Title">
            <input className="creator-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. 5 Money Habits That Changed My Life" />
          </FG>
          <FG label="Script Type">
            <select className="creator-input" value={scriptType} onChange={(e) => setScriptType(e.target.value as ScriptType)}>
              {SCRIPT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </FG>
          <FG label="Platform">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => setPlatform(p)} className={`tag-pill ${platform === p ? "selected" : ""}`}>{p}</button>
              ))}
            </div>
          </FG>
          <FG label="Your Niche">
            <input className="creator-input" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. Personal Finance" />
          </FG>
          <FG label="Target Audience">
            <input className="creator-input" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Millennials wanting financial freedom" />
          </FG>
          <FG label="Include">
            <div className="flex flex-wrap gap-2">
              {INCLUDE_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => toggleInclude(opt)} className={`tag-pill ${includes.includes(opt) ? "selected" : ""}`}>{opt}</button>
              ))}
            </div>
          </FG>
          <button className="btn-generate mt-2" onClick={generate} disabled={loading}>
            {loading ? <><span className="spinner" />Writing Script...</> : "Generate Script"}
          </button>
        </div>

        {/* Results */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              {script ? `Script: ${topic}` : "Generated Script"}
            </h3>
            {script && (
              <div className="flex gap-2">
                <IconBtn onClick={() => { copyToClipboard(fullScriptText); toast.success("Script copied!"); }}>⎘ Copy</IconBtn>
                <IconBtn onClick={generate}>↺</IconBtn>
              </div>
            )}
          </div>

          {loading ? <LoadingCards count={3} /> : !script ? (
            <EmptyState iconName="script" text="Configure your script details and let AI do the writing" />
          ) : (
            <div className="space-y-3">
              {/* Meta */}
              <div className="flex gap-3 flex-wrap mb-2">
                {[{ l: "Type", v: script.type }, { l: "Duration", v: script.duration }, { l: "Words", v: String(script.wordCount) }].map((m) => (
                  <div key={m.l} className="px-3 py-2 rounded-lg text-xs" style={{ background: "var(--bg-tertiary)" }}>
                    <span style={{ color: "var(--text-muted)" }}>{m.l}: </span>
                    <strong style={{ color: "var(--text-primary)" }}>{m.v}</strong>
                  </div>
                ))}
              </div>
              {/* Hook */}
              <ScriptSection label="HOOK" color="var(--accent-pink)" bg="rgba(244,114,182,0.06)" borderColor="var(--accent-pink)">
                {script.hook}
              </ScriptSection>
              {/* Intro */}
              <ScriptSection label="INTRO" color="var(--text-muted)" bg="var(--bg-tertiary)" borderColor="transparent">
                {script.intro}
              </ScriptSection>
              {/* Body sections */}
              {script.sections.map((s, i) => (
                <ScriptSection key={i} label={`POINT ${i + 1}: ${s.title.toUpperCase()}`} color="var(--accent-purple-light)" bg="var(--bg-tertiary)" borderColor="transparent">
                  {s.content}
                </ScriptSection>
              ))}
              {/* CTA */}
              <ScriptSection label="CALL TO ACTION" color="var(--accent-teal)" bg="rgba(45,212,191,0.06)" borderColor="var(--accent-teal)">
                {script.cta}
              </ScriptSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScriptSection({ label, color, bg, borderColor, children }: {
  label: string; color: string; bg: string; borderColor: string; children: string;
}) {
  return (
    <div className="p-4 rounded-xl" style={{
      background: bg,
      borderLeft: borderColor !== "transparent" ? `3px solid ${borderColor}` : "none",
      borderRadius: borderColor !== "transparent" ? "0 12px 12px 0" : "12px",
    }}>
      <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color }}>{label}</div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{children}</p>
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

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-3 h-8 rounded-lg flex items-center gap-1 text-xs"
      style={{ background: "var(--bg-quaternary)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
      {children}
    </button>
  );
}
