import { v2 as cloudinary } from "cloudinary";
import { Project } from "../Models/Project.model.js";

const deleteFromCloudinary = async (url, resourceType = "image") => {
  if (!url) return;
  try {
    const urlParts = url.split("/");
    const filenameWithExt = urlParts[urlParts.length - 1];
    const filename = filenameWithExt.split(".")[0];
    const folder = urlParts[urlParts.length - 2];
    const publicId = `${folder}/${filename}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

const deleteMultipleFromCloudinary = async (urls = [], resourceType = "image") => {
  await Promise.all(urls.map((url) => deleteFromCloudinary(url, resourceType)));
};

const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((t) => String(t).trim()).filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((t) => String(t).trim()).filter(Boolean);
  } catch (_) {}

  return value.split(/[\n,]+/).map((t) => t.trim()).filter(Boolean);
};

const buildTestimonial = (body, profileImageUrl = null) => {
  const { testimonialName, testimonialPost, testimonialDescription } = body;
  if (!testimonialName && !testimonialDescription) return null;
  return {
    name:         testimonialName        || "",
    post:         testimonialPost        || "",
    description:  testimonialDescription || "",
    profileImage: profileImageUrl        || null,
  };
};

export const createProject = async (req, res) => {
  try {
    const {
      title, description, techStack,
      liveLink, githubLink, category,
      industry, publishYear,
      problemStatement, solution, deliverables,
      testimonialName, testimonialPost, testimonialDescription,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const imageFiles  = req.files?.images       || [];
    const videoFile   = req.files?.video?.[0];
    const iconFile    = req.files?.projectIcon?.[0];
    const profileFile = req.files?.profileImage?.[0];

    const testimonial = buildTestimonial(req.body, profileFile?.path || null);

    const project = await Project.create({
      title,
      description,
      category,
      industry,
      publishYear:      publishYear ? Number(publishYear) : undefined,
      problemStatement,
      solution,
      techStack:        parseArray(techStack),
      deliverables:     parseArray(deliverables),
      liveLink,
      githubLink,
      projectIcon:  iconFile?.path  || null,
      images:       imageFiles.map((f) => f.path),
      video:        videoFile?.path || null,
      testimonial,
    });

    res.status(201).json({
      success: true,
      message: "Project Created Successfully",
      project,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    }
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project Not Found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project Not Found" });
    }

    const {
      title, description, techStack,
      liveLink, githubLink, category,
      industry, publishYear,
      problemStatement, solution, deliverables,
      testimonialName, testimonialPost, testimonialDescription,
      existingImages,   // ← JSON string sent by frontend: URLs to KEEP
    } = req.body;


    if (title !== undefined)              project.title            = title;
    if (description !== undefined)        project.description      = description;
    if (liveLink !== undefined)           project.liveLink         = liveLink;
    if (githubLink !== undefined)         project.githubLink       = githubLink;
    if (category)                         project.category         = category;
    if (industry)                         project.industry         = industry;
    if (publishYear !== undefined)        project.publishYear      = publishYear ? Number(publishYear) : project.publishYear;
    if (problemStatement !== undefined)   project.problemStatement = problemStatement;
    if (solution !== undefined)           project.solution         = solution;
    if (techStack)                        project.techStack        = parseArray(techStack);
    if (deliverables)                     project.deliverables     = parseArray(deliverables);
    const newImageFiles = req.files?.images || [];

    if (existingImages !== undefined || newImageFiles.length > 0) {
      let urlsToKeep = [];
      if (existingImages) {
        try {
          urlsToKeep = JSON.parse(existingImages);
          if (!Array.isArray(urlsToKeep)) urlsToKeep = [];
        } catch (_) {
          urlsToKeep = [];
        }
      } else {
        urlsToKeep = [...project.images];
      }
      const urlsToDelete = project.images.filter((url) => !urlsToKeep.includes(url));
      if (urlsToDelete.length > 0) {
        await deleteMultipleFromCloudinary(urlsToDelete, "image");
      }

      const newUploadedUrls = newImageFiles.map((f) => f.path);
      project.images = [...urlsToKeep, ...newUploadedUrls].slice(0, 7);
    }

    const videoFile = req.files?.video?.[0];
    if (videoFile) {
      await deleteFromCloudinary(project.video, "video");
      project.video = videoFile.path;
    }
    const iconFile = req.files?.projectIcon?.[0];
    if (iconFile) {
      await deleteFromCloudinary(project.projectIcon, "image");
      project.projectIcon = iconFile.path;
    }
    const profileFile = req.files?.profileImage?.[0];
    const hasTestimonialText = testimonialName || testimonialDescription;

    if (hasTestimonialText) {
      if (profileFile && project.testimonial?.profileImage) {
        await deleteFromCloudinary(project.testimonial.profileImage, "image");
      }
      project.testimonial = {
        name:         testimonialName        || project.testimonial?.name        || "",
        post:         testimonialPost        || project.testimonial?.post        || "",
        description:  testimonialDescription || project.testimonial?.description || "",
        profileImage: profileFile?.path      || project.testimonial?.profileImage || null,
      };
    } else if (profileFile) {
      if (project.testimonial?.profileImage) {
        await deleteFromCloudinary(project.testimonial.profileImage, "image");
      }
      project.testimonial = {
        ...(project.testimonial?.toObject?.() || {}),
        profileImage: profileFile.path,
      };
    }

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: "Project Updated Successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project Not Found" });
    }

    await deleteMultipleFromCloudinary(project.images, "image");
    await deleteFromCloudinary(project.video, "video");
    await deleteFromCloudinary(project.projectIcon, "image");
    if (project.testimonial?.profileImage) {
      await deleteFromCloudinary(project.testimonial.profileImage, "image");
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Project Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};