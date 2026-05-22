import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    year:        { type: String, required: true, trim: true },
    category:    { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    tags:        { type: [String], default: [] },
    images:      { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Achievement = mongoose.model("Achievement", achievementSchema);