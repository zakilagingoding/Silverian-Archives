const express = require('express');
const router = express.Router();
const CharacterController = require('../controllers/characterController');
const upload = require('../middleware/uploadMiddleware');
const AuthMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Aturan Validasi
const characterValidation = [
    body('name').notEmpty().withMessage('Nama karakter tidak boleh kosong.'),
    body('element').notEmpty().withMessage('Elemen tidak boleh kosong.'),
    body('description').isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter.')
];

// Semua rute di bawah ini wajib Admin
router.use(AuthMiddleware.isLogin, AuthMiddleware.isAdmin);

// Read (Index dengan Pagination & Search)
router.get('/', CharacterController.index);

// Create
router.get('/create', CharacterController.renderCreate);
router.post('/create', upload.single('image'), characterValidation, CharacterController.store);

// Update
router.get('/edit/:id', CharacterController.renderEdit);
router.post('/edit/:id', upload.single('image'), characterValidation, CharacterController.update);

// Delete
router.post('/delete/:id', CharacterController.delete);

module.exports = router;