import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const revieweeId = searchParams.get("revieweeId");
    const reviewerId = searchParams.get("reviewerId");

    const query: Record<string, unknown> = {};
    if (revieweeId) query.reviewee = revieweeId;
    if (reviewerId) query.reviewer = reviewerId;

    const reviews = await Review.find(query)
      .populate("reviewer", "name avatar role")
      .populate("reviewee", "name avatar role")
      .populate("project", "title")
      .sort("-createdAt")
      .lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    const review = await Review.create({
      project: body.projectId,
      reviewer: session.user?.id,
      reviewee: body.revieweeId,
      rating: body.rating,
      comment: body.comment,
    });

    // Update reviewee rating
    const allReviews = await Review.find({ reviewee: body.revieweeId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(body.revieweeId, {
      "rating.average": Math.round(avgRating * 10) / 10,
      "rating.count": allReviews.length,
    });

    await Notification.create({
      user: body.revieweeId,
      type: "review_received",
      title: "New Review Received",
      message: `${session.user?.name} left you a ${body.rating}-star review`,
      link: `/${body.revieweeRole}/reviews`,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
