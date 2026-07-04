import Contact from "../Models/Contact.model.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, email and message are required.",
        });
    }

    const contact = await Contact.create({ name, email, subject, message });

    return res.status(201).json({ success: true, data: contact });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found." });
    }

    return res.status(200).json({ success: true, message: "Deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const deleteManyContacts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "ids array is required." });
    }

    await Contact.deleteMany({ _id: { $in: ids } });

    return res
      .status(200)
      .json({ success: true, message: `${ids.length} record(s) deleted.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
