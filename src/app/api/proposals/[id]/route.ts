import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Proposal from "@/models/Proposal";
import Project from "@/models/Project";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const proposal = await Proposal.findById(id).populate("project").populate("freelancer", "name");
    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const project = proposal.project as { _id: { toString: () => string }; client: { toString: () => string }; title: string; status: string; assignedFreelancer: unknown; save: () => Promise<void> };

    if (body.status === "accepted" || body.status === "rejected") {
      // Only project client can accept/reject
      if (project.client.toString() !== session.user?.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      proposal.status = body.status;
      await proposal.save();

      const freelancer = proposal.freelancer as { _id: { toString: () => string }; name: string };

      if (body.status === "accepted") {
        // Update project status
        project.status = "in-progress";
        project.assignedFreelancer = freelancer._id;
        await project.save();

        // Reject all other proposals
        await Proposal.updateMany(
          { project: project._id, _id: { $ne: id } },
          { status: "rejected" }
        );

        // Notify freelancer
        await Notification.create({
          user: freelancer._id,
          type: "proposal_accepted",
          title: "Proposal Accepted!",
          message: `Your proposal for "${project.title}" was accepted`,
          link: `/freelancer/active-projects/${project._id}`,
        });
      } else {
        await Notification.create({
          user: freelancer._id,
          type: "proposal_rejected",
          title: "Proposal Not Selected",
          message: `Your proposal for "${project.title}" was not selected`,
          link: `/freelancer/my-proposals`,
        });
      }
    }

    if (body.status === "withdrawn" && (proposal.freelancer as { _id: { toString: () => string } })._id.toString() === session.user?.id) {
      proposal.status = "withdrawn";
      await proposal.save();
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("Proposal update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
