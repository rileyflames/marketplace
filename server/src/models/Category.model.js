import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    enum: [
      'phones',
      'laptops',
      'tablets',
      'pcs',
      'components',
      'peripherals',
      'networking',
      'smart-home',
      'consoles',
      'games',
      'collectibles',
      'accessories',
      'wearables',
      'software',
      'repairs',
      'clothes',
      'other'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String // optional: URL to an icon representing the category
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Category", CategorySchema);
