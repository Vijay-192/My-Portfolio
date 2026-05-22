import { v2 as cloudinary } from "cloudinary";
import { Service } from "../Models/Service.model.js";

const deleteFromCloudinary = async (url, resourceType = "image") => {
  if (!url) return;
  try {
    const urlParts = url.split("/");
    const filenameWithExt = urlParts[urlParts.length - 1];
    const filename = filenameWithExt.split(".")[0];
    const folder = urlParts[urlParts.length - 2];
    const publicId = `${folder}/${filename}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
  }
};

const deleteMultipleFromCloudinary = async (urls) => {
  if (!urls?.length) return;
  await Promise.all(urls.map(url => deleteFromCloudinary(url, "image")));
};

export const createService = async (req, res) => {
  const uploadedImages = [];
  
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const imageFiles = req.files?.images || [];

    if (imageFiles.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Must upload exactly 2 images",
      });
    }

    uploadedImages.push(...imageFiles.map(f => f.path));

    const service = await Service.create({
      title,
      description,
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      message: "Service Created Successfully",
      service,
    });
  } catch (error) {
    await deleteMultipleFromCloudinary(uploadedImages);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service Not Found" });
    }
    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service Not Found" });
    }

    const { title, description } = req.body;
    if (title) service.title = title;
    if (description) service.description = description;

    const newImages = req.files?.images || [];
    if (newImages.length > 0) {
      if (newImages.length !== 2) {
        return res.status(400).json({
          success: false,
          message: "Must upload exactly 2 images",
        });
      }
      
      await deleteMultipleFromCloudinary(service.images);
      service.images = newImages.map(f => f.path);
    }

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: "Service Updated Successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service Not Found" });
    }

    await deleteMultipleFromCloudinary(service.images);
    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Service Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};