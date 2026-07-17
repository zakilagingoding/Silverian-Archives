const MechanicModel = require('../models/mechanicModel');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Helper untuk mengubah URL YouTube biasa menjadi Embed URL
function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url; 
}

const MechanicController = {
    index: async (req, res) => {
        try {
            const search = req.query.search || '';
            const page = parseInt(req.query.page) || 1;
            const limit = 5; 
            const offset = (page - 1) * limit;

            const mechanics = await MechanicModel.getAll(search, limit, offset);
            const totalData = await MechanicModel.countAll(search);
            const totalPages = Math.ceil(totalData / limit);

            res.render('admin/mechanics/index', {
                mechanics,
                search,
                page,
                totalPages,
                username: req.session.username
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan saat memuat data Mechanics.');
        }
    },

    renderCreate: (req, res) => {
        res.render('admin/mechanics/create', { errors: [], formData: {} });
    },

    store: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../public/uploads/mechanics/', req.file.filename));
            }
            return res.render('admin/mechanics/create', { errors: errors.array(), formData: req.body });
        }

        try {
            const data = {
                author_id: req.session.userId,
                title: req.body.title,
                content: req.body.content, // Ini digunakan sebagai Tutorial Utama
                tips: req.body.tips,
                faq: req.body.faq,
                youtube_url: getYouTubeEmbedUrl(req.body.youtube_url),
                thumbnail_url: req.file ? `/uploads/mechanics/${req.file.filename}` : null
            };

            await MechanicModel.create(data);
            res.redirect('/admin/mechanics');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menyimpan panduan mekanik.');
        }
    },

    renderEdit: async (req, res) => {
        try {
            const mechanic = await MechanicModel.getById(req.params.id);
            if (!mechanic) return res.status(404).send('Panduan tidak ditemukan.');
            
            res.render('admin/mechanics/edit', { mechanic, errors: [] });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan.');
        }
    },

    update: async (req, res) => {
        const errors = validationResult(req);
        const mechanicId = req.params.id;

        if (!errors.isEmpty()) {
            if (req.file) fs.unlinkSync(path.join(__dirname, '../public/uploads/mechanics/', req.file.filename));
            const mechanic = await MechanicModel.getById(mechanicId);
            return res.render('admin/mechanics/edit', { mechanic, errors: errors.array() });
        }

        try {
            const oldMechanic = await MechanicModel.getById(mechanicId);
            let thumbnailUrl = oldMechanic.thumbnail_url;

            if (req.file) {
                thumbnailUrl = `/uploads/mechanics/${req.file.filename}`;
                if (oldMechanic.thumbnail_url) {
                    const oldImagePath = path.join(__dirname, '../public', oldMechanic.thumbnail_url);
                    if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
                }
            }

            const data = {
                title: req.body.title,
                content: req.body.content,
                tips: req.body.tips,
                faq: req.body.faq,
                youtube_url: getYouTubeEmbedUrl(req.body.youtube_url),
                thumbnail_url: thumbnailUrl
            };

            await MechanicModel.update(mechanicId, data);
            res.redirect('/admin/mechanics');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal memperbarui panduan mekanik.');
        }
    },

    delete: async (req, res) => {
        try {
            const mechanic = await MechanicModel.getById(req.params.id);
            if (mechanic && mechanic.thumbnail_url) {
                const imagePath = path.join(__dirname, '../public', mechanic.thumbnail_url);
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            }

            await MechanicModel.delete(req.params.id);
            res.redirect('/admin/mechanics');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menghapus panduan mekanik.');
        }
    }
};

module.exports = MechanicController;