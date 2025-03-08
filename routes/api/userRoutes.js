const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const authMiddleware = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const User = require('../../models/user'); 

const tmpDir = path.join(__dirname, '../../../tmp');
const avatarsDir = path.join(__dirname, '../../../public/avatars');

// Creăm folderele necesare dacă nu există
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
  console.log('✅ Folderul tmp a fost creat.');
}

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
  console.log('✅ Folderul avatars a fost creat.');
}

// Configurare Multer pentru testare cu stocare în memorie
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // Limită de 3MB
  fileFilter: (req, file, cb) => {
    console.log('📂 Tip fișier primit:', file ? file.mimetype : 'Niciun fișier!');
    if (!file) {
      return cb(new Error('Niciun fișier primit!'), false);
    }
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Tipul fișierului nu este acceptat!'), false);
    }
    cb(null, true);
  },
});

// Middleware pentru gestionarea erorilor Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('❌ Eroare Multer:', err.message);
    return res.status(400).json({ message: 'Eroare Multer: ' + err.message });
  } else if (err) {
    console.error('❌ Eroare încărcare fișier:', err.message);
    return res.status(400).json({ message: err.message });
  }
  next();
});

// ✅ Endpoint pentru actualizarea avatarului
router.patch('/avatars', authMiddleware.auth, upload.single('avatar'), async (req, res) => {
  try {
    console.log("✅ Proces început pentru actualizarea avatarului");

    // Verificăm ce primim din Postman
    console.log("📂 Body primit:", req.body);
    console.log("📂 Fișier primit:", req.file ? req.file.originalname : 'Niciun fișier');

    if (!req.file) {
      console.log('❌ Nu s-a încărcat niciun fișier!');
      return res.status(400).json({ message: 'Nu s-a încărcat niciun fișier!' });
    }

    const { buffer, originalname } = req.file;
    const newFilename = `${req.user.id}-${Date.now()}.jpg`;
    const targetPath = path.join(avatarsDir, newFilename);

    console.log('✅ Calea unde va fi salvat avatarul:', targetPath);

    // Procesare imagine cu Sharp
    try {
      await sharp(buffer)
        .resize(250, 250)
        .toFile(targetPath);
      console.log('✅ Imagine redimensionată și salvată cu succes:', targetPath);
    } catch (error) {
      console.error('❌ Eroare Sharp:', error.message);
      return res.status(500).json({ message: 'Eroare la procesarea imaginii' });
    }

    // Actualizăm avatarURL-ul utilizatorului în baza de date
    const avatarURL = `/avatars/${newFilename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { avatarURL }, { new: true });
    
    if (!user) {
      console.error("❌ Utilizatorul nu a fost găsit!");
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit!" });
    }

    console.log('✅ Avatar URL actualizat în baza de date:', avatarURL);
    res.json({ avatarURL });

  } catch (error) {
    console.error('❌ Eroare generală:', error.message);
    res.status(500).json({ message: 'Eroare la actualizarea avatarului' });
  }
});

// ✅ Endpoint-uri pentru autentificare
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/logout', authMiddleware.auth, userController.logout);
router.get('/current', authMiddleware.auth, userController.currentUser);

module.exports = router;
