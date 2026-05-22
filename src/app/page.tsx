import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { AIDemo } from "@/components/landing/AIDemo";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar />
      <Hero />
      <Features />
      <AIDemo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
