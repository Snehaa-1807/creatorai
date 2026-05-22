import React from "react";
import { HEADER_ICONS } from "./ToolPageHeader";

// ---- ResultCard ----
export function ResultCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="result-card">
      {children}
    </div>
  );
}

// ---- EmptyState ---- (supports both old icon string and new iconName key)
function Ico({ d, size = 40 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export function EmptyState({
  icon,
  iconName,
  text,
}: {
  icon?: string;
  iconName?: string;
  text: string;
}) {
  const key = iconName || icon || "idea";
  const paths = HEADER_ICONS[key] ?? HEADER_ICONS["idea"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", textAlign: "center" }}>
      <div style={{ opacity: 0.18, marginBottom: 14, color: "var(--text-muted)" }}>
        <Ico d={paths} size={44} />
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 260, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

// ---- LoadingCards ----
export function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 16, opacity: 1 - i * 0.12 }}>
          <div className="shimmer" style={{ height: 11, width: "30%", marginBottom: 10, borderRadius: 6 }} />
          <div className="shimmer" style={{ height: 16, width: "90%", marginBottom: 8, borderRadius: 6 }} />
          <div className="shimmer" style={{ height: 13, width: "70%", marginBottom: 12, borderRadius: 6 }} />
          <div style={{ display: "flex", gap: 6 }}>
            <div className="shimmer" style={{ height: 20, width: 60, borderRadius: 999 }} />
            <div className="shimmer" style={{ height: 20, width: 60, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
