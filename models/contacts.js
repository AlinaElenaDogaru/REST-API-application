// const fs = require('fs').promises;
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');

// const contactsPath = path.join(__dirname, '../models/contacts.json');

// const getAllContacts = async () => {
//   const data = await fs.readFile(contactsPath, 'utf8');
//   return JSON.parse(data);
// };

// const findContactById = async (id) => {
//   const contacts = await getAllContacts();
//   return contacts.find((contact) => contact.id === id);
// };

// const createNewContact = async ({ name, email, phone }) => {
//   const contacts = await getAllContacts();
//   const newContact = { id: uuidv4(), name, email, phone };
//   contacts.push(newContact);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return newContact;
// };

// const deleteContactById = async (id) => {
//   const contacts = await getAllContacts();
//   const index = contacts.findIndex((contact) => contact.id === id);
//   if (index === -1) return null;
//   const [deletedContact] = contacts.splice(index, 1);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return deletedContact;
// };

// const modifyContactById = async (id, updates) => {
//   const contacts = await getAllContacts();
//   const index = contacts.findIndex((contact) => contact.id === id);
//   if (index === -1) return null;
//   contacts[index] = { ...contacts[index], ...updates };
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return contacts[index];
// };

// module.exports = {
//   getAllContacts,
//   findContactById,
//   createNewContact,
//   deleteContactById,
//   modifyContactById,
// };
