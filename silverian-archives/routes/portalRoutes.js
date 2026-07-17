const express = require('express');
const router = express.Router();
const PortalController = require('../controllers/portalController');
const AuthMiddleware = require('../middleware/authMiddleware');

// 1. Rute Publik (Home & Detail)
router.get('/', PortalController.renderHome);
router.get('/character/:id', PortalController.showCharacterDetail);
router.get('/news/:id', PortalController.showNewsDetail);

// 2. Rute Aksi Review (Wajib Login)
router.post('/review/:charId', AuthMiddleware.isLogin, PortalController.submitReview);
router.post('/review/edit/:reviewId', AuthMiddleware.isLogin, PortalController.updateReview);
router.post('/review/delete/:reviewId', AuthMiddleware.isLogin, PortalController.deleteReview);
router.post('/review/like/:reviewId', AuthMiddleware.isLogin, PortalController.toggleLike);
router.post('/review/comment/:reviewId', AuthMiddleware.isLogin, PortalController.addComment);

module.exports = router;