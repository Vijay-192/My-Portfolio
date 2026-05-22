import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String },
    post: { type: String },
    description: { type: String },
    profileImage: { type: String },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    industry: {
      type: String,
      enum: [
        "Web",
        "App",
        "Desktop",
        "AI/ML",
        "E-Commerce",
        "Healthcare",
        "Finance",
        "Education",
        "Other",
      ],
    },
    publishYear: {
      type: Number,
    },

    problemStatement: {
      type: String,
    },
    solution: {
      type: String,
    },
    deliverables: [
      {
        type: String,
      },
    ],
    techStack: [
      {
        type: String,
      },
    ],
    projectIcon: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    video: {
      type: String,
    },
    liveLink: {
      type: String,
    },
    githubLink: {
      type: String,
    },
    testimonial: {
      type: testimonialSchema,
      default: null,
    },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
