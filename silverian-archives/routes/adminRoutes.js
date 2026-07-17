const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middleware/authMiddleware');
const AdminController = require('../controllers/adminController');

// Rute Dashboard Admin yang dilindungi middleware dan ditangani oleh Controller
router.get('/dashboard', AuthMiddleware.isLogin, AuthMiddleware.isAdmin, AdminController.getDashboardStats);

module.exports = router;