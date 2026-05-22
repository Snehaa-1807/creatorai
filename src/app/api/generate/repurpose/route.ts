import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { repurposeContent } from "@/lib/groq";
import { connectDB } from "@/lib/db";
import { GeneratedContent } from "@/models/Content";
import { User } from "@/models/User";
import { getCreditsForAction } from "@/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { content, fromPlatform, toPlatform } = body;
    if (!content || !fromPlatform || !toPlatform) {
      return NextResponse.json({ error: "Content, fromPlatform, and toPlatform are required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const credits = getCreditsForAction("repurpose");
    if (user.plan === "free" && user.credits < credits) {
      return NextResponse.json({ error: "Insufficient credits." }, { status: 402 });
    }

    const result = await repurposeContent(content, fromPlatform, toPlatform);

    await Promise.all([
      GeneratedContent.create({ userId: session.user.id, type: "caption", prompt: `${fromPlatform} → ${toPlatform}`, output: result, platform: toPlatform, model: "llama-3.3-70b-versatile", creditsUsed: credits }),
      user.plan === "free" ? User.findByIdAndUpdate(session.user.id, { $inc: { credits: -credits } }) : Promise.resolve(),
    ]);

    return NextResponse.json({ result, creditsUsed: credits });
  } catch (error) {
    console.error("Repurpose error:", error);
    return NextResponse.json({ error: "Failed to repurpose content." }, { status: 500 });
  }
}
