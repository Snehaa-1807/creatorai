import { ReactNode } from "react";

function Ico({ d, size = 22 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

// Icon paths keyed by name
export const HEADER_ICONS: Record<string, string[]> = {
  idea:     ["M12 2a7 7 0 0 1 5 11.9V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2.1A7 7 0 0 1 12 2z", "M9 21h6"],
  hook:     ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  script:   ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"],
  trend:    ["M22 12h-4l-3 9L9 3l-3 9H2"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  saved:    ["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],
  title:    ["M4 6h16", "M4 12h10", "M4 18h6"],
  caption:  ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
};

interface ToolPageHeaderProps {
  iconName: string;
  iconBg: string;
  iconColor?: string;
  title: string;
  desc: string;
  badge?: string;
  action?: ReactNode;
}

export function ToolPageHeader({ iconName, iconBg, iconColor = "currentColor", title, desc, badge, action }: ToolPageHeaderProps) {
  const paths = HEADER_ICONS[iconName] ?? HEADER_ICONS.idea;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
      <div style={{ width: 50, height: 50, borderRadius: 14, background: iconBg, border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: iconColor }}>
        <Ico d={paths} size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ fontFamily: "var(--font-manrope)", fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{title}</h1>
          {badge && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "rgba(45,212,191,0.15)", color: "var(--accent-teal)", fontWeight: 700, letterSpacing: "0.5px" }}>{badge}</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "3px 0 0" }}>{desc}</p>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
