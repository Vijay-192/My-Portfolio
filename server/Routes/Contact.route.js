import express from "express";
import {
  createContact,
  deleteContact,
  deleteManyContacts,
  getAllContacts,
} from "../Controllers/Contact.Controller.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", getAllContacts);
router.delete("/bulk", deleteManyContacts);
router.delete("/:id", deleteContact);
export default router;
