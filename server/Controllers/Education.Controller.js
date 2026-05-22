import { Education } from "../Models/Education.model.js";
import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const parts = url.split("/");
    const file = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${file}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.log("Cloudinary delete error:", err);
  }
};

const deleteMultiple = async (urls) => {
  if (!urls?.length) return;
  await Promise.all(urls.map(deleteFromCloudinary));
};

export const createEducation = async (req, res) => {
  const uploadedImages = [];

  try {
    const images = req.files?.images || [];

    if (images.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Exactly 2 images required",
      });
    }

    uploadedImages.push(...images.map((f) => f.path));

    const education = await Education.create({
      ...req.body,
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      education,
    });
  } catch (err) {
    await deleteMultiple(uploadedImages);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getEducation = async (req, res) => {
  try {
    const data = await Education.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      education: data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSingleEducation = async (req, res) => {
  try {
    const data = await Education.findById(req.params.id);

    res.json({
      success: true,
      education: data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const edu = await Education.findById(req.params.id);

    if (!edu) {
      return res.status(404).json({ message: "Not found" });
    }

    Object.assign(edu, req.body);

    const newImages = req.files?.images || [];

    if (newImages.length > 0) {
      if (newImages.length !== 2) {
        return res.status(400).json({
          message: "Exactly 2 images required",
        });
      }

      await deleteMultiple(edu.images);
      edu.images = newImages.map((f) => f.path);
    }

    const updated = await edu.save();

    res.json({
      success: true,
      education: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const edu = await Education.findById(req.params.id);

    if (!edu) {
      return res.status(404).json({ message: "Not found" });
    }

    await deleteMultiple(edu.images);
    await Education.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};