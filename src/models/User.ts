import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider: "credentials" | "google";
  plan: "free" | "pro" | "enterprise";
  credits: number;
  maxCredits: number;
  niche?: string;
  platforms?: string[];
  bio?: string;
  website?: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    image: { type: String },
    provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
    plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    credits: { type: Number, default: 50 },
    maxCredits: { type: Number, default: 50 },
    niche: { type: String },
    platforms: [{ type: String }],
    bio: { type: String },
    website: { type: String },
    stripeCustomerId: { type: String },
  },
  { timestamps: true }
);

// ✅ Hash password before save — only runs when password is set/modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
