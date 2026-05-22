import { v2 as cloudinary } from "cloudinary";
import { Skill } from "../Models/Skill.model.js";


const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const urlParts = url.split("/");
    const filenameWithExt = urlParts[urlParts.length - 1];
    const filename = filenameWithExt.split(".")[0];
    const folder = urlParts[urlParts.length - 2];
    const publicId = `${folder}/${filename}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

export const createSkill = async (req, res) => {
  try {
    const { title, percentage, icon, color } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (percentage === undefined || percentage < 0 || percentage > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage must be between 0 and 100",
      });
    }

    const skill = await Skill.create({
      title,
      percentage: Number(percentage),
      icon:  icon  || null,
      color: color || "#ffffff",
      image: req.file?.path ?? null, 
    });

    res.status(201).json({ success: true, skill });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }
    await deleteFromCloudinary(skill.image);

    await Skill.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};