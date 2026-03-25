import mongoose, { Schema, Document } from "mongoose";

export interface IProposalDoc extends Document {
  project: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  coverLetter: string;
  bidAmount: number;
  estimatedDuration: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: Date;
  updatedAt: Date;
}

const ProposalSchema = new Schema<IProposalDoc>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    freelancer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String, required: true },
    bidAmount: { type: Number, required: true },
    estimatedDuration: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Proposal || mongoose.model<IProposalDoc>("Proposal", ProposalSchema);
