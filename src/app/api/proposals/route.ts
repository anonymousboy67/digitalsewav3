import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Proposal from "@/models/Proposal";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const freelancerId = searchParams.get("freelancerId") || session.user?.id;

    // Only allow freelancers to fetch their own proposals (or admins)
    if (freelancerId !== session.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const proposals = await Proposal.find({ freelancer: freelancerId })
      .populate("project", "title category budget deadline status")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error("Proposals fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
