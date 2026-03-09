import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import Notification from "@/models/Notification";
import Project from "@/models/Project";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = session.user?.id;

    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("project", "title")
      .populate("from", "name avatar")
      .populate("to", "name avatar")
      .sort("-createdAt")
      .lean();

    // Calculate stats
    const totalEarned = transactions
      .filter((t) => t.to?.toString() === userId && t.type === "escrow_release" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = transactions
      .filter((t) => t.from?.toString() === userId && t.type === "escrow_deposit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({ transactions, totalEarned, totalSpent });
  } catch (error) {
    console.error("Transactions fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();

    const transaction = await Transaction.create({
      project: body.projectId,
      from: body.fromId || session.user?.id,
      to: body.toId,
      amount: body.amount,
      type: body.type,
      status: "completed", // Demo: always complete
      paymentMethod: body.paymentMethod,
    });

    // Update user totals for demo
    if (body.type === "escrow_deposit") {
      await User.findByIdAndUpdate(session.user?.id, {
        $inc: { totalSpent: body.amount },
      });
    } else if (body.type === "escrow_release") {
      await User.findByIdAndUpdate(body.toId, {
        $inc: { totalEarnings: body.amount },
      });

      // Notify freelancer
      const project = await Project.findById(body.projectId);
      await Notification.create({
        user: body.toId,
        type: "payment_received",
        title: "Payment Received!",
        message: `Rs. ${body.amount.toLocaleString()} has been released to your account`,
        link: `/freelancer/earnings`,
      });

      // Update project status
      if (project) {
        project.status = "completed";
        await project.save();

        await User.findByIdAndUpdate(body.toId, {
          $inc: { completedProjects: 1 },
        });
      }
    }

    return NextResponse.json({ transaction, message: "Demo: Payment simulated successfully" }, { status: 201 });
  } catch (error) {
    console.error("Transaction creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
