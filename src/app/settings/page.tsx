"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const PLATFORMS = ["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter/X", "Podcast"];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(({ user }) => {
        if (user) {
          setName(user.name || "");
          setNiche(user.niche || "");
          setBio(user.bio || "");
          setWebsite(user.website || "");
          setSelectedPlatforms(user.platforms || []);
        }
      })
      .finally(() => setFetching(false));
  }, []);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, niche, bio, website, platforms: selectedPlatforms }),
      });
      if (!res.ok) throw new Error("Failed");
      await update({ name });
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const panel = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-subtle)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  };

  const label = {
    display: "block" as const,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    color: "var(--text-muted)",
    marginBottom: 6,
  };

  if (fetching) {
    return (
      <div className="p-6">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer" style={{ height: 100, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-manrope)", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <div style={panel}>
        <h2 style={{ fontFamily: "var(--font-manrope)", fontSize: 15, fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>Profile</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff", fontWeight: 800, flexShrink: 0 }}>
            {name?.[0]?.toUpperCase() || session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{session?.user?.name}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{session?.user?.email}</div>
            <div style={{ fontSize: 11, marginTop: 4, padding: "2px 8px", borderRadius: 999, background: "rgba(124,92,252,0.15)", color: "var(--accent-purple-light)", display: "inline-block", textTransform: "capitalize", fontWeight: 700 }}>
              {session?.user?.plan || "free"} plan
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={label}>Full Name</label>
            <input className="creator-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label style={label}>Content Niche</label>
            <input className="creator-input" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. Personal Finance, Fitness..." />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={label}>Bio</label>
          <textarea className="creator-input" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about your content..." style={{ minHeight: 80, resize: "vertical" }} />
        </div>

        <div>
          <label style={label}>Website</label>
          <input className="creator-input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" />
        </div>
      </div>

      {/* Platforms */}
      <div style={panel}>
        <h2 style={{ fontFamily: "var(--font-manrope)", fontSize: 15, fontWeight: 700, marginBottom: 6, color: "var(--text-primary)" }}>Platforms</h2>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Select the platforms you create content for</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PLATFORMS.map((p) => (
            <button key={p} onClick={() => togglePlatform(p)}
              className={`tag-pill ${selectedPlatforms.includes(p) ? "selected" : ""}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Account */}
      <div style={panel}>
        <h2 style={{ fontFamily: "var(--font-manrope)", fontSize: 15, fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Account</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border-subtle)" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Email Address</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{session?.user?.email}</div>
          </div>
          <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, background: "rgba(52,211,153,0.12)", color: "var(--accent-teal)", fontWeight: 700 }}>Verified</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Password</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>Change your account password</div>
          </div>
          <button style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border-default)", background: "var(--bg-tertiary)", color: "var(--text-primary)", cursor: "pointer" }}>
            Change Password
          </button>
        </div>
      </div>

      {/* Save */}
      <button className="btn-generate" style={{ maxWidth: 200 }} onClick={save} disabled={loading}>
        {loading ? <><span className="spinner" /> Saving...</> : "Save Changes"}
      </button>
    </div>
  );
}
