import cloudinary from "../config/cloudinary.js";
import Resume from "../Models/Resume.model.js";
import axios from "axios";

const mimeToFormat = (mimetype = "") => {
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype === "application/msword") return "doc";
  return "docx";
};

const formatToMime = (format = "") => {
  if (format === "pdf") return "application/pdf";
  if (format === "doc") return "application/msword";
  return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  for (const resource_type of ["raw", "image"]) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type });
      if (result.result === "ok") {
        console.log(`Deleted as ${resource_type}:`, publicId);
        return;
      }
    } catch (_) {}
  }

};

const getSignedUrl = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: "raw",   
    type: "upload",
    sign_url: true,
    secure: true,
  });
};

export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }
    const docType = file.fieldname === "cv" ? "cv" : "resume";
    if (req.body.replaceOld === "true") {
      const old = await Resume.find({ type: docType });
      await Promise.all(old.map((doc) => deleteFromCloudinary(doc.publicId)));
      await Resume.deleteMany({ type: docType });
    }
    const newDoc = await Resume.create({
      type: docType,
      label: req.body.label || "",
      publicId: file.filename,
      fileUrl: file.path,
      originalName: file.originalname,
      format: mimeToFormat(file.mimetype),
      fileSize: file.size,
      isActive: true,
    });
    return res.status(201).json({
      success: true,
      message: `${docType.toUpperCase()} uploaded successfully.`,
      data: newDoc,
    });
  } catch (error) {
    console.error("uploadDocument error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error." });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const docType = req.docType;
    const filter = { type: docType };
    if (req.query.active === "true") filter.isActive = true;
    const docs = await Resume.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (error) {
    console.error("getDocuments error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error." });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const doc = await Resume.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found." });
    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error("getDocumentById error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error." });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const doc = await Resume.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found." });
    await deleteFromCloudinary(doc.publicId);
    await doc.deleteOne();
    return res.status(200).json({
      success: true,
      message: `${doc.type.toUpperCase()} deleted successfully.`,
    });
  } catch (error) {
    console.error("deleteDocument error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error." });
  }
};

export const updateLabel = async (req, res) => {
  try {
    const { label } = req.body;
    if (!label || !label.trim()) {
      return res.status(400).json({ success: false, message: "Label is required." });
    }
    const doc = await Resume.findByIdAndUpdate(
      req.params.id,
      { label: label.trim() },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ success: false, message: "Document not found." });
    return res.status(200).json({ success: true, message: "Label updated.", data: doc });
  } catch (error) {
    console.error("updateLabel error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error." });
  }
};

const serveFile = async (req, res, disposition) => {
  try {
    const doc = await Resume.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    const mime = formatToMime(doc.format);
    const filename = doc.originalName || `document.${doc.format}`;
    const signedUrl = getSignedUrl(doc.publicId);

    console.log("Serving:", signedUrl);

    const cloudResponse = await axios.get(signedUrl, {
      responseType: "stream",
      maxRedirects: 5,
      timeout: 30000,
    });

    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Disposition", `${disposition}; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Cache-Control", "no-cache");

    cloudResponse.data.pipe(res);
    cloudResponse.data.on("error", (err) => {
      console.error("Stream error:", err.message);
      if (!res.headersSent) res.status(500).json({ success: false, message: "Stream failed" });
    });

  } catch (err) {
    console.error("serveFile error:", err.message);
    if (!res.headersSent) res.status(500).json({ success: false, message: "Failed to serve file" });
  }
};

export const viewDocument    = (req, res) => serveFile(req, res, "inline");
export const downloadDocument = (req, res) => serveFile(req, res, "attachment");