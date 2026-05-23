import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { GeneratedContent } from "@/models/Content";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "4"), 20);

    await connectDB();

    const [items, total, scriptsCount] = await Promise.all([
      GeneratedContent.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("type prompt createdAt")
        .lean(),
      GeneratedContent.countDocuments({ userId: session.user.id }),
      GeneratedContent.countDocuments({ userId: session.user.id, type: "script" }),
    ]);

    return NextResponse.json({ items, total, scriptsCount });
  } catch (error) {
    console.error("Recent generations error:", error);
    return NextResponse.json({ error: "Failed to fetch recent generations" }, { status: 500 });
  }
}