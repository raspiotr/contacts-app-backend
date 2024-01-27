const express = require("express");
const schemas = require("../../schemas/contacts");
const service = require("../../services/contactsService");

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const contactsList = await service.listContacts();
    res.status(200).json(contactsList);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  let selectedContact;

  try {
    selectedContact = (await service.getContactById(contactId)) || null;
  } catch (error) {
    return next(error);
  }

  if (!selectedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(selectedContact);
});

router.post("/", async (req, res, next) => {
  const body = req.body;
  const result = schemas.addContactSchema.validate(body);

  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message });
  }

  try {
    const newContact = await service.addContact(body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  let removedContact;

  try {
    removedContact = await service.removeContact(contactId);
  } catch (error) {
    return next(error);
  }

  if (!removedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "Contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  const body = req.body;
  const result = schemas.addContactSchema.validate(body);

  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message });
  }

  const { contactId } = req.params;
  let updatedContact;

  try {
    updatedContact = (await service.updateContact(contactId, body)) || null;
  } catch (error) {
    return next(error);
  }
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updatedContact);
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const body = req.body;
  const result = schemas.updateFavoriteSchema.validate(body);

  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message });
  }

  const { contactId } = req.params;
  let updatedContact;

  try {
    updatedContact =
      (await service.updateStatusContact(contactId, body)) || null;
  } catch (error) {
    return next(error);
  }
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updatedContact);
});

module.exports = router;
