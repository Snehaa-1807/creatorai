// ============================================
// CreatorAI - Utility Functions
// ============================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function getPlatformColor(platform: string): string {
  const map: Record<string, string> = {
    YouTube: "#ef4444",
    TikTok: "#2dd4bf",
    Instagram: "#f472b6",
    LinkedIn: "#60a5fa",
    "Twitter/X": "#94a3b8",
    Podcast: "#fbbf24",
  };
  return map[platform] ?? "#7c5cfc";
}

export function getPlatformIcon(platform: string): string {
  const map: Record<string, string> = {
    YouTube: "YT",
    TikTok: "TK",
    Instagram: "IG",
    LinkedIn: "LI",
    "Twitter/X": "X",
    Podcast: "PO",
  };
  return map[platform] ?? platform.slice(0, 2).toUpperCase();
}

export function getCreditsForAction(type: string): number {
  const map: Record<string, number> = {
    idea: 2,
    hook: 1,
    script: 5,
    title: 1,
    caption: 1,
    calendar: 3,
    trend: 2,
    repurpose: 3,
  };
  return map[type] ?? 1;
}

export function planLimits(plan: string) {
  const limits = {
    free: { credits: 50, maxCredits: 50, tools: 3, label: "Free" },
    pro: { credits: 1000, maxCredits: 1000, tools: -1, label: "Pro" },
    enterprise: { credits: -1, maxCredits: -1, tools: -1, label: "Enterprise" },
  };
  return limits[plan as keyof typeof limits] ?? limits.free;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
