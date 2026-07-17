const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/newsController');

// Daftar Rute CRUD Berita (Pastikan nama fungsinya sama persis)
router.get('/', NewsController.index);
router.get('/create', NewsController.create);
router.post('/store', NewsController.store);
router.get('/edit/:id', NewsController.edit);
router.post('/update/:id', NewsController.update);
router.post('/delete/:id', NewsController.delete);

module.exports = router;