import Gallery from "../Models/Gallery.model.js";
import cloudinary from "../config/cloudinary.js";

const extractPublicId = (url) => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1].split(".")[0];
  const folder = parts.slice(parts.indexOf("upload") + 1, -1).join("/");
  return folder ? `${folder}/${filename}` : filename;
};

const deleteCloudinaryAsset = async (publicId, resourceType = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, err.message);
  }
};
export const getAllGalleryItems = async (_req, res) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFeaturedGalleryItems = async (_req, res) => {
  try {
    const items = await Gallery.find({ isFeatured: true }).sort({ order: 1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createGalleryItem = async (req, res) => {
  try {
    const { title, description, category, tags, isFeatured, order } = req.body;

    const media = [];
    if (req.files?.images) {
      for (const file of req.files.images) {
        media.push({
          url: file.path,           
          publicId: file.filename, 
          type: "image",
          width: file.width,
          height: file.height,
        });
      }
    }

    if (req.files?.video) {
      for (const file of req.files.video) {
        media.push({
          url: file.path,
          publicId: file.filename,
          type: "video",
        });
      }
    }

    if (media.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image or video is required" });
    }

    const item = await Gallery.create({
      title,
      description,
      category: category || "general",
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
      media,
      isFeatured: isFeatured === "true" || isFeatured === true,
      order: order ? Number(order) : 0,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Gallery item not found" });

    const { title, description, category, tags, isFeatured, order, removeMediaIds } = req.body;

    if (removeMediaIds) {
      const idsToRemove = Array.isArray(removeMediaIds) ? removeMediaIds : [removeMediaIds];
      for (const pid of idsToRemove) {
        const found = item.media.find((m) => m.publicId === pid);
        if (found) await deleteCloudinaryAsset(pid, found.type === "video" ? "video" : "image");
      }
      item.media = item.media.filter((m) => !idsToRemove.includes(m.publicId));
    }

    if (req.files?.images) {
      for (const file of req.files.images) {
        item.media.push({
          url: file.path,
          publicId: file.filename,
          type: "image",
          width: file.width,
          height: file.height,
        });
      }
    }
    if (req.files?.video) {
      for (const file of req.files.video) {
        item.media.push({
          url: file.path,
          publicId: file.filename,
          type: "video",
        });
      }
    }

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (category !== undefined) item.category = category;
    if (tags !== undefined)
      item.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
    if (isFeatured !== undefined)
      item.isFeatured = isFeatured === "true" || isFeatured === true;
    if (order !== undefined) item.order = Number(order);

    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    for (const m of item.media) {
      await deleteCloudinaryAsset(m.publicId, m.type === "video" ? "video" : "image");
    }

    await item.deleteOne();
    res.status(200).json({ success: true, message: "Gallery item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};