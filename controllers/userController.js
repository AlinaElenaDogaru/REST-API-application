const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');

// Configurare SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Funcție pentru înregistrare utilizator
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Încercare de înregistrare cu un email deja utilizat:", email); // Log în terminal
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4(); // Generează un token unic

    const newUser = await User.create({
      email,
      password: hashedPassword,
      verificationToken, // Adăugăm token-ul pentru verificare
      verify: false, // Implicit email-ul nu este verificat
    });

    console.log("User înregistrat cu succes:", newUser.email); // Log în terminal

    // Trimitem email-ul de verificare
    const verificationLink = `${process.env.BASE_URL}/verify/${verificationToken}`;
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: 'Verify your email',
      text: `Please verify your email by clicking on the following link: ${verificationLink}`,
      html: `<p>Please verify your email by clicking on the following link:</p><a href="${verificationLink}">${verificationLink}</a>`,
    };

    await sgMail.send(msg);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
      message: "User registered. Please check your email for verification link.",
    });
  } catch (error) {
    console.error("Eroare la înregistrare:", error.message); // Log eroare în terminal
    res.status(400).json({ message: error.message });
  }
};

// Funcție pentru verificarea email-ului
exports.verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verificationToken = null; // Ștergem token-ul după verificare
    user.verify = true; // Setăm email-ul ca verificat
    await user.save();

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Eroare la verificarea email-ului:", error.message); // Log eroare în terminal
    res.status(400).json({ message: error.message });
  }
};

// Funcție pentru retrimiterea email-ului de verificare
exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res.status(400).json({ message: "Verification has already been passed" });
    }

    // Retrimiterea email-ului de verificare
    const verificationLink = `${process.env.BASE_URL}/verify/${user.verificationToken}`;
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: 'Verify your email',
      text: `Please verify your email by clicking on the following link: ${verificationLink}`,
      html: `<p>Please verify your email by clicking on the following link:</p><a href="${verificationLink}">${verificationLink}</a>`,
    };

    await sgMail.send(msg);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Eroare la retrimiterea email-ului:", error.message); // Log eroare în terminal
    res.status(400).json({ message: error.message });
  }
};

// Funcție pentru autentificare
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email sau parolă incorectă" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email sau parolă incorectă" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    user.token = token;
    await user.save();

    res.json({ token, user });
  } catch (error) {
    console.error("Eroare la autentificare:", error.message); // Log eroare în terminal
    res.status(400).json({ message: error.message });
  }
};

// Funcție pentru deconectare
exports.logout = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error("Eroare la deconectare:", error.message); // Log eroare în terminal
    res.status(401).json({ message: error.message });
  }
};

// Obținerea utilizatorului curent
exports.currentUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.status(200).json({
    email: user.email,
    subscription: user.subscription
  });
};
