const NewsModel = require('../models/newsModel');

const NewsController = {
    index: async (req, res) => {
        try {
            const search = req.query.search || '';
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;

            const news = await NewsModel.getAll(search, limit, offset);
            const totalNews = await NewsModel.countAll(search);
            const totalPages = Math.ceil(totalNews / limit);

            res.render('admin/news/index', { 
                news, 
                search, 
                page, 
                totalPages,
                username: req.session ? req.session.username : 'Admin'
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan saat memuat data berita.');
        }
    },

    create: (req, res) => {
        res.render('admin/news/create');
    },

    store: async (req, res) => {
        try {
            const { title, content, banner_url } = req.body;
            const author_id = (req.session && req.session.userId) ? req.session.userId : 1; 

            await NewsModel.create({ author_id, title, content, banner_url });
            res.redirect('/admin/news');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menyimpan berita.');
        }
    },

    edit: async (req, res) => {
        try {
            const news = await NewsModel.getById(req.params.id);
            if (!news) return res.status(404).send('Berita tidak ditemukan');
            res.render('admin/news/edit', { news });
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal memuat form edit.');
        }
    },

    update: async (req, res) => {
        try {
            const { title, content, banner_url } = req.body;
            await NewsModel.update(req.params.id, { title, content, banner_url });
            res.redirect('/admin/news');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal mengupdate berita.');
        }
    },

    delete: async (req, res) => {
        try {
            await NewsModel.delete(req.params.id);
            res.redirect('/admin/news');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menghapus berita.');
        }
    }
};

// BARIS INI SANGAT PENTING. JIKA TERTINGGAL, SERVER AKAN CRASH.
module.exports = NewsController;