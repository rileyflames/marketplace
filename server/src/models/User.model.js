import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: String,
    city: String,
    province: String,
    country: String,
    coordinates: {
      type: [Number], // [lng, lat]
      index: '2dsphere',
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters long'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minLength: [3, 'Username must be at least 3 characters long'],
      maxLength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens',
      ],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Email is required'],
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    avatar: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return (
            /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(v) ||
            /\.(jpg|jpeg|png|gif|webp)$/i.test(v)
          );
        },
      },
      message: 'Avatar must be a valid URL or file path',
    },
    coverPhoto: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return (
            /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(v) ||
            /\.(jpg|jpeg|png|gif|webp)$/i.test(v)
          );
        },
      },
      message: 'Cover photo must be a valid URL or file path',
    },
    badges: {
      type: [String],
      enum: ['seller', 'reseller', 'regular'],
      default: ['regular'],
    },
    listingsCount: {
      free: { type: Number, min: 0, max: 2, default: 0 },
      paid: { type: Number, min: 0, default: 0 },
      total: { type: Number, min: 0, default: 0 },
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      goodCount: { type: Number, default: 0 },
      badCount: { type: Number, default: 0 },
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-moderator', 'moderator'],
      default: 'user',
    },
    banned: { type: Boolean, default: false },
    banReason: String,
    bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    warnings: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationCode: String,
    hasActiveDispute: { type: Boolean, default: false },
    location: locationSchema,
  },
  { timestamps: true }
);

UserSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'to'
});

// To ensure virtuals are included in JSON output:
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

export default mongoose.model('User', UserSchema);
