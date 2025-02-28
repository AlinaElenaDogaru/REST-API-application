const Contact = require("../models/contactModel");

//  Obține toate contactele
const listContacts = async () => {
  return await Contact.find();
};

//  Obține un contact după ID
const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

//  Adaugă un nou contact
const addContact = async (contactData) => {
  return await Contact.create(contactData);
};

//  Șterge un contact
const removeContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

//  Actualizează un contact
const updateContact = async (contactId, updateData) => {
  return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
};

//  Actualizează doar câmpul "favorite"
const updateStatusContact = async (contactId, favorite) => {
  return await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
