
import express from "express";
import { uploadBlogFiles } from "../middleware/upload.js";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
} from "../Controllers/Blog.Controller.js";

const router = express.Router();

router.post("/create", uploadBlogFiles, createBlog);
router.get("/", getBlogs);
router.get("/:id", getSingleBlog);
router.put("/:id", uploadBlogFiles, updateBlog);
router.delete("/:id", deleteBlog);

export default router;