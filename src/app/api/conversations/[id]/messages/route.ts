import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import Notification from "@/models/Notification";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = await params;

    const messages = await Message.find({ conversation: id })
      .populate("sender", "name avatar")
      .sort("createdAt")
      .lean();

    // Mark messages as read
    await Message.updateMany(
      { conversation: id, sender: { $ne: session.user?.id }, read: false },
      { read: true }
    );

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Messages fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const message = await Message.create({
      conversation: id,
      sender: session.user?.id,
      content: body.content,
    });

    const populated = await message.populate("sender", "name avatar");

    // Update conversation last message
    await Conversation.findByIdAndUpdate(id, {
      lastMessage: {
        content: body.content,
        sender: session.user?.id,
        createdAt: new Date(),
      },
    });

    // Notify other participant
    const otherParticipant = conversation.participants.find(
      (p: { toString(): string }) => p.toString() !== session.user?.id
    );

    if (otherParticipant) {
      await Notification.create({
        user: otherParticipant,
        type: "new_message",
        title: "New Message",
        message: `${session.user?.name}: ${body.content.slice(0, 60)}`,
        link: `/${(session.user as { role?: string })?.role}/messages`,
      });
    }

    return NextResponse.json({ message: populated }, { status: 201 });
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
