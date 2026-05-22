import express from "express";
import { uploadProjectSmart } from "../middleware/upload.js";
import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
} from "../Controllers/Project.Controller.js";

const router = express.Router();

router.post("/create", uploadProjectSmart, createProject);
router.get("/",        getProjects);
router.get("/:id",     getSingleProject);
router.put("/:id",     uploadProjectSmart, updateProject);
router.delete("/:id",  deleteProject);

export default router;