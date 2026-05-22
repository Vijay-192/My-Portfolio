import express from "express";
import { uploadImage } from "../middleware/upload.js";
import {
  createSkill,
  getSkills,
  deleteSkill,
} from "../Controllers/Skill.Controller.js";

const router = express.Router();

router.post("/create", uploadImage, createSkill);
router.get("/", getSkills);
router.delete("/:id", deleteSkill);

export default router;