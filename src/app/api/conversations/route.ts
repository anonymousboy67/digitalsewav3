import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const conversations = await Conversation.find({
      participants: session.user?.id,
    })
      .populate("participants", "name avatar role")
      .populate("project", "title")
      .sort("-updatedAt")
      .lean();

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Conversations fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();
    const { participantId, projectId } = body;

    // Check if conversation already exists
    const existing = await Conversation.findOne({
      participants: { $all: [session.user?.id, participantId] },
      ...(projectId && { project: projectId }),
    });

    if (existing) {
      return NextResponse.json({ conversation: existing });
    }

    const conversation = await Conversation.create({
      participants: [session.user?.id, participantId],
      project: projectId || undefined,
    });

    const populated = await conversation.populate("participants", "name avatar role");

    return NextResponse.json({ conversation: populated }, { status: 201 });
  } catch (error) {
    console.error("Conversation creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
