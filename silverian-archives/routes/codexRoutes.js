const express = require('express');
const router = express.Router();
const CodexController = require('../controllers/codexController');
const uploadCodex = require('../middleware/uploadCodexMiddleware');
const AuthMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Aturan Validasi
const codexValidation = [
    body('title').notEmpty().withMessage('Judul arsip lore tidak boleh kosong.'),
    body('category_id').notEmpty().withMessage('Kategori harus dipilih.'),
    body('content').isLength({ min: 20 }).withMessage('Konten cerita minimal 20 karakter.')
];

// Semua rute di bawah ini wajib Admin
router.use(AuthMiddleware.isLogin, AuthMiddleware.isAdmin);

// CRUD Routes
router.get('/', CodexController.index);
router.get('/create', CodexController.renderCreate);
router.post('/create', uploadCodex.single('image'), codexValidation, CodexController.store);
router.get('/edit/:id', CodexController.renderEdit);
router.post('/edit/:id', uploadCodex.single('image'), codexValidation, CodexController.update);
router.post('/delete/:id', CodexController.delete);

module.exports = router;