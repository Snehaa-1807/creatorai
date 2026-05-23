import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateContentIdeas } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { GeneratedContent } from "@/models/Content";
import { User } from "@/models/User";
import { getCreditsForAction } from "@/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { niche, platform, audience, tone, contentType, count = 10 } = body;

    if (!niche || !platform) {
      return NextResponse.json({ error: "Niche and platform are required" }, { status: 400 });
    }

    await connectDB();

    // Check credits
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const creditsNeeded = getCreditsForAction("idea");
    if (user.plan === "free" && user.credits < creditsNeeded) {
      return NextResponse.json({ error: "Insufficient credits. Please upgrade your plan." }, { status: 402 });
    }

    // Generate
    const ideas = await generateContentIdeas({ niche, platform, audience, tone, contentType, count: Math.min(count, 20) });

    // Save to history & deduct credits
    await Promise.all([
      GeneratedContent.create({
        userId: session.user.id,
        type: "idea",
        prompt: `${niche} | ${platform} | ${audience}`,
        output: ideas,
        platform,
        aiModel: "llama-3.3-70b-versatile",
        creditsUsed: creditsNeeded,
      }),
      user.plan === "free" ? User.findByIdAndUpdate(session.user.id, { $inc: { credits: -creditsNeeded } }) : Promise.resolve(),
    ]);

    return NextResponse.json({ ideas, creditsUsed: creditsNeeded });
  } catch (error) {
    console.error("Generate ideas error:", error);
    return NextResponse.json({ error: "Failed to generate ideas. Check your GROQ_API_KEY." }, { status: 500 });
  }
}