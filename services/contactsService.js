/* eslint-disable no-useless-catch */
const { Contact } = require("../schemas/contacts");
const { isValidObjectId } = require("mongoose");

const listContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw error;
  }
};

const getContactById = async (contactId) => {
  if (!isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not valid ID.");
  }
  try {
    const selectedContact = await Contact.findOne({ _id: contactId });
    console.log(selectedContact);
    return selectedContact;
  } catch (error) {
    throw error;
  }
};

const removeContact = async (contactId) => {
  if (!isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not valid ID.");
  }
  try {
    const removedContact =
      (await Contact.findByIdAndDelete({ _id: contactId })) || null;
    return removedContact;
  } catch (error) {
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const newContact = await Contact.create(body);
    return newContact;
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  if (!isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not valid ID.");
  }
  try {
    await Contact.findByIdAndUpdate(contactId, body);
    const updatedContact = (await Contact.findOne({ _id: contactId })) || null;
    return updatedContact;
  } catch (error) {
    throw error;
  }
};

const updateStatusContact = async (contactId, body) => {
  if (!isValidObjectId(contactId)) {
    throw new Error("Not Found. It is not valid ID.");
  }
  try {
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
