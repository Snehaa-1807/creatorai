"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const PLANS = [
  {
    name: "Free", price: "₹0", priceUSD: "$0", period: "forever",
    description: "Perfect for getting started",
    credits: 50, razorpayAmount: 0,
    features: ["50 AI credits/month", "Idea Generator", "Hook Writer", "Script Writer (3/month)", "Basic Saved Library", "Community support"],
    missing: ["Content Calendar", "Trend Analyzer", "Unlimited generations", "Priority support"],
    popular: false,
  },
  {
    name: "Pro", price: "₹2,399", priceUSD: "$29", period: "/month",
    description: "For serious content creators",
    credits: 1000, razorpayAmount: 239900,
    features: ["1,000 AI credits/month", "All AI tools unlocked", "Content Calendar", "Trend Analyzer", "Unlimited Saved Library", "Priority support", "Export all formats", "Early access to new features"],
    missing: [],
    popular: true,
  },
  {
    name: "Enterprise", price: "₹7,999", priceUSD: "$99", period: "/month",
    description: "For teams and agencies",
    credits: -1, razorpayAmount: 799900,
    features: ["Unlimited AI credits", "Everything in Pro", "Team (5 seats)", "API access", "Custom AI tuning", "Dedicated account manager", "SLA guarantee", "White-label option"],
    missing: [],
    popular: false,
  },
];

