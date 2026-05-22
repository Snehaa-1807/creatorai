import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateCaption } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { GeneratedContent } from "@/models/Content";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { topic, platform, tone, includeHashtags = true, includeEmojis = true } = body;
    if (!topic) return NextResponse.json({ error: "Topic is required" }, { status: 400 });

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.plan === "free" && user.credits < 1) {
      return NextResponse.json({ error: "Insufficient credits." }, { status: 402 });
    }

    const caption = await generateCaption({ topic, platform, tone, includeHashtags, includeEmojis });

    await Promise.all([
      GeneratedContent.create({ userId: session.user.id, type: "caption", prompt: topic, output: caption, platform, model: "llama-3.1-8b-instant", creditsUsed: 1 }),
      user.plan === "free" ? User.findByIdAndUpdate(session.user.id, { $inc: { credits: -1 } }) : Promise.resolve(),
    ]);

    return NextResponse.json({ caption, creditsUsed: 1 });
  } catch (error) {
    console.error("Generate caption error:", error);
    return NextResponse.json({ error: "Failed to generate caption." }, { status: 500 });
  }
}
