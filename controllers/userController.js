const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Încercare de înregistrare cu un email deja utilizat:", email); // Log în terminal
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    console.log("User înregistrat cu succes:", newUser.email); // Log în terminal
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription
      }
    });
  } catch (error) {
    console.error("Eroare la înregistrare:", error.message); // Log eroare în terminal
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Încercare de autentificare eșuată: email inexistent", email); // Log în terminal
      return res.status(401).json({ message: "Email sau parolă incorectă" });
    }

    // Compară parola
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Autentificare eșuată: parolă incorectă pentru email", email); // Log în terminal
      return res.status(401).json({ message: "Email sau parolă incorectă" });
    }

    // Generează token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Salvează token-ul în baza de date
    user.token = token;
    await user.save();

    console.log("Autentificare reușită. Token generat:", token); // Log în terminal
    res.json({ token, user });
  } catch (error) {
    console.error("Eroare la autentificare:", error.message); // Log eroare în terminal
    res.status(400).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      console.log("Încercare de deconectare fără a fi autentificat."); // Log în terminal
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    console.log("Deconectare reușită pentru user:", user.email); // Log în terminal
    res.status(204).send();
  } catch (error) {
    console.error("Eroare la deconectare:", error.message); // Log eroare în terminal
    res.status(401).json({ message: error.message });
  }
};

exports.currentUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    console.log("Încercare de acces fără autentificare."); // Log în terminal
    return res.status(401).json({ message: "Not authorized" });
  }

  console.log("Acces user curent:", user.email); // Log în terminal
  res.status(200).json({
    email: user.email,
    subscription: user.subscription
  });
};
