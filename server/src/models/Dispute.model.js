import mongoose from "mongoose";

const DisputeSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  openedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  against: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, required: true, trim: true, maxLength: 1000 },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  status: {
    type: String,
    enum: ["open", "resolved", "closed"],
    default: "open"
  },
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  resolution: {
    summary: { type: String, trim: true, maxLength: 1000 },
    resolvedAt: { type: Date }
  },
  public: {
    type: Boolean,
    default: true // public visibility for safety and transparency
  }
}, { timestamps: true });

export default mongoose.model("Dispute", DisputeSchema);
