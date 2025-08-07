import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Prevent duplicate one-on-one conversations
ConversationSchema.index({ participants: 1 }, { unique: true });

export default mongoose.model("Conversation", ConversationSchema);
