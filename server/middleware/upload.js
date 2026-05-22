import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const ALLOWED_ALL = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "image/gif", "image/svg+xml", "image/bmp", "image/tiff",
  "image/ico", "image/heic", "image/heif",
  "image/vnd.adobe.photoshop", "application/postscript",
  "application/illustrator",
  "video/mp4", "video/quicktime", "video/avi",
  "video/webm", "video/x-msvideo",
  "application/xml", "text/xml",
]);

const ALLOWED_IMAGES_ONLY = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "image/gif", "image/svg+xml", "image/heic",
]);


const fileFilter = (_req, file, cb) => {
  ALLOWED_ALL.has(file.mimetype)
    ? cb(null, true)
    : cb(new Error(`Invalid file type: ${file.mimetype}`), false);
};


const blogFileFilter = (_req, file, cb) => {
  ALLOWED_IMAGES_ONLY.has(file.mimetype)
    ? cb(null, true)
    : cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Only images are allowed for blog uploads.`
        ),
        false
      );
};


const smartProjectStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const isVideo = file.mimetype.startsWith("video/");

    if (file.fieldname === "projectIcon") {
      return {
        folder: "portfolio/projects/icons",
        resource_type: "image",
        public_id: `project-icon-${uid()}`,
        transformation: [{ width: 200, height: 200, crop: "fill" }],
      };
    }

    if (file.fieldname === "profileImage") {
      return {
        folder: "portfolio/projects/testimonials",
        resource_type: "image",
        public_id: `testimonial-${uid()}`,
        transformation: [
          { width: 150, height: 150, crop: "fill", gravity: "face" },
        ],
      };
    }

    if (isVideo) {
      return {
        folder: "portfolio/projects/videos",
        resource_type: "video",
        public_id: `project-video-${uid()}`,
        eager: [{ duration: 120 }],
      };
    }

    // Default → project screenshot / image
    return {
      folder: "portfolio/projects/images",
      resource_type: "image",
      public_id: `project-img-${uid()}`,
    };
  },
});


const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    if (file.fieldname === "coverImage") {
      return {
        folder: "portfolio/blogs/covers",
        resource_type: "image",
        public_id: `blog-cover-${uid()}`,
        transformation: [
          { width: 1200, height: 630, crop: "fill", quality: "auto" },
        ],
      };
    }

    if (file.fieldname === "authorAvatar") {
      return {
        folder: "portfolio/blogs/avatars",
        resource_type: "image",
        public_id: `blog-avatar-${uid()}`,
        transformation: [
          {
            width: 150,
            height: 150,
            crop: "fill",
            gravity: "face",
            quality: "auto",
          },
        ],
      };
    }

    return {
      folder: "portfolio/blogs/misc",
      resource_type: "image",
      public_id: `blog-misc-${uid()}`,
    };
  },
});


const serviceStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "portfolio/services",
    resource_type: "image",
    public_id: `service-${uid()}`,
  }),
});

const achievementStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "portfolio/achievements",
    resource_type: "image",
    public_id: `achievement-${uid()}`,
  }),
});
export const uploadProjectSmart = multer({
  storage: smartProjectStorage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
}).fields([
  { name: "images",       maxCount: 7 },
  { name: "video",        maxCount: 1 },
  { name: "projectIcon",  maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);

export const uploadBlogFiles = multer({
  storage: blogStorage,
  fileFilter: blogFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).fields([
  { name: "coverImage",   maxCount: 1 },
  { name: "authorAvatar", maxCount: 1 },
]);

export const uploadService = multer({
  storage: serviceStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).fields([{ name: "images", maxCount: 2 }]);

export const uploadAchievement = multer({
  storage: achievementStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).fields([{ name: "images", maxCount: 7 }]);



/** @deprecated Use uploadProjectSmart instead */
export const uploadImage = multer({
  storage: smartProjectStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("image");

/** @deprecated Use uploadProjectSmart instead */
export const uploadVideo = multer({
  storage: smartProjectStorage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
}).single("video");

/** @deprecated Use uploadBlogFiles instead */
export const uploadBlogImage = multer({
  storage: blogStorage,
  fileFilter: blogFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("image");