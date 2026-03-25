import mongoose, { Schema, Document } from "mongoose";

export interface ITransactionDoc extends Document {
  project: mongoose.Types.ObjectId;
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  amount: number;
  type: "escrow_deposit" | "escrow_release" | "refund";
  status: "pending" | "completed" | "failed";
  paymentMethod: "khalti" | "esewa" | "bank";
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransactionDoc>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["escrow_deposit", "escrow_release", "refund"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["khalti", "esewa", "bank"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model<ITransactionDoc>("Transaction", TransactionSchema);
