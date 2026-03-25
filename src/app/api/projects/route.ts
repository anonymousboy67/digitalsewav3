import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const district = searchParams.get("district");
    const urgency = searchParams.get("urgency");
    const minBudget = searchParams.get("minBudget");
    const maxBudget = searchParams.get("maxBudget");
    const search = searchParams.get("search");
    const clientId = searchParams.get("clientId");
    const freelancerId = searchParams.get("freelancerId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "-createdAt";

    const query: Record<string, unknown> = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (district) query["location.district"] = district;
    if (urgency) query.urgency = urgency;
    if (clientId) query.client = clientId;
    if (freelancerId) query.assignedFreelancer = freelancerId;
    if (minBudget || maxBudget) {
      query["budget.max"] = {};
      if (minBudget) (query["budget.max"] as Record<string, number>).$gte = parseInt(minBudget);
      if (maxBudget) (query["budget.max"] as Record<string, number>).$lte = parseInt(maxBudget);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate("client", "name avatar location rating verified")
      .populate("assignedFreelancer", "name avatar rating")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ projects, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string })?.role !== "client") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const project = await Project.create({
      ...body,
      client: session.user?.id,
    });

    const populated = await project.populate("client", "name avatar");

    return NextResponse.json({ project: populated }, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
