import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Proposal from "@/models/Proposal";
import Notification from "@/models/Notification";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = await params;

    const proposals = await Proposal.find({ project: id })
      .populate("freelancer", "name avatar rating skills hourlyRate location completedProjects bio")
      .sort("-createdAt")
      .lean();

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error("Proposals fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string })?.role !== "freelancer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // Check for existing proposal
    const existing = await Proposal.findOne({
      project: id,
      freelancer: session.user?.id,
    });

    if (existing) {
      return NextResponse.json({ error: "You already submitted a proposal" }, { status: 409 });
    }

    const project = await Project.findById(id).populate("client", "name");
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const proposal = await Proposal.create({
      project: id,
      freelancer: session.user?.id,
      coverLetter: body.coverLetter,
      bidAmount: body.bidAmount,
      estimatedDuration: body.estimatedDuration,
    });

    // Add proposal to project
    project.proposals.push(proposal._id);
    await project.save();

    // Notify client
    await Notification.create({
      user: project.client,
      type: "new_proposal",
      title: "New Proposal Received",
      message: `${session.user?.name} submitted a proposal for "${project.title}"`,
      link: `/client/my-projects/${id}`,
    });

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error("Proposal creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
