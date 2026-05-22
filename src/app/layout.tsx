import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/shared/Providers";
import { Toaster } from "react-hot-toast";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "CreatorAI – AI Co-Pilot for Content Creators", template: "%s | CreatorAI" },
  description: "Generate viral content ideas, hooks, scripts, captions, and content calendars for YouTube, Instagram, TikTok, and LinkedIn — powered by Groq AI.",
  keywords: ["content creator", "AI writing", "viral content", "YouTube scripts", "TikTok ideas", "content calendar", "Groq AI"],
  authors: [{ name: "CreatorAI" }],
  openGraph: {
    title: "CreatorAI – AI Co-Pilot for Content Creators",
    description: "Generate viral content ideas, hooks, and scripts in seconds.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: { card: "summary_large_image", title: "CreatorAI", description: "AI Co-Pilot for Content Creators" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1a1a24",
                color: "#f0f0fa",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                fontSize: "13px",
                fontFamily: "var(--font-manrope)",
              },
              success: { iconTheme: { primary: "#34d399", secondary: "#1a1a24" } },
              error: { iconTheme: { primary: "#f87171", secondary: "#1a1a24" } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
