/* eslint-disable no-useless-catch */
const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    const parsedContacts = JSON.parse(contacts);
    return parsedContacts;
  } catch (error) {
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const parsedContacts = await listContacts();
    const selectedContact =
      parsedContacts.find((contact) => contact.id === contactId) || null;
    return selectedContact;
  } catch (error) {
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const parsedContacts = await listContacts();
    const index = parsedContacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (index === -1) {
      return null;
    }
    const [removedContact] = parsedContacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(parsedContacts, null, 1));

    return removedContact;
  } catch (error) {
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const parsedContacts = await listContacts();
    const newContact = { id: nanoid(), ...body };
    const updatedContacts = [...parsedContacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 1));
    return newContact;
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const parsedContacts = await listContacts();
    const index = parsedContacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (index === -1) {
      return null;
    }
    const contactToUpdate = parsedContacts[index];
    parsedContacts[index] = { ...contactToUpdate, ...body };
    await fs.writeFile(contactsPath, JSON.stringify(parsedContacts, null, 1));
    return parsedContacts[index];
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
};
