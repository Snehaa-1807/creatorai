import mongoose, { Schema, Document, Model } from "mongoose";

// ---- Generated Content ----
export interface IGeneratedContentDocument extends Document {
  userId: string;
  type: string;
  prompt: string;
  output: mongoose.Schema.Types.Mixed;
  platform?: string;
  aiModel: string;        // renamed from 'model' — avoids conflict with Mongoose Document.model()
  creditsUsed: number;
  createdAt: Date;
}

const GeneratedContentSchema = new Schema<IGeneratedContentDocument>(
  {
    userId:      { type: String, required: true, index: true },
    type:        { type: String, required: true, enum: ["idea", "hook", "script", "title", "caption", "calendar", "trend", "repurpose"] },
    prompt:      { type: String, required: true },
    output:      { type: mongoose.Schema.Types.Mixed, required: true },
    platform:    { type: String },
    aiModel:     { type: String, default: "llama-3.3-70b-versatile" },
    creditsUsed: { type: Number, default: 1 },
  },
  { timestamps: true }
);

GeneratedContentSchema.index({ userId: 1, createdAt: -1 });
GeneratedContentSchema.index({ userId: 1, type: 1 });

export const GeneratedContent: Model<IGeneratedContentDocument> =
  mongoose.models.GeneratedContent ||
  mongoose.model<IGeneratedContentDocument>("GeneratedContent", GeneratedContentSchema);

// ---- Saved Content ----
export interface ISavedContentDocument extends Document {
  userId: string;
  type: string;
  title: string;
  content: mongoose.Schema.Types.Mixed;
  platform?: string;
  niche?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SavedContentSchema = new Schema<ISavedContentDocument>(
  {
    userId:     { type: String, required: true, index: true },
    type:       { type: String, required: true, enum: ["idea", "hook", "script", "title", "caption", "calendar", "other"] },
    title:      { type: String, required: true },
    content:    { type: mongoose.Schema.Types.Mixed, required: true },
    platform:   { type: String },
    niche:      { type: String },
    tags:       [{ type: String }],
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SavedContentSchema.index({ userId: 1, createdAt: -1 });
SavedContentSchema.index({ userId: 1, type: 1 });
SavedContentSchema.index({ userId: 1, isFavorite: 1 });

export const SavedContent: Model<ISavedContentDocument> =
  mongoose.models.SavedContent ||
  mongoose.model<ISavedContentDocument>("SavedContent", SavedContentSchema);