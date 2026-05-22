import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SavedContent } from "@/models/Content";

// Next.js 15 — params is a Promise
type RouteContext = { params: Promise<{ id: string }> };

// DELETE /api/saved/[id]
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    await connectDB();

    const item = await SavedContent.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete saved error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// PATCH /api/saved/[id]
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();
    await connectDB();

    const item = await SavedContent.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: body },
      { new: true }
    );
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Update saved error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}