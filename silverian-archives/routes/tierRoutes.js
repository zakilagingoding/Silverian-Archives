const express = require('express');
const router = express.Router();
const TierController = require('../controllers/tierController');
const AuthMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Aturan Validasi
const tierValidation = [
    body('name').notEmpty().withMessage('Nama Tier (Misal: S+) tidak boleh kosong.'),
    body('description').notEmpty().withMessage('Alasan/Deskripsi Tier harus diisi.')
];

// Wajib Login sebagai Admin
router.use(AuthMiddleware.isLogin, AuthMiddleware.isAdmin);

// CRUD Routes
router.get('/', TierController.index);
router.get('/create', TierController.renderCreate);
router.post('/create', tierValidation, TierController.store);
router.get('/edit/:id', TierController.renderEdit);
router.post('/edit/:id', tierValidation, TierController.update);
router.post('/delete/:id', TierController.delete);

module.exports = router;