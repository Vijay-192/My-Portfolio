import express from "express";
import {
  createEducation,
  getEducation,
  getSingleEducation,
  updateEducation,
  deleteEducation,
} from "../Controllers/Education.Controller.js";

import { uploadService } from "../middleware/upload.js";

const router = express.Router();

router.post("/create", uploadService, createEducation);
router.get("/", getEducation);
router.get("/:id", getSingleEducation);
router.put("/:id", uploadService, updateEducation);
router.delete("/:id", deleteEducation);

export default router;