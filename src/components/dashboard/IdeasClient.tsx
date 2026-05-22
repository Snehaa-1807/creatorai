"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { ContentIdea, Platform, Tone, ContentType } from "@/types";
import { copyToClipboard } from "@/utils";
import { ToolPageHeader } from "./shared/ToolPageHeader";
import { ResultCard } from "./shared/ResultCard";
import { EmptyState } from "./shared/EmptyState";
import { LoadingCards } from "./shared/LoadingCards";

const PLATFORMS: Platform[] = ["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter/X"];
const TONES: Tone[] = ["Educational", "Entertaining", "Inspirational", "Controversial", "Motivational", "Humorous"];
const TYPES: ContentType[] = ["Long-form", "Short/Reel", "Carousel", "Thread"];
const COUNTS = [5, 10, 20];

export function IdeasClient() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState<Platform>("YouTube");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<Tone>("Educational");
  const [contentType, setContentType] = useState<ContentType>("Long-form");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const generate = async () => {
    if (!niche.trim()) { toast.error("Please enter your content niche"); return; }
    setLoading(true);
    setIdeas([]);
    try {
      const res = await fetch("/api/generate/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, audience: audience || "General audience", tone, contentType, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setIdeas(data.ideas);
      toast.success(`Generated ${data.ideas.length} ideas!`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to generate ideas");
    } finally {
      setLoading(false);
    }
  };

  const saveIdea = async (idea: ContentIdea) => {
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "idea", title: idea.title, content: idea, platform }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved((prev) => new Set([...prev, idea.id]));
      toast.success("Saved to library!");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="p-6">
      <ToolPageHeader iconName="idea" iconBg="rgba(124,92,252,0.15)" title="AI Idea Generator" desc="Generate viral content ideas tailored to your niche and platform" />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-start">
        {/* Form */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <FormGroup label="Content Niche">
            <input className="creator-input" value={niche} onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Personal Finance, Fitness, Tech Reviews..." />
          </FormGroup>

          <FormGroup label="Platform">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={`tag-pill ${platform === p ? "selected" : ""}`}>{p}</button>
              ))}
            </div>
          </FormGroup>

          <FormGroup label="Target Audience">
            <input className="creator-input" value={audience} onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Millennials aged 25-35, Gen Z entrepreneurs..." />
          </FormGroup>

          <FormGroup label="Tone">
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button key={t} onClick={() => setTone(t)}
                  className={`tag-pill ${tone === t ? "selected" : ""}`}>{t}</button>
              ))}
            </div>
          </FormGroup>

          <FormGroup label="Content Type">
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button key={t} onClick={() => setContentType(t)}
                  className={`tag-pill ${contentType === t ? "selected" : ""}`}>{t}</button>
              ))}
            </div>
          </FormGroup>

          <FormGroup label="Number of Ideas">
            <div className="flex gap-2">
              {COUNTS.map((c) => (
                <button key={c} onClick={() => setCount(c)}
                  className={`tag-pill flex-1 justify-center ${count === c ? "selected" : ""}`}>{c} ideas</button>
              ))}
            </div>
          </FormGroup>

          <button className="btn-generate mt-2" onClick={generate} disabled={loading}>
            {loading ? <><span className="spinner" />Generating...</> : "Generate Ideas"}
          </button>
        </div>

        {/* Results */}
        <div className="p-5 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              {ideas.length > 0 ? `${ideas.length} Ideas Generated` : "Generated Ideas"}
            </h3>
            {ideas.length > 0 && (
              <div className="flex gap-2">
                <ActionBtn title="Copy all" onClick={() => { copyToClipboard(ideas.map((i) => i.title).join("\n")); toast.success("All ideas copied!"); }}>⎘</ActionBtn>
                <ActionBtn title="Regenerate" onClick={generate}>↺</ActionBtn>
              </div>
            )}
          </div>

          {loading ? <LoadingCards count={4} /> : ideas.length === 0 ? (
            <EmptyState iconName="idea" text="Fill in your details and generate viral ideas" />
          ) : (
            <div className="space-y-3">
              {ideas.map((idea, i) => (
                <ResultCard key={idea.id}>
                  <div className="text-xs font-bold mb-2" style={{ color: "var(--text-muted)" }}>
                    IDEA {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-sm font-bold mb-2 leading-snug" style={{ color: "var(--text-primary)" }}>{idea.title}</div>
                  <div className="text-xs italic mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>&ldquo;{idea.hook}&rdquo;</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tag-pill text-xs">{idea.type}</span>
                    {idea.hashtags?.map((h) => (
                      <span key={h} className="tag-pill text-xs" style={{ background: "rgba(45,212,191,0.08)", borderColor: "rgba(45,212,191,0.2)", color: "var(--accent-teal)" }}>{h}</span>
                    ))}
                    {idea.estimatedViews && (
                      <span className="text-xs ml-auto" style={{ color: "var(--accent-green)" }}>~{idea.estimatedViews}</span>
                    )}
                    <ActionBtn title="Copy" onClick={() => { copyToClipboard(idea.title); toast.success("Copied!"); }}>⎘</ActionBtn>
                    <ActionBtn title="Save" onClick={() => saveIdea(idea)} disabled={saved.has(idea.id)}>
                      {saved.has(idea.id) ? "Saved" : "Save"}
                    </ActionBtn>
                  </div>
                </ResultCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>{label}</label>
      {children}
    </div>
  );
}

function ActionBtn({ children, onClick, title, disabled }: { children: React.ReactNode; onClick?: () => void; title?: string; disabled?: boolean }) {
  return (
    <button onClick={onClick} title={title} disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all"
      style={{ background: "var(--bg-quaternary)", border: "1px solid var(--border-default)", color: "var(--text-secondary)", cursor: disabled ? "default" : "pointer" }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = "var(--accent-purple)"; e.currentTarget.style.color = "var(--accent-purple-light)"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
      {children}
    </button>
  );
}
