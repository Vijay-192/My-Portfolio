
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    icon: { type: String },
    color: { type: String, default: "#ffffff" },
    image: { type: String },
  },
  { timestamps: true }
);

export const Skill = mongoose.model("Skill", skillSchema);