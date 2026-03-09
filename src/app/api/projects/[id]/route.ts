import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import "@/models/Proposal";
import "@/models/User";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const project = await Project.findById(id)
      .populate("client", "name avatar location rating verified panNumber")
      .populate("assignedFreelancer", "name avatar rating skills hourlyRate")
      .populate({
        path: "proposals",
        populate: { path: "freelancer", select: "name avatar rating skills hourlyRate location completedProjects" },
      })
      .lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only client who owns the project or admin can update
    if (project.client.toString() !== session.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    Object.assign(project, body);
    await project.save();

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
