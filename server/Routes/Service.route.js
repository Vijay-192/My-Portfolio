import express from "express";
import { uploadService } from "../middleware/upload.js";
import {
  createService,
  getServices,
  getSingleService,
  updateService,
  deleteService,
} from "../Controllers/Service.Controller.js";

const router = express.Router();

router.post("/create", uploadService, createService);
router.get("/", getServices);
router.get("/:id", getSingleService);
router.put("/:id", uploadService, updateService);
router.delete("/:id", deleteService);

export default router;