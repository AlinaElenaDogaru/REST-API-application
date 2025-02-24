const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contactsService");

//  Obține toate contactele
router.get("/", async (req, res) => {
  const contacts = await listContacts();
  res.json(contacts);
});

//  Obține un contact după ID
router.get("/:contactId", async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
});

//  Adaugă un nou contact
router.post("/", async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

//  Șterge un contact
router.delete("/:contactId", async (req, res) => {
  const deletedContact = await removeContact(req.params.contactId);
  if (!deletedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({ message: "Contact deleted" });
});

//  Actualizează un contact
router.put("/:contactId", async (req, res) => {
  const updatedContact = await updateContact(req.params.contactId, req.body);
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(updatedContact);
});

// Actualizează doar câmpul "favorite"
router.patch("/:contactId/favorite", async (req, res) => {
  if (req.body.favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const updatedContact = await updateStatusContact(req.params.contactId, req.body.favorite);
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(updatedContact);
});

module.exports = router;
