import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  targetType: {
    type: String,
    enum: ["listing", "comment"],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  additionalInfo: {
    type: String,
    trim: true,
    maxLength: 1000
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "dismissed"],
    default: "pending"
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reviewedAt: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model("Report", ReportSchema);
