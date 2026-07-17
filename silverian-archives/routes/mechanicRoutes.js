const express = require('express');
const router = express.Router();
const MechanicController = require('../controllers/mechanicController');
const uploadMechanics = require('../middleware/uploadMechanicsMiddleware');
const AuthMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Aturan Validasi
const mechanicValidation = [
    body('title').notEmpty().withMessage('Judul panduan mekanik tidak boleh kosong.'),
    body('content').notEmpty().withMessage('Tutorial utama harus diisi.')
];

// Proteksi Rute (Wajib Admin)
router.use(AuthMiddleware.isLogin, AuthMiddleware.isAdmin);

// CRUD Routes
router.get('/', MechanicController.index);
router.get('/create', MechanicController.renderCreate);
router.post('/create', uploadMechanics.single('thumbnail'), mechanicValidation, MechanicController.store);
router.get('/edit/:id', MechanicController.renderEdit);
router.post('/edit/:id', uploadMechanics.single('thumbnail'), mechanicValidation, MechanicController.update);
router.post('/delete/:id', MechanicController.delete);

module.exports = router;