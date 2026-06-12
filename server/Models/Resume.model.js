import mongoose from "mongoose";
const resumeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["resume", "cv"],
      required: [true, "Document type is required (resume | cv)"],
    },

    label: {
      type: String,
      trim: true,
      maxlength: [120, "Label must be 120 characters or fewer"],
      default: "",
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public_id is required"],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    originalName: {
      type: String,
      default: "",
    },
    format: {
      type: String,
      enum: ["pdf", "doc", "docx"],
      default: "pdf",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
resumeSchema.index({ type: 1, isActive: 1 });
const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
