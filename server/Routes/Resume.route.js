import express from "express";
import { uploadResume, uploadCV } from "../middleware/upload.js";
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  updateLabel,
  viewDocument,
  downloadDocument,
} from "../Controllers/Resume.Controller.js";

const router = express.Router();

const setResumeType = (req, _res, next) => { req.docType = "resume"; next(); };
const setCVType     = (req, _res, next) => { req.docType = "cv";     next(); };


router.get("/:id/view",         viewDocument);
router.get("/:id/download",     downloadDocument);


router.post("/upload",          uploadResume, setResumeType, uploadDocument);
router.get("/",                 setResumeType, getDocuments);
router.get("/:id",              getDocumentById);
router.patch("/:id",            updateLabel);
router.delete("/:id",           deleteDocument);

export const cvRouter = express.Router();


cvRouter.get("/:id/view",       viewDocument);
cvRouter.get("/:id/download",   downloadDocument);


cvRouter.post("/upload",        uploadCV, setCVType, uploadDocument);
cvRouter.get("/",               setCVType, getDocuments);
cvRouter.get("/:id",            getDocumentById);
cvRouter.patch("/:id",          updateLabel);
cvRouter.delete("/:id",         deleteDocument);

export default router;