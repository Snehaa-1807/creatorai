// ============================================
// CreatorAI - Groq AI Service
// ============================================

import Groq from "groq-sdk";
import type {
  GenerateIdeasRequest,
  GenerateHooksRequest,
  GenerateScriptRequest,
  GenerateTitlesRequest,
  GenerateCaptionRequest,
  GenerateCalendarRequest,
  ContentIdea,
  ViralHook,
  GeneratedScript,
  SEOTitle,
  CalendarPost,
} from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Default model - Groq's fastest model
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const FAST_MODEL = "llama-3.1-8b-instant";

// ---- Helper: Parse JSON safely ----
function parseJSON<T>(text: string, fallback: T): T {
  try {
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    console.error("JSON parse error:", text.slice(0, 200));
    return fallback;
  }
}

// ---- Helper: Chat completion ----
async function chatCompletion(
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_MODEL,
  maxTokens: number = 2048
): Promise<string> {
  const response = await groq.chat.completions.create({
    model,
    max_tokens: maxTokens,
    temperature: 0.85,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  return response.choices[0]?.message?.content || "";
}

// ============================================
// 1. IDEA GENERATOR
// ============================================
export async function generateContentIdeas(
  req: GenerateIdeasRequest
): Promise<ContentIdea[]> {
  const systemPrompt = `You are a top-tier viral content strategist who has helped 10,000+ creators grow to millions of followers. 
You specialize in creating scroll-stopping content ideas optimized for maximum engagement and virality.
IMPORTANT: Return ONLY a valid JSON array. No markdown, no preamble, no explanation.`;

  const userPrompt = `Generate ${req.count} viral ${req.platform} content ideas for:
- Niche: ${req.niche}
- Target Audience: ${req.audience}
- Tone: ${req.tone}
- Content Format: ${req.contentType}

Return a JSON array of objects with these exact keys:
{
  "id": "unique string id",
  "title": "Catchy, clickable title (max 80 chars)",
  "type": "${req.contentType}",
  "hook": "One powerful viral opening line (15-20 words max)",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "estimatedViews": "e.g. 50K-200K",
  "difficulty": "Easy|Medium|Hard"
}`;

  const text = await chatCompletion(systemPrompt, userPrompt);
  return parseJSON<ContentIdea[]>(text, []);
}

// ============================================
// 2. VIRAL HOOK GENERATOR
// ============================================
export async function generateViralHooks(
  req: GenerateHooksRequest
): Promise<ViralHook[]> {
  const systemPrompt = `You are a world-class copywriter specializing in scroll-stopping hooks for social media content.
Your hooks consistently achieve 10x higher CTR than average. You understand psychology, curiosity gaps, and viral mechanics.
IMPORTANT: Return ONLY a valid JSON array. No markdown, no preamble.`;

  const userPrompt = `Write ${req.count} viral ${req.platform} hooks for this topic:
"${req.topic}"

Hook style preference: ${req.style}
Emotion to trigger: ${req.emotion}

Return a JSON array of objects:
{
  "id": "unique string id",
  "hook": "The opening line (max 25 words)",
  "style": "${req.style}",
  "strength": 75-99 (integer viral strength score),
  "emotion": "${req.emotion}",
  "wordCount": integer
}`;

  const text = await chatCompletion(systemPrompt, userPrompt);
  return parseJSON<ViralHook[]>(text, []);
}

// ============================================
// 3. SCRIPT WRITER
// ============================================
export async function generateScript(
  req: GenerateScriptRequest
): Promise<GeneratedScript> {
  const systemPrompt = `You are an Emmy-winning scriptwriter and content strategist with 15 years of experience writing viral YouTube scripts.
You create scripts that are engaging, educational, and optimized for watch time and subscriber growth.
IMPORTANT: Return ONLY a valid JSON object. No markdown, no preamble.`;

  const userPrompt = `Write a complete ${req.type} script for:
- Topic: "${req.topic}"
- Platform: ${req.platform}
- Niche: ${req.niche}
- Target Audience: ${req.audience}
- Include: ${req.includeSections.join(", ")}

Return a JSON object:
{
  "hook": "Opening 2-3 sentences that instantly grab attention",
  "intro": "Introduction paragraph setting up the value (50-80 words)",
  "sections": [
    { "title": "Point/Section Title", "content": "Full content for this section (80-120 words)", "timestamp": "0:30" }
  ],
  "cta": "Compelling call-to-action (2-3 sentences)",
  "duration": "Estimated duration e.g. '8-10 minutes'",
  "wordCount": estimated word count as integer,
  "platform": "${req.platform}",
  "type": "${req.type}"
}

Make sections array have 3-5 items for long-form, 2-3 for short-form.`;

  const text = await chatCompletion(systemPrompt, userPrompt, DEFAULT_MODEL, 3000);
  return parseJSON<GeneratedScript>(text, {
    hook: "",
    intro: "",
    sections: [],
    cta: "",
    duration: "",
    wordCount: 0,
    platform: req.platform,
    type: req.type,
  });
}

// ============================================
// 4. SEO TITLE GENERATOR
// ============================================
export async function generateSEOTitles(
  req: GenerateTitlesRequest
): Promise<SEOTitle[]> {
  const systemPrompt = `You are an SEO expert and YouTube growth specialist who has optimized titles for channels with 10M+ subscribers.
You understand CTR psychology, keyword optimization, and A/B testing for video titles.
IMPORTANT: Return ONLY a valid JSON array. No markdown, no preamble.`;

  const userPrompt = `Generate ${req.count} SEO-optimized ${req.platform} titles for:
Topic: "${req.topic}"
${req.keywords ? `Target Keywords: ${req.keywords}` : ""}

Return a JSON array:
{
  "title": "SEO optimized title (max 70 chars)",
  "score": 70-99 integer CTR score,
  "keywords": ["keyword1", "keyword2"],
  "clickRate": "Estimated CTR e.g. '8-12%'"
}`;

  const text = await chatCompletion(systemPrompt, userPrompt, FAST_MODEL);
  return parseJSON<SEOTitle[]>(text, []);
}

// ============================================
// 5. CAPTION & HASHTAG GENERATOR
// ============================================
export async function generateCaption(
  req: GenerateCaptionRequest
): Promise<{ caption: string; hashtags: string[]; characterCount: number }> {
  const systemPrompt = `You are a social media expert specializing in high-engagement captions and strategic hashtag use.
IMPORTANT: Return ONLY a valid JSON object. No markdown, no preamble.`;

  const userPrompt = `Write a ${req.platform} caption for: "${req.topic}"
Tone: ${req.tone}
Include hashtags: ${req.includeHashtags}
Include emojis: ${req.includeEmojis}

Return JSON:
{
  "caption": "Full caption text",
  "hashtags": ["#tag1", "#tag2", ...],
  "characterCount": integer
}`;

  const text = await chatCompletion(systemPrompt, userPrompt, FAST_MODEL);
  return parseJSON(text, { caption: "", hashtags: [], characterCount: 0 });
}

// ============================================
// 6. CONTENT CALENDAR
// ============================================
export async function generateContentCalendar(
  req: GenerateCalendarRequest
): Promise<CalendarPost[]> {
  const systemPrompt = `You are a content strategy expert who builds viral content calendars for top creators.
You know the best posting times, frequency strategies, and platform algorithms inside out.
IMPORTANT: Return ONLY a valid JSON array. No markdown, no preamble.`;

  const userPrompt = `Create a weekly content calendar starting ${req.weekStart} for:
- Niche: ${req.niche}
- Platforms: ${req.platforms.join(", ")}
- Target posts per week: ${req.postsPerWeek}

Generate ${req.postsPerWeek} posts total spread across the week and platforms.

Return a JSON array:
{
  "id": "unique id",
  "date": "YYYY-MM-DD",
  "platform": "one of: ${req.platforms.join("|")}",
  "contentType": "Long-form|Short/Reel|Carousel|Thread",
  "title": "Content title/topic",
  "time": "HH:MM AM/PM best time to post",
  "status": "planned"
}`;

  const text = await chatCompletion(systemPrompt, userPrompt);
  return parseJSON<CalendarPost[]>(text, []);
}

// ============================================
// 7. TREND ANALYZER (AI-powered insights)
// ============================================
export async function generateTrendInsights(
  niche: string,
  platform: string
): Promise<{ insights: string; opportunities: string[]; warnings: string[] }> {
  const systemPrompt = `You are a trend analyst who tracks viral content patterns across social platforms.
IMPORTANT: Return ONLY a valid JSON object. No markdown, no preamble.`;

  const userPrompt = `Analyze current trends for ${niche} content on ${platform}.

Return JSON:
{
  "insights": "2-3 sentence overview of current trends",
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "warnings": ["pitfall to avoid 1", "pitfall to avoid 2"]
}`;

  const text = await chatCompletion(systemPrompt, userPrompt, FAST_MODEL, 512);
  return parseJSON(text, { insights: "", opportunities: [], warnings: [] });
}

// ============================================
// 8. CONTENT REPURPOSING
// ============================================
export async function repurposeContent(
  originalContent: string,
  fromPlatform: string,
  toPlatform: string
): Promise<{ repurposed: string; tips: string[] }> {
  const systemPrompt = `You are a content repurposing expert who transforms content between platforms for maximum engagement.
IMPORTANT: Return ONLY a valid JSON object. No markdown, no preamble.`;

  const userPrompt = `Repurpose this ${fromPlatform} content for ${toPlatform}:

"${originalContent}"

Return JSON:
{
  "repurposed": "The fully repurposed content optimized for ${toPlatform}",
  "tips": ["optimization tip 1", "tip 2", "tip 3"]
}`;

  const text = await chatCompletion(systemPrompt, userPrompt, DEFAULT_MODEL, 2000);
  return parseJSON(text, { repurposed: "", tips: [] });
}

// ============================================
// STREAMING SUPPORT
// ============================================
export async function streamChatCompletion(
  systemPrompt: string,
  userPrompt: string,
  onChunk: (chunk: string) => void,
  model: string = DEFAULT_MODEL
): Promise<void> {
  const stream = await groq.chat.completions.create({
    model,
    max_tokens: 2048,
    temperature: 0.85,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) onChunk(content);
  }
}

export { groq };
