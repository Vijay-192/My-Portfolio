import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    educationType: {
      type: String,
      enum: ["college", "school"],
      required: true,
    },

    courseName: {
      type: String,
      required: true,
    },

    instituteName: {
      type: String,
      required: true,
    },

    universityName: String,
    branch: String,

    schoolName: String,
    stream: String,
    board: String,

    session: {
      type: String,
      required: true,
    },

    cgpa: String,
    percentage: String,

    images: {
      type: [String],
      validate: {
        validator: (v) => v.length === 2,
        message: "Exactly 2 images required",
      },
    },
  },
  { timestamps: true }
);

export const Education = mongoose.model("Education", educationSchema);