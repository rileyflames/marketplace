import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  price: {
    type: Number,
    min: 0
  },
  flag: {
    type: String,
    enum: ['sale', 'wanted', 'help'],
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  images: [{
    type: String,
    validate: {
      validator: (v) => !v || /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(v),
      message: "Image must be a valid URL or relative path"
    }
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isSold: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isReported: {
    type: Boolean,
    default: false
  },
  location: {
    suburb: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String }
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  isBiddable: {
    type: Boolean,
    default: false
  },
  bids: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  highestBid: {
    type: Number,
    default: 0
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
}, { 
  timestamps: true 
});

// Custom schema-level validation
ListingSchema.pre('validate', function (next) {
  if (this.isBiddable && this.flag !== 'sale') {
    this.invalidate(
      'isBiddable',
      'Only listings with the flag "sale" can be biddable.'
    );
  }
  next();
});

export default mongoose.model("Listing", ListingSchema);
