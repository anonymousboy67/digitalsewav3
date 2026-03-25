import mongoose, { Schema, Document } from "mongoose";

export interface IConversationDoc extends Document {
  participants: mongoose.Types.ObjectId[];
  project?: mongoose.Types.ObjectId;
  lastMessage?: {
    content: string;
    sender: mongoose.Types.ObjectId;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversationDoc>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    lastMessage: {
      content: { type: String },
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Conversation || mongoose.model<IConversationDoc>("Conversation", ConversationSchema);
