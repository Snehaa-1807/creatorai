import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateViralHooks } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { GeneratedContent } from "@/models/Content";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { topic, platform, style, emotion, count = 8 } = body;

    if (!topic) return NextResponse.json({ error: "Topic is required" }, { status: 400 });

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.plan === "free" && user.credits < 1) {
      return NextResponse.json({ error: "Insufficient credits. Please upgrade." }, { status: 402 });
    }

    const hooks = await generateViralHooks({ topic, platform, style, emotion, count: Math.min(count, 10) });

    await Promise.all([
      GeneratedContent.create({ userId: session.user.id, type: "hook", prompt: topic, output: hooks, platform, model: "llama-3.3-70b-versatile", creditsUsed: 1 }),
      user.plan === "free" ? User.findByIdAndUpdate(session.user.id, { $inc: { credits: -1 } }) : Promise.resolve(),
    ]);

    return NextResponse.json({ hooks, creditsUsed: 1 });
  } catch (error) {
    console.error("Generate hooks error:", error);
    return NextResponse.json({ error: "Failed to generate hooks. Check your GROQ_API_KEY." }, { status: 500 });
  }
}
