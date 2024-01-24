const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  const parsedContacts = JSON.parse(contacts);
  return parsedContacts;
};

const getContactById = async (contactId) => {
  const parsedContacts = await listContacts();
  const selectedContact =
    parsedContacts.find((contact) => contact.id === contactId) || null;
  return selectedContact;
};

const removeContact = async (contactId) => {
  const parsedContacts = await listContacts();
  const index = parsedContacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [removedContact] = parsedContacts.splice(index, 1);

  const updatedContacts = parsedContacts.filter(
    (contact) => contact.id !== contactId
  );
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 1));

  return removedContact;
};

const addContact = async (body) => {
  const parsedContacts = await listContacts();
  const newContact = { id: nanoid(), ...body };
  const updatedContacts = [...parsedContacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 1));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const parsedContacts = await listContacts();
  const index = parsedContacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const contactToUpdate = parsedContacts[index];
  parsedContacts[index] = { ...contactToUpdate, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(parsedContacts, null, 1));
  return parsedContacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
