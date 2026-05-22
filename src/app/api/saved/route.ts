import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SavedContent } from "@/models/Content";

// GET /api/saved - list saved content
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    await connectDB();

    const query: Record<string, unknown> = { userId: session.user.id };
    if (type && type !== "all") query.type = type;

    const [items, total] = await Promise.all([
      SavedContent.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      SavedContent.countDocuments(query),
    ]);

    return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Get saved error:", error);
    return NextResponse.json({ error: "Failed to fetch saved content" }, { status: 500 });
  }
}

// POST /api/saved - save content
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, title, content, platform, niche, tags } = body;

    if (!type || !title || !content) {
      return NextResponse.json({ error: "type, title, and content are required" }, { status: 400 });
    }

    await connectDB();

    const saved = await SavedContent.create({
      userId: session.user.id,
      type,
      title: title.slice(0, 200),
      content,
      platform,
      niche,
      tags: tags || [],
      isFavorite: false,
    });

    return NextResponse.json({ saved }, { status: 201 });
  } catch (error) {
    console.error("Save content error:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
