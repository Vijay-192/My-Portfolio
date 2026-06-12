import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      trim: true,
      default: "general",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    media: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        type: {
          type: String,
          enum: ["image", "video"],
          default: "image",
        },
        width: Number,
        height: Number,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", galleryItemSchema);
export default Gallery;