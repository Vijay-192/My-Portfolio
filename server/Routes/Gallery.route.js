import express from "express";
import {
  getAllGalleryItems,
  getFeaturedGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../Controllers/Gallery.Controller.js";
import { uploadProjectSmart } from "../middleware/upload.js"; 

const router = express.Router();

router.get("/", getAllGalleryItems);
router.get("/featured", getFeaturedGalleryItems);
router.get("/:id", getGalleryItemById);
router.post("/", uploadProjectSmart, createGalleryItem);
router.put("/:id", uploadProjectSmart, updateGalleryItem);
router.delete("/:id", deleteGalleryItem);

export default router;