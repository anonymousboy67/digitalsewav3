import mongoose, { Schema, Document } from "mongoose";

export interface INotificationDoc extends Document {
  user: mongoose.Types.ObjectId;
  type:
    | "new_proposal"
    | "proposal_accepted"
    | "proposal_rejected"
    | "milestone_completed"
    | "payment_received"
    | "new_message"
    | "project_completed"
    | "review_received";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "new_proposal",
        "proposal_accepted",
        "proposal_rejected",
        "milestone_completed",
        "payment_received",
        "new_message",
        "project_completed",
        "review_received",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotificationDoc>("Notification", NotificationSchema);
