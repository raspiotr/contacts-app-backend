const express = require("express");
const schemas = require("../../schemas/contacts");
const service = require("../../services/contactsService");
const authorize = require("../../middlewares/authorize");

const router = express.Router();

router.get("/", authorize, async (req, res, next) => {
  const { _id: owner } = req.user;
  try {
    const contactsList = await service.listContacts(owner);
    res.status(200).json(contactsList);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authorize, async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  let selectedContact;

  try {
    selectedContact = (await service.getContactById(contactId, userId)) || null;
  } catch (error) {
    return next(error);
  }

  if (!selectedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(selectedContact);
});

router.post("/", authorize, async (req, res, next) => {
  const body = req.body;
  const { _id: owner } = req.user;
  const result = schemas.addContactSchema.validate(body);

  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message });
  }

  try {
    const newContact = await service.addContact(body, owner);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", authorize, async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  let removedContact;

  try {
    removedContact = await service.removeContact(contactId, userId);
  } catch (error) {
    return next(error);
  }

  if (!removedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "Contact deleted" });
});

router.put("/:contactId", authorize, async (req, res, next) => {
  const body = req.body;
  const userId = req.user._id;
  const result = schemas.addContactSchema.validate(body);

  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message });
  }

  const { contactId } = req.params;
  let updatedContact;

  try {
    updatedContact = (await service.updateContact(contactId, body, userId)) || null;
  } catch (error) {
    return next(error);
  }
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updatedContact);
});

router.patch("/:contactId/favorite", authorize, async (req, res, next) => {
  const body = req.body;
  const userId = req.user._id;
  const result = schemas.updateFavoriteSchema.validate(body);

  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message });
  }

  const { contactId } = req.params;
  let updatedContact;

  try {
    updatedContact =
      (await service.updateStatusContact(contactId, body, userId)) || null;
  } catch (error) {
    return next(error);
  }
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updatedContact);
});

module.exports = router;
