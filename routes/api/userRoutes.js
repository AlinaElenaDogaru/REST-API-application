const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController'); 
const authMiddleware = require('../../middleware/auth'); 

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/logout', authMiddleware.auth, userController.logout);
router.get('/current', authMiddleware.auth, userController.currentUser);

module.exports = router;
