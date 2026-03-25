import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { name, email, password, role, phone, district, city, skills, hourlyRate, bio, panNumber } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData: Record<string, unknown> = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      location: { district, city },
      bio,
    };

    if (role === "freelancer") {
      userData.skills = skills || [];
      userData.hourlyRate = hourlyRate;
    }

    if (role === "client") {
      userData.panNumber = panNumber;
    }

    const user = await User.create(userData);

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
