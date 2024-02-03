/* eslint-disable no-useless-catch */
const { Contact } = require("../schemas/contacts");
const { isValidObjectId } = require("mongoose");

const listContacts = async (owner) => {
  try {
    const contacts = await Contact.find({ owner });
    return contacts;
  } catch (error) {
    throw error;
  }
};

const getContactById = async (contactId, userId) => {
  if (!isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not valid ID.");
  }
  try {
    const selectedContact = await Contact.findOne({ _id: contactId });
    const contactOwner = selectedContact.owner;

    if (userId.toString() !== contactOwner.toString()) {
      throw new Error("Not authorized. It is not your contact!");
    }

    return selectedContact;
  } catch (error) {
    throw error;
  }
};

const removeContact = async (contactId, userId) => {
  if (!isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not valid ID.");
  }
  try {
    const removedContact =
      (await Contact.findByIdAndDelete({ _id: contactId })) || null;
    const contactOwner = removedContact.owner;

    if (userId.toString() !== contactOwner.toString()) {
      throw new Error("Not authorized. It is not your contact!");
    }

    return removedContact;
  } catch (error) {
    throw error;
  }
};

const addContact = async (body, owner) => {
  try {
    const newContact = await Contact.create({ ...body, owner });
    return newContact;
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, body, userId) => {
  if (!isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not valid ID.");
  }
  try {
    const selectedContact = await Contact.findOne({ _id: contactId });
    const contactOwner = selectedContact.owner;

    if (userId.toString() !== contactOwner.toString()) {
      throw new Error("Not authorized. It is not your contact!");
    }

    await Contact.findByIdAndUpdate(contactId, body);
    const updatedContact = (await Contact.findOne({ _id: contactId })) || null;
    return updatedContact;
  } catch (error) {
    throw error;
  }
};

const updateStatusContact = async (contactId, body, userId) => {
  if (!isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not valid ID.");
  }
  try {
    const selectedContact = await Contact.findOne({ _id: contactId });
    const contactOwner = selectedContact.owner;

    if (userId.toString() !== contactOwner.toString()) {
      throw new Error("Not authorized. It is not your contact!");
    }

    const { favorite } = body;
    await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
    const updatedContact = (await Contact.findOne({ _id: contactId })) || null;
    return updatedContact;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
