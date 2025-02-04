const {
  getAllContacts,
  findContactById,
  createNewContact,
  deleteContactById,
  modifyContactById,
} = require('../models/contacts');

const listContacts = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json(contacts);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await findContactById(id);
  if (!contact) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json(contact);
};

const addContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await createNewContact({ name, email, phone });
  res.status(201).json(newContact);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteContactById(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json({ message: 'contact deleted' });
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedContact = await modifyContactById(id, updates);
  if (!updatedContact) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.status(200).json(updatedContact);
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};


