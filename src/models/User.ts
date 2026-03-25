import mongoose, { Schema, Document } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  password?: string;
  role: "client" | "freelancer";
  avatar?: string;
  phone?: string;
  location?: { district: string; city: string };
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  portfolio?: Array<{
    title: string;
    description: string;
    image?: string;
    link?: string;
    skills?: string[];
  }>;
  availability?: "available" | "busy" | "unavailable";
  rating?: { average: number; count: number };
  verified?: boolean;
  panNumber?: string;
  completedProjects?: number;
  totalEarnings?: number;
  totalSpent?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    role: { type: String, enum: ["client", "freelancer"], required: true },
    avatar: { type: String },
    phone: { type: String },
    location: {
      district: { type: String },
      city: { type: String },
    },
    bio: { type: String },
    skills: [{ type: String }],
    hourlyRate: { type: Number },
    portfolio: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String },
        link: { type: String },
        skills: [{ type: String }],
      },
    ],
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    verified: { type: Boolean, default: false },
    panNumber: { type: String },
    completedProjects: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);
