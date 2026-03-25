import mongoose, { Schema, Document } from "mongoose";

export interface IProjectDoc extends Document {
  title: string;
  description: string;
  client: mongoose.Types.ObjectId;
  category: string;
  skills: string[];
  budget: { min: number; max: number; type: "fixed" | "hourly" };
  deadline: Date;
  location: { district: string; city: string; remote: boolean };
  status: "open" | "in-progress" | "completed" | "cancelled" | "disputed";
  urgency: "normal" | "urgent";
  proposals: mongoose.Types.ObjectId[];
  assignedFreelancer?: mongoose.Types.ObjectId;
  milestones: Array<{
    title: string;
    amount: number;
    status: "pending" | "in-progress" | "completed" | "paid";
    dueDate?: Date;
  }>;
  attachments: Array<{ name: string; url: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: [
        "web-development",
        "mobile-app",
        "graphic-design",
        "content-writing",
        "video-editing",
        "digital-marketing",
        "data-entry",
        "photography",
        "translation",
        "seo",
        "social-media",
        "other",
      ],
      required: true,
    },
    skills: [{ type: String }],
    budget: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      type: { type: String, enum: ["fixed", "hourly"], default: "fixed" },
    },
    deadline: { type: Date, required: true },
    location: {
      district: { type: String, required: true },
      city: { type: String, required: true },
      remote: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled", "disputed"],
      default: "open",
    },
    urgency: { type: String, enum: ["normal", "urgent"], default: "normal" },
    proposals: [{ type: Schema.Types.ObjectId, ref: "Proposal" }],
    assignedFreelancer: { type: Schema.Types.ObjectId, ref: "User" },
    milestones: [
      {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed", "paid"],
          default: "pending",
        },
        dueDate: { type: Date },
      },
    ],
    attachments: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProjectDoc>("Project", ProjectSchema);
