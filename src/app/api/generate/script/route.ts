import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateScript } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { GeneratedContent } from "@/models/Content";
import { User } from "@/models/User";
import { getCreditsForAction } from "@/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { topic, type, niche, audience, platform, includeSections = ["Hook", "Story", "CTA"] } = body;

    if (!topic) return NextResponse.json({ error: "Topic is required" }, { status: 400 });

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const credits = getCreditsForAction("script");
    if (user.plan === "free" && user.credits < credits) {
      return NextResponse.json({ error: "Insufficient credits. Upgrade to Pro for more." }, { status: 402 });
    }

    const script = await generateScript({ topic, type, niche, audience, platform, includeSections });

    await Promise.all([
      GeneratedContent.create({
        userId: session.user.id,
        type: "script",
        prompt: `${topic} | ${type}`,
        output: script,
        platform,
        model: "llama-3.3-70b-versatile",
        creditsUsed: credits,
      }),
      user.plan === "free"
        ? User.findByIdAndUpdate(session.user.id, { $inc: { credits: -credits } })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ script, creditsUsed: credits });
  } catch (error) {
    console.error("Generate script error:", error);
    return NextResponse.json({ error: "Failed to generate script. Check your GROQ_API_KEY." }, { status: 500 });
  }
}
