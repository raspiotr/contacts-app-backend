const express = require("express");
const contacts = require("../../models/contacts");
const schemas = require("../../schemas/contacts");

const router = express.Router();

router.get("/", async (_, res) => {
  const contactsList = await contacts.listContacts();
  res.status(200).json(contactsList);
});

router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const selectedContact = await contacts.getContactById(contactId);
  if (!selectedContact) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.status(200).json(selectedContact);
  }
});

router.post("/", async (req, res) => {
  const body = req.body;
  const result = schemas.contactSchema.validate(body);

  if (result.error) {
    res.status(400).json({ message: result.error.details[0].message });
  } else {
    const newContact = await contacts.addContact(body);
    res.status(201).json(newContact);
  }
});

router.delete("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const removedContact = await contacts.removeContact(contactId);
  if (!removedContact) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.status(200).json({ message: "Contact deleted" });
  }
});

router.put("/:contactId", async (req, res) => {
  const body = req.body;
  const result = schemas.contactSchema.validate(body);

  if (result.error) {
    res.status(400).json({ message: result.error.details[0].message });
  } else {
    const { contactId } = req.params;
    const updatedContact = await contacts.updateContact(contactId, body);
    if (!updatedContact) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(200).json(updatedContact);
    }
  }
});

module.exports = router;
