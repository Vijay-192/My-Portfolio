import express from "express";
import multer from "multer";
import { uploadProjectSmart } from "../middleware/upload.js";
import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
} from "../Controllers/Project.Controller.js";

const router = express.Router();
const safeUpload = (req, res, next) => {
  uploadProjectSmart(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          success: false,
          message: `Unexpected file field: "${err.field}". Allowed fields: images, video, projectIcon, profileImage`,
        });
      }

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large. Max size: 100MB for video, 10MB for images.",
        });
      }

      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "Too many files. Max 7 images allowed.",
        });
      }

      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  });
};

router.post("/create", safeUpload, createProject);
router.get("/",        getProjects);
router.get("/:id",     getSingleProject);
router.put("/:id",     safeUpload, updateProject);
router.delete("/:id",  deleteProject);

export default router;