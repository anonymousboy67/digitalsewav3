import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const role = searchParams.get("role");
    const skill = searchParams.get("skill");
    const district = searchParams.get("district");
    const availability = searchParams.get("availability");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");
    const minRating = searchParams.get("minRating");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const query: Record<string, unknown> = {};

    if (role) query.role = role;
    if (availability) query.availability = availability;
    if (district) query["location.district"] = district;
    if (skill) query.skills = { $in: [skill] };
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) (query.hourlyRate as Record<string, number>).$gte = parseInt(minRate);
      if (maxRate) (query.hourlyRate as Record<string, number>).$lte = parseInt(maxRate);
    }
    if (minRating) query["rating.average"] = { $gte: parseFloat(minRating) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ "rating.average": -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