const FAQS = [
  { q: "What are AI credits and how do they work?", a: "Each AI generation uses credits from your monthly allowance. Idea generation costs 2 credits, hooks cost 1, scripts cost 5, and calendar generation costs 3. Your credits reset on the 1st of every month." },
  { q: "Can I cancel my subscription anytime?", a: "Yes — you can cancel anytime from this page. Your subscription stays active until the end of your billing period with no further charges." },
  { q: "Is Razorpay payment secure?", a: "All payments are processed through Razorpay, which is PCI-DSS compliant and uses bank-grade 256-bit SSL encryption. We never store your card details." },
  { q: "Do you support UPI and Indian payment methods?", a: "Yes! You can pay with UPI (PhonePe, GPay, Paytm), all major credit and debit cards (Visa, Mastercard, RuPay), net banking, and EMI options." },
  { q: "What happens when I run out of credits?", a: "On the Free plan, you wait until next month's reset or upgrade to Pro. Pro users get 1,000 credits monthly and Enterprise is unlimited." },
  { q: "Can I switch plans mid-month?", a: "Yes. Upgrading gives immediate access to all features. Billing is prorated for the remaining days in your cycle." },
  { q: "Is there a free trial for Pro?", a: "The Free plan acts as a permanent trial with 50 credits. No time limit, no credit card required." },
  { q: "Do unused credits carry over?", a: "Credits reset each billing cycle. Enterprise customers can request custom rollover arrangements." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16, fontFamily: "var(--font-manrope)" }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5 }}>{q}</span>
        <span style={{ width: 24, height: 24, borderRadius: "50%", background: open ? "rgba(124,92,252,0.2)" : "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, color: open ? "var(--accent-purple-light)" : "var(--text-muted)", transition: "all 0.25s", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
          +
        </span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.2s ease", opacity: open ? 1 : 0 }}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, paddingBottom: 16, margin: 0 }}>{a}</p>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const { data: session } = useSession();
  const plan       = session?.user?.plan     || "free";
  const credits    = session?.user?.credits  ?? 0;
  const maxCredits = session?.user?.maxCredits ?? 50;
  const pct        = Math.min(100, Math.round((credits / maxCredits) * 100));
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const handleRazorpay = async (planName: string, amount: number) => {
    if (planName === "Enterprise") {
      toast("Contact us at hello@creatorai.co for Enterprise pricing");
      return;
    }

    // Use key from env — if not set, show setup instructions (don't block)
    const activeKey = RAZORPAY_KEY && RAZORPAY_KEY.trim() !== "" && RAZORPAY_KEY !== "rzp_test_YourKeyHere"
      ? RAZORPAY_KEY
      : null;

    if (!activeKey) {
      toast.error("Add NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx to .env.local then restart", { duration: 5000 });
      return;
    }

    setLoadingPlan(planName);
    try {
      // Load Razorpay SDK if not already loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
          document.body.appendChild(script);
        });
      }

      const rzp = new window.Razorpay({
        key: activeKey,
        amount,            // in paise — ₹2399 = 239900
        currency: "INR",
        name: "CreatorAI",
        description: `${planName} Plan – Monthly`,
        prefill: {
          name:  session?.user?.name  || "",
          email: session?.user?.email || "",
        },
        theme: { color: "#7c5cfc" },
        handler: async (response: Record<string, string>) => {
          console.log("Razorpay payment success:", response);
          // TODO: verify payment on backend
          // await fetch("/api/subscription/verify", { method: "POST", body: JSON.stringify(response) });
          toast.success(`Upgraded to ${planName}! Refreshing...`);
          setTimeout(() => window.location.reload(), 1500);
        },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
            toast("Payment cancelled");
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      toast.error("Could not open payment. Check your Razorpay key.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const panelStyle = { background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: 24, marginBottom: 20 } as const;

  return (
    <div style={{ padding: 24, maxWidth: 1000 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-manrope)", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Billing & Plans</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Manage your subscription and AI credits. Pay securely via Razorpay.</p>
      </div>

      {/* Key not configured warning */}
      {(!RAZORPAY_KEY || RAZORPAY_KEY === "rzp_test_YourKeyHere") && (
        <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "12px 18px", marginBottom: 20, fontSize: 13, color: "var(--accent-amber)", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Add <code style={{ background: "rgba(251,191,36,0.15)", padding: "1px 6px", borderRadius: 4 }}>NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx</code> to your <code style={{ background: "rgba(251,191,36,0.15)", padding: "1px 6px", borderRadius: 4 }}>.env.local</code> to enable payments
        </div>
      )}

      {/* Current usage */}
      <div style={panelStyle}>
        <h2 style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 13, marginBottom: 16, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Current Usage</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { label: "Plan",         value: plan,                                              highlight: true },
            { label: "AI Credits",   value: plan === "free" ? `${credits} / ${maxCredits}` : "Unlimited" },
            { label: "Renewal",      value: plan === "free" ? "No renewal" : "Monthly" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--bg-tertiary)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-manrope)", textTransform: "capitalize", color: s.highlight ? "var(--accent-purple-light)" : "var(--text-primary)" }}>{s.value}</div>
            </div>
          ))}
        </div>
        {plan === "free" && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
              <span>Credit usage</span>
              <span style={{ color: pct > 70 ? "var(--accent-red)" : "var(--text-secondary)" }}>{pct}% used</span>
            </div>
            <div style={{ background: "var(--bg-quaternary)", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: pct > 70 ? "linear-gradient(90deg,#f87171,#fbbf24)" : "linear-gradient(90deg,var(--accent-purple),var(--accent-pink))", transition: "width 0.5s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Plans */}
      <h2 style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 13, marginBottom: 16, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Choose Your Plan</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        {PLANS.map((p) => {
          const isCurrent = p.name.toLowerCase() === plan;
          return (
            <div key={p.name} style={{ background: p.popular ? "linear-gradient(180deg,rgba(124,92,252,0.07) 0%,var(--bg-secondary) 100%)" : "var(--bg-secondary)", border: `1px solid ${p.popular ? "rgba(124,92,252,0.45)" : "var(--border-subtle)"}`, borderRadius: 20, padding: 24, position: "relative" }}>
              {p.popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,var(--accent-purple),#9333ea)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 16px", borderRadius: 999, whiteSpace: "nowrap" }}>
                  Most Popular
                </div>
              )}
              <div style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 16, marginBottom: 4, color: "var(--text-primary)" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>{p.description}</div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-manrope)", fontSize: 32, fontWeight: 800, color: "var(--text-primary)" }}>{p.price}</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{p.period}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 20 }}>
                {p.priceUSD} USD · {p.credits === -1 ? "Unlimited credits" : `${p.credits} credits/month`}
              </div>
              <ul style={{ listStyle: "none", marginBottom: 24, padding: 0 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ fontSize: 13, padding: "6px 0", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: 8, borderBottom: "1px solid var(--border-subtle)" }}>
                    <span style={{ color: "var(--accent-teal)", fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
                {p.missing.map((f) => (
                  <li key={f} style={{ fontSize: 13, padding: "6px 0", color: "var(--text-muted)", display: "flex", gap: 8, borderBottom: "1px solid var(--border-subtle)", textDecoration: "line-through" }}>
                    <span style={{ opacity: 0.4, flexShrink: 0 }}>✕</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !isCurrent && p.razorpayAmount > 0 && handleRazorpay(p.name, p.razorpayAmount)}
                disabled={isCurrent || loadingPlan === p.name || (p.name === "Free")}
style={{
  width: "100%",
  padding: "11px 16px",
  borderRadius: 10,
  cursor: isCurrent || p.name === "Free" ? "default" : "pointer",
  fontSize: 13,
  fontWeight: 700,
  fontFamily: "var(--font-manrope)",
  background: isCurrent
    ? "var(--bg-quaternary)"
    : p.popular
    ? "linear-gradient(135deg,var(--accent-purple),#9333ea)"
    : "var(--bg-tertiary)",
  color: isCurrent
    ? "var(--text-muted)"
    : p.popular
    ? "#fff"
    : "var(--text-primary)",
  border:
    !isCurrent && !p.popular
      ? "1px solid var(--border-default)"
      : "none",
  opacity: loadingPlan === p.name ? 0.7 : 1,
  transition: "all 0.2s",
}}              >
                {loadingPlan === p.name ? "Opening..." : isCurrent ? "Current Plan ✓" : p.name === "Free" ? "Free Forever" : p.name === "Enterprise" ? "Contact Sales" : "Pay with Razorpay"}
              </button>
              {!isCurrent && p.razorpayAmount > 0 && (
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "var(--text-muted)" }}>
                  UPI · Cards · Net Banking · EMI
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Setup guide if key missing */}
      {(!RAZORPAY_KEY || RAZORPAY_KEY === "rzp_test_YourKeyHere") && (
        <div style={{ ...panelStyle, border: "1px solid rgba(124,92,252,0.25)" }}>
          <h3 style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 14 }}>How to enable Razorpay payments</h3>
          {[
            { step: "1", text: "Sign up at dashboard.razorpay.com (free)", link: "https://dashboard.razorpay.com" },
            { step: "2", text: "Go to Settings → API Keys → Generate Test Key" },
            { step: "3", text: 'Add to .env.local: NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx' },
            { step: "4", text: "Restart dev server: npm run dev" },
          ].map((s) => (
            <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(124,92,252,0.2)", color: "var(--accent-purple-light)", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {s.text}
                {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-purple-light)", textDecoration: "none", marginLeft: 6 }}>→ Open</a>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Razorpay badge */}
      <div style={{ ...panelStyle }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#3395FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Secured by Razorpay</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>PCI-DSS compliant · 256-bit SSL · Supports UPI, Cards, Net Banking, Wallets & EMI</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["UPI", "Visa", "Mastercard", "RuPay", "EMI"].map((m) => (
              <span key={m} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontWeight: 600 }}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ ...panelStyle, padding: "4px 24px 8px" }}>
        <h2 style={{ fontFamily: "var(--font-manrope)", fontWeight: 700, fontSize: 13, padding: "18px 0 4px", color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Frequently Asked Questions</h2>
        {FAQS.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
      </div>

      {/* Enterprise CTA */}
      <div style={{ marginTop: 20, background: "linear-gradient(135deg,rgba(124,92,252,0.1),rgba(45,212,191,0.06))", border: "1px solid rgba(124,92,252,0.2)", borderRadius: 16, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--font-manrope)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>Need a custom plan?</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>For agencies, large teams, or custom AI model training — let&apos;s talk.</div>
        </div>
        <Link href="mailto:hello@creatorai.co" style={{ padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg,var(--accent-purple),#9333ea)", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          Contact Sales
        </Link>
      </div>
    </div>
  );
}