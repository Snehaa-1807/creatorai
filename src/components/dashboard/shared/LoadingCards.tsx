// ============================================
// Shared loading skeleton cards
// ============================================

export function LoadingCards({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 12,
            padding: 16,
            opacity: 1 - i * 0.12,
          }}
        >
          <div className="shimmer" style={{ height: 12, width: "30%", marginBottom: 10, borderRadius: 6 }} />
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

export function LoadingScript() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {["HOOK", "INTRO", "SECTION 1", "SECTION 2", "CTA"].map((label) => (
        <div
          key={label}
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: 8, fontWeight: 700 }}>
            {label}
          </div>
          <div className="shimmer" style={{ height: 13, width: "100%", marginBottom: 6, borderRadius: 6 }} />
          <div className="shimmer" style={{ height: 13, width: "85%", marginBottom: 6, borderRadius: 6 }} />
          <div className="shimmer" style={{ height: 13, width: "60%", borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );
}
