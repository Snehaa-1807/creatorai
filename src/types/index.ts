// ============================================
// CreatorAI - TypeScript Types
// ============================================

export type Platform = "YouTube" | "TikTok" | "Instagram" | "LinkedIn" | "Twitter/X" | "Podcast";

export type ContentType = "Long-form" | "Short/Reel" | "Carousel" | "Thread" | "Podcast";

export type Tone = "Educational" | "Entertaining" | "Inspirational" | "Controversial" | "Motivational" | "Humorous";

export type HookStyle = "Curiosity Gap" | "Controversy" | "Story-based" | "Statistic" | "Challenge" | "Question";

export type ScriptType =
  | "YouTube Long-form (8-12 min)"
  | "YouTube Shorts (60 sec)"
  | "TikTok / Reel (30-60 sec)"
  | "Podcast Outline"
  | "LinkedIn Article"
  | "Twitter Thread";

export type SubscriptionPlan = "free" | "pro" | "enterprise";

export type ContentCategory = "idea" | "hook" | "script" | "title" | "caption" | "hashtag" | "calendar";

// ---- API Response Types ----

export interface ContentIdea {
  id: string;
  title: string;
  type: ContentType;
  hook: string;
  hashtags: string[];
  estimatedViews?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export interface ViralHook {
  id: string;
  hook: string;
  style: HookStyle;
  strength: number; // 0-100
  emotion: string;
  wordCount: number;
}

export interface ScriptSection {
  title: string;
  content: string;
  timestamp?: string;
}

export interface GeneratedScript {
  hook: string;
  intro: string;
  sections: ScriptSection[];
  cta: string;
  duration: string;
  wordCount: number;
  platform: Platform;
  type: ScriptType;
}

export interface TrendItem {
  tag: string;
  platform: Platform;
  views: string;
  growth: number;
  icon: string;
  category?: string;
}

export interface CalendarPost {
  id: string;
  date: string;
  platform: Platform;
  contentType: ContentType;
  title: string;
  time?: string;
  status?: "planned" | "drafted" | "published";
}

export interface SEOTitle {
  title: string;
  score: number;
  keywords: string[];
  clickRate: string;
}

// ---- DB Model Types ----

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  plan: SubscriptionPlan;
  credits: number;
  maxCredits: number;
  niche?: string;
  platforms?: Platform[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISavedContent {
  _id: string;
  userId: string;
  type: ContentCategory;
  title: string;
  content: string | object;
  platform?: Platform;
  niche?: string;
  tags?: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGeneratedContent {
  _id: string;
  userId: string;
  type: ContentCategory;
  prompt: string;
  output: string | object;
  platform?: Platform;
  model: string;
  creditsUsed: number;
  createdAt: Date;
}

export interface ISubscription {
  _id: string;
  userId: string;
  plan: SubscriptionPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd?: Date;
  createdAt: Date;
}

// ---- UI State Types ----

export interface GenerateState {
  isLoading: boolean;
  error: string | null;
  data: unknown;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

// ---- API Request Types ----

export interface GenerateIdeasRequest {
  niche: string;
  platform: Platform;
  audience: string;
  tone: Tone;
  contentType: ContentType;
  count: number;
}

export interface GenerateHooksRequest {
  topic: string;
  platform: Platform;
  style: HookStyle;
  emotion: string;
  count: number;
}

export interface GenerateScriptRequest {
  topic: string;
  type: ScriptType;
  niche: string;
  audience: string;
  platform: Platform;
  includeSections: string[];
}

export interface GenerateTitlesRequest {
  topic: string;
  platform: Platform;
  keywords?: string;
  count: number;
}

export interface GenerateCaptionRequest {
  topic: string;
  platform: Platform;
  tone: Tone;
  includeHashtags: boolean;
  includeEmojis: boolean;
}

export interface GenerateCalendarRequest {
  niche: string;
  platforms: Platform[];
  postsPerWeek: number;
  weekStart: string;
}
