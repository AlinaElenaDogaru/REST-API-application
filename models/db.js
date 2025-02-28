require("dotenv").config(); // Importăm dotenv pentru a citi variabilele de mediu
const mongoose = require("mongoose");

const DB_URI = process.env.MONGO_URI; // Luăm URL-ul din .env

if (!DB_URI) {
  console.error("Missing MONGO_URI in .env file");
  process.exit(1);
}

mongoose.connect(DB_URI)
  .then(() => console.log("✅ Database connection successful"))
  .catch(error => {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  });

module.exports = mongoose;
