const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config(); // Asigură-te că env este încărcat

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("🚀 Token primit:", token);
    if (!token) {
      return res.status(401).json({ message: "Not authorized - no token" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ EROARE: JWT_SECRET nu este setat în .env!");
      return res.status(500).json({ message: "Eroare server - JWT_SECRET lipsă" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 Payload-ul token-ului decodat:", decodedToken);

    const { userId } = decodedToken;
    console.log("🆔 User ID din token:", userId);

    let user;
    try {
      user = await User.findById(userId);
      console.log("👤 User găsit:", user ? user.email : "❌ Utilizator inexistent");
    } catch (err) {
      console.error("❌ Eroare MongoDB:", err);
      return res.status(500).json({ message: "Eroare server" });
    }

    if (!user || user.token !== token) {
      console.log("❌ Token invalid sau user inexistent");
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Eroare JWT:", error.message);
    res.status(401).json({ message: "Not authorized" });
  }
};
