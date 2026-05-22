import express from "express";
import {
  createAchievement,
  getAchievements,
  getSingleAchievement,
  updateAchievement,
  deleteAchievement,
} from "../Controllers/Achievement.Controller.js";
import { uploadAchievement } from "../middleware/upload.js";

const router = express.Router();


router.get("/",          getAchievements);          
router.get("/:id",       getSingleAchievement); 
router.post("/create",   uploadAchievement, createAchievement);
router.put("/:id",       uploadAchievement, updateAchievement);
router.delete("/:id",    deleteAchievement);       

export default router;