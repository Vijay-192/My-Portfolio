import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, "Images are required"],
      validate: {
        validator: function(arr) {
          return arr.length === 2;
        },
        message: "Service must have exactly 2 images"
      }
    },
  },
  { 
    timestamps: true 
  }
);

export const Service = mongoose.model("Service", serviceSchema);