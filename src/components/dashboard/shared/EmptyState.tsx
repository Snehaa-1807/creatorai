import { HEADER_ICONS } from "./ToolPageHeader";

function Ico({ d, size = 40 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export function EmptyState({ iconName = "idea", text }: { iconName?: string; text: string }) {
  const paths = HEADER_ICONS[iconName] ?? HEADER_ICONS.idea;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", textAlign: "center" }}>
      <div style={{ opacity: 0.2, marginBottom: 14, color: "var(--text-muted)" }}>
        <Ico d={paths} size={44} />
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 260, margin: 0 }}>{text}</p>
    </div>
  );
}
