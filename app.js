const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("./models/db"); 
const contactsRouter = require("./routes/api/contactsRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = app;


