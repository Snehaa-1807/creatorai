import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateContentCalendar } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { GeneratedContent } from "@/models/Content";
import { User } from "@/models/User";
import { getCreditsForAction } from "@/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { niche, platforms, postsPerWeek = 7, weekStart } = body;
    if (!niche) return NextResponse.json({ error: "Niche is required" }, { status: 400 });

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const credits = getCreditsForAction("calendar");
    if (user.plan === "free" && user.credits < credits) {
      return NextResponse.json({ error: "Insufficient credits." }, { status: 402 });
    }

    const start = weekStart || new Date().toISOString().split("T")[0];
    const calendar = await generateContentCalendar({
      niche,
      platforms: platforms || ["YouTube", "Instagram", "TikTok"],
      postsPerWeek: Math.min(postsPerWeek, 14),
      weekStart: start,
    });

    await Promise.all([
      GeneratedContent.create({ userId: session.user.id, type: "calendar", prompt: niche, output: calendar, model: "llama-3.3-70b-versatile", creditsUsed: credits }),
      user.plan === "free" ? User.findByIdAndUpdate(session.user.id, { $inc: { credits: -credits } }) : Promise.resolve(),
    ]);

    return NextResponse.json({ calendar, creditsUsed: credits });
  } catch (error) {
    console.error("Generate calendar error:", error);
    return NextResponse.json({ error: "Failed to generate calendar." }, { status: 500 });
  }
}
