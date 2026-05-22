"use client";

import Link from "next/link";
import { useState } from "react";

// SVG icon paths for feature cards
const FEAT_ICONS: Record<string, string[]> = {
  idea:     ["M12 2a7 7 0 0 1 5 11.9V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2.1A7 7 0 0 1 12 2z", "M9 21h6"],
  hook:     ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  script:   ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"],
  trend:    ["M22 12h-4l-3 9L9 3l-3 9H2"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  title:    ["M4 6h16", "M4 12h10", "M4 18h6"],
  caption:  ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  saved:    ["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],
};
function FeatIcon({ name, color }: { name: string; color: string }) {
  const paths = FEAT_ICONS[name] ?? FEAT_ICONS.idea;
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}


// ---- FEATURES ----
const FEATURES = [
  { icon: "idea", title: "AI Idea Generator", desc: "Generate 10–20 viral content ideas per run, tailored to your niche, platform, and audience.", color: "rgba(124,92,252,0.15)", href: "/ideas" },
  { icon: "hook", title: "Viral Hook Writer", desc: "Craft scroll-stopping openers with curiosity gaps, story hooks, statistics, and controversies.", color: "rgba(244,114,182,0.15)", href: "/hooks" },
  { icon: "script", title: "Script Generator", desc: "Full YouTube scripts, Shorts, podcast outlines, and LinkedIn posts with storytelling structure.", color: "rgba(45,212,191,0.15)", href: "/scripts" },
  { icon: "trend", title: "Trend Analyzer", desc: "Real-time trending hashtags, viral topics, and keyword opportunities across all platforms.", color: "rgba(251,191,36,0.15)", href: "/trends" },
  { icon: "calendar", title: "Content Calendar", desc: "AI-generated weekly posting strategy with platform-specific timing and frequency.", color: "rgba(52,211,153,0.15)", href: "/calendar" },
  { icon: "title", title: "SEO Title Generator", desc: "A/B tested, keyword-rich titles optimized for search and maximum click-through rates.", color: "rgba(96,165,250,0.15)", href: "/scripts" },
  { icon: "caption", title: "Content Repurposing", desc: "Turn YouTube videos into Shorts, blogs into Twitter threads, podcasts into LinkedIn posts.", color: "rgba(248,113,113,0.15)", href: "/scripts" },
  { icon: "saved", title: "Content Library", desc: "Save, organize, edit, and export all your AI-generated content in one searchable library.", color: "rgba(167,139,250,0.15)", href: "/saved" },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent-purple-light)" }}>
          Everything You Need
        </p>
        <h2 className="font-display font-black text-center mb-4" style={{ fontSize: "clamp(28px,4vw,52px)", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          One Platform. <span className="gradient-text-brand">Infinite Content.</span>
        </h2>
        <p className="text-center max-w-xl mx-auto mb-14 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          From viral idea to published post — CreatorAI handles every step of your content workflow, powered by Groq AI.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="block p-6 rounded-2xl no-underline transition-all group"
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: f.color }}>
                <FeatIcon name={f.icon} color="currentColor" />
              </div>
              <h3 className="font-display font-bold text-sm mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- AI DEMO ----
export function AIDemo() {
  const [niche, setNiche] = useState("personal finance for millennials");
  const [platform, setPlatform] = useState("YouTube");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<Array<{ title: string; type: string; hook: string }>>([]);
  const [error, setError] = useState("");

  const runDemo = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    setError("");
    setIdeas([]);
    try {
      const res = await fetch("/api/generate/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, audience: "General audience", tone: "Educational", contentType: "Long-form", count: 4 }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setIdeas(data.ideas || []);
    } catch {
      setError("Generation failed. Check your API key in .env.local");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="demo" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent-purple-light)" }}>
          Live Demo
        </p>
        <h2 className="font-display font-black text-center mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          Watch the AI <span className="gradient-text-brand">Work for You</span>
        </h2>
        <p className="text-center mb-10" style={{ color: "var(--text-secondary)" }}>
          Powered by Groq — the world&apos;s fastest AI inference. Results in under 3 seconds.
        </p>
        <div className="p-6 rounded-2xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}>
          <div className="flex gap-3 mb-4 flex-wrap">
            <input
              className="creator-input flex-1 min-w-[200px]"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Enter your content niche..."
            />
            <select className="creator-input w-36" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter/X"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <button className="btn-generate" onClick={runDemo} disabled={loading}>
            {loading ? <><span className="spinner" /> Generating with Groq...</> : "Generate Ideas"}
          </button>

          {error && (
            <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--accent-red)" }}>
              {error}
            </div>
          )}

          {ideas.length > 0 && (
            <div className="mt-4 space-y-3">
              {ideas.map((idea, i) => (
                <div key={i} className="result-card">
                  <div className="text-xs mb-2 font-bold" style={{ color: "var(--text-muted)" }}>IDEA {String(i + 1).padStart(2, "0")}</div>
                  <div className="text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>{idea.title}</div>
                  <div className="text-xs italic" style={{ color: "var(--text-secondary)" }}>&ldquo;{idea.hook}&rdquo;</div>
                  <div className="mt-2">
                    <span className="tag-pill text-xs">{idea.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---- TESTIMONIALS ----
const TESTIMONIALS = [
  { name: "Alex Rivera", handle: "@alexcreates", avatar: "AR", role: "1.2M YouTube subscribers", text: "CreatorAI cut my content planning time from 6 hours to 20 minutes. The hooks it generates are genuinely better than what I write myself.", platform: "YouTube" },
  { name: "Sarah Kim", handle: "@sarahktok", avatar: "SK", role: "800K TikTok followers", text: "I went from 3 posts/week to 15 posts/week without burning out. The AI understands viral content better than most humans I know.", platform: "TikTok" },
  { name: "Marcus Johnson", handle: "@marcusbiz", avatar: "MJ", role: "LinkedIn Top Voice", text: "My LinkedIn engagement tripled in 30 days using CreatorAI's content calendar and hook generator. Absolute game-changer.", platform: "LinkedIn" },
  { name: "Priya Patel", handle: "@priyafit", avatar: "PP", role: "500K Instagram followers", text: "The content repurposing tool alone is worth 10x the subscription price. I turn one YouTube video into 20 pieces of content.", platform: "Instagram" },
  { name: "Tom Chen", handle: "@tomtech", avatar: "TC", role: "Tech Creator", text: "Groq-powered generation is insanely fast. I get 20 viral ideas in under 5 seconds. The scripts are production-ready.", platform: "YouTube" },
  { name: "Jasmine Wu", handle: "@jasminefinance", avatar: "JW", role: "200K YouTube subscribers", text: "CreatorAI helped me find my niche within my niche. The trend analyzer showed me gaps no one else was covering.", platform: "YouTube" },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent-purple-light)" }}>
          Loved by Creators
        </p>
        <h2 className="font-display font-black text-center mb-14" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          50,000+ Creators <span className="gradient-text-brand">Trust CreatorAI</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.handle} className="p-6 rounded-2xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))" }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</div>
                </div>
                <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>{t.platform}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>&ldquo;{t.text}&rdquo;</p>
              <div className="mt-3 flex gap-1">{"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "var(--accent-amber)" }}>{s}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- PRICING ----
const PLANS = [
  {
    name: "Free", price: "$0", period: "forever", badge: null,
    features: ["20 AI generations/month", "3 AI tools", "Basic content library", "Community support"],
    cta: "Get Started Free", href: "/signup", ghost: true,
  },
  {
    name: "Pro", price: "$29", period: "/month", badge: "⭐ Most Popular",
    features: ["Unlimited generations", "All 8 AI tools", "Content calendar", "Trend analyzer", "Priority support", "Export all formats", "Groq ultra-fast mode"],
    cta: "Start Pro Trial", href: "/signup?plan=pro", ghost: false,
  },
  {
    name: "Enterprise", price: "$99", period: "/month", badge: null,
    features: ["Everything in Pro", "Team collaboration", "API access", "Custom AI prompts", "Dedicated CSM", "SLA guarantee", "White-label option"],
    cta: "Contact Sales", href: "mailto:sales@creatorai.com", ghost: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent-purple-light)" }}>Pricing</p>
        <h2 className="font-display font-black text-center mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          Simple, <span className="gradient-text-brand">Transparent</span> Pricing
        </h2>
        <p className="text-center mb-14" style={{ color: "var(--text-secondary)" }}>
          Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="relative p-7 rounded-2xl"
              style={{
                background: plan.badge ? "linear-gradient(135deg, rgba(124,92,252,0.08), var(--bg-secondary))" : "var(--bg-secondary)",
                border: plan.badge ? "1px solid rgba(124,92,252,0.4)" : "1px solid var(--border-subtle)",
              }}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, var(--accent-purple), #9333ea)" }}>
                  {plan.badge}
                </div>
              )}
              <div className="font-display font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{plan.name}</div>
              <div className="font-display font-black text-4xl mb-1" style={{ color: "var(--text-primary)" }}>
                {plan.price}<span className="text-base font-normal" style={{ color: "var(--text-secondary)" }}>{plan.period}</span>
              </div>
              <ul className="mt-5 mb-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--accent-teal)" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className="block text-center py-3 rounded-xl text-sm font-bold no-underline transition-all"
                style={plan.ghost ? {
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                } : {
                  background: "linear-gradient(135deg, var(--accent-purple), #9333ea)",
                  color: "#fff",
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- FAQ ----
const FAQS = [
  { q: "What AI model does CreatorAI use?", a: "CreatorAI is powered by Groq's ultra-fast inference with Llama 3.3 70B — delivering AI responses in under 2 seconds, 10x faster than traditional GPT-4 setups." },
  { q: "How many credits does each action cost?", a: "Idea generation costs 2 credits per run, hooks 1 credit, scripts 5 credits, and captions 1 credit. Free plan includes 50 credits/month. Pro plan includes 1,000 credits/month." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, absolutely. You can cancel from your billing settings at any time and retain access until the end of your billing period." },
  { q: "Does CreatorAI support all social platforms?", a: "Yes! We support YouTube, TikTok, Instagram, LinkedIn, Twitter/X, and Podcasts, with platform-specific optimization for each." },
  { q: "Is my content private and secure?", a: "Yes. Your generated content is private to your account. We never train our models on your personal content." },
  { q: "Can I export my content?", a: "Pro and Enterprise users can export content as plain text, Markdown, or copy to clipboard. More export formats coming soon." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 px-6" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display font-black text-center mb-14" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          Frequently Asked <span className="gradient-text-brand">Questions</span>
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
              <button
                className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold"
                style={{ background: open === i ? "var(--bg-tertiary)" : "var(--bg-primary)", color: "var(--text-primary)" }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <span style={{ color: "var(--accent-purple-light)", transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm leading-relaxed" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- FOOTER ----
export function Footer() {
  return (
    <footer className="py-16 px-6" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--accent-purple), var(--accent-pink))" }}></div>
              <span className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>CreatorAI</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              The AI co-pilot built for modern content creators. Go from idea to viral post in minutes.
            </p>
            <div className="flex gap-3">
              {["X", "IG", "YT", "LI"].map((icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
                  style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {[
            { heading: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
            { heading: "Tools", links: ["Idea Generator", "Hook Writer", "Script Writer", "Trend Analyzer"] },
            { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          ].map((col) => (
            <div key={col.heading}>
              <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>{col.heading}</div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-sm no-underline transition-colors" style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-xs gap-3"
          style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
          <span>© 2025 CreatorAI. All rights reserved.</span>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="no-underline" style={{ color: "var(--text-muted)" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
