
import { Blog } from "../Models/Blog.model.js";
import cloudinary from "../config/cloudinary.js";


const getPublicId = (url) => {
  if (!url) return null;
  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  return match ? match[1] : null;
};

const deleteFromCloudinary = async (url) => {
  const publicId = getPublicId(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Cloudinary delete failed:", err.message);
    }
  }
};


export const createBlog = async (req, res) => {
  try {
    const { title, content, author, category, tags } = req.body;

    // Validation
    if (!title || !content || !author || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, content, author, category",
      });
    }

    // Process tags
    let processedTags = [];
    if (tags) {
      processedTags = typeof tags === "string" 
        ? tags.split(",").map(t => t.trim()).filter(Boolean)
        : Array.isArray(tags) 
        ? tags.filter(Boolean) 
        : [];
    }

    // Build blog data
    const blogData = {
      title,
      content,
      author,
      category,
      tags: processedTags,
      coverImage: req.files?.coverImage?.[0]?.path || null,
      authorAvatar: req.files?.authorAvatar?.[0]?.path || null,
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (err) {
    console.error("❌ Create Blog Error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(err.errors).map(e => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: err.message,
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: blogs.length,
      blogs 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const { title, content, author, category, tags } = req.body;

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (author) blog.author = author;
    if (category) blog.category = category;

    // Update tags
    if (tags !== undefined) {
      blog.tags = typeof tags === "string"
        ? tags.split(",").map(t => t.trim()).filter(Boolean)
        : Array.isArray(tags)
        ? tags.filter(Boolean)
        : [];
    }

    // Handle cover image update
    if (req.files?.coverImage?.[0]) {
      if (blog.coverImage) await deleteFromCloudinary(blog.coverImage);
      blog.coverImage = req.files.coverImage[0].path;
    }

    // Handle avatar update
    if (req.files?.authorAvatar?.[0]) {
      if (blog.authorAvatar) await deleteFromCloudinary(blog.authorAvatar);
      blog.authorAvatar = req.files.authorAvatar[0].path;
    }

    await blog.save();

    res.json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (err) {
    console.error("❌ Update Blog Error:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(err.errors).map(e => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: err.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete associated images from Cloudinary
    if (blog.coverImage) await deleteFromCloudinary(blog.coverImage);
    if (blog.authorAvatar) await deleteFromCloudinary(blog.authorAvatar);

    await blog.deleteOne();

    res.json({ 
      success: true, 
      message: "Blog deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};