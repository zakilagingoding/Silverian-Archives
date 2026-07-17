const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Rute GET untuk menampilkan halaman
router.get('/login', AuthController.renderLogin);
router.get('/register', AuthController.renderRegister);

// Rute POST untuk memproses form
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

router.get('/logout', AuthController.logout);

module.exports = router;