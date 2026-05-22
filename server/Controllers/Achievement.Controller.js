import cloudinary from "../config/cloudinary.js";
import { Achievement } from "../Models/Achievement.model.js";



const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const parts    = url.split("/");
    const file     = parts[parts.length - 1].split(".")[0];
    const folder   = parts[parts.length - 2];
    const publicId = `${folder}/${file}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};


const deleteMultiple = async (urls = []) => {
  if (!urls.length) return;
  await Promise.all(urls.map(deleteFromCloudinary));
};

export const createAchievement = async (req, res) => {
  const uploadedImages = [];

  try {
    const { title, year, category, description, tags } = req.body;


    if (!title || !year || !category) {
      return res.status(400).json({
        success: false,
        message: "title, year, and category are required",
      });
    }

    const files = req.files?.images || [];
    uploadedImages.push(...files.map((f) => f.path));

    let parsedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags.map((t) => t.trim()).filter(Boolean);
      } else {
        parsedTags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    const achievement = await Achievement.create({
      title,
      year,
      category,
      description: description || "",
      tags: parsedTags,
      images: uploadedImages,
    });

    return res.status(201).json({
      success: true,
      message: "Achievement created successfully",
      achievement,
    });
  } catch (err) {
    await deleteMultiple(uploadedImages);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    return res.json({ success: true, achievements });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSingleAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement)
      return res.status(404).json({ success: false, message: "Not found" });

    return res.json({ success: true, achievement });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const updateAchievement = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Not found" });

    const { title, year, category, description, tags } = req.body;

    if (title)       item.title       = title;
    if (year)        item.year        = year;
    if (category)    item.category    = category;
    if (description !== undefined) item.description = description;

    /* update tags */
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        item.tags = tags.map((t) => t.trim()).filter(Boolean);
      } else {
        item.tags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    const newFiles = req.files?.images || [];
    if (newFiles.length > 0) {
      await deleteMultiple(item.images);   
      item.images = newFiles.map((f) => f.path);
    }

    const updated = await item.save();

    return res.json({
      success: true,
      message: "Achievement updated successfully",
      achievement: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteAchievement = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Not found" });

    await deleteMultiple(item.images);
    await Achievement.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: "Achievement deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};