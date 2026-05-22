
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Maximum 10 tags allowed",
      },
    },
    coverImage: {
      type: String,
      default: null,
    },
    authorAvatar: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });

export const Blog = mongoose.model("Blog", blogSchema);