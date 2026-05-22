import mongoose, { Schema, Document, Model } from "mongoose";

// ---- Subscription ----
export interface ISubscriptionDocument extends Document {
  userId: string;
  plan: "free" | "pro" | "enterprise";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    status: { type: String, enum: ["active", "canceled", "past_due", "trialing"], default: "active" },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Subscription: Model<ISubscriptionDocument> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscriptionDocument>("Subscription", SubscriptionSchema);

// ---- Analytics ----
export interface IAnalyticsDocument extends Document {
  userId: string;
  date: Date;
  generationsCount: number;
  savedCount: number;
  creditsUsed: number;
  toolsUsed: Record<string, number>;
  platformsUsed: Record<string, number>;
}

const AnalyticsSchema = new Schema<IAnalyticsDocument>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    generationsCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
    creditsUsed: { type: Number, default: 0 },
    toolsUsed: { type: Map, of: Number, default: {} },
    platformsUsed: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

AnalyticsSchema.index({ userId: 1, date: -1 });

export const Analytics: Model<IAnalyticsDocument> =
  mongoose.models.Analytics ||
  mongoose.model<IAnalyticsDocument>("Analytics", AnalyticsSchema);
