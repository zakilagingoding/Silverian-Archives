const CodexModel = require('../models/codexModel');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const CodexController = {
    index: async (req, res) => {
        try {
            await CodexModel.seedCategoriesIfEmpty(); // Memastikan ada kategori untuk dipilih

            const search = req.query.search || '';
            const page = parseInt(req.query.page) || 1;
            const limit = 5; 
            const offset = (page - 1) * limit;

            const codexEntries = await CodexModel.getAll(search, limit, offset);
            const totalData = await CodexModel.countAll(search);
            const totalPages = Math.ceil(totalData / limit);

            res.render('admin/codex/index', {
                codexEntries,
                search,
                page,
                totalPages,
                username: req.session.username
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan saat memuat data Codex.');
        }
    },

    renderCreate: async (req, res) => {
        try {
            const categories = await CodexModel.getAllCategories();
            res.render('admin/codex/create', { errors: [], formData: {}, categories });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan.');
        }
    },

    store: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../public/uploads/codex/', req.file.filename));
            }
            const categories = await CodexModel.getAllCategories();
            return res.render('admin/codex/create', { 
                errors: errors.array(), 
                formData: req.body,
                categories 
            });
        }

        try {
            const data = {
                category_id: req.body.category_id,
                title: req.body.title,
                content: req.body.content,
                image_url: req.file ? `/uploads/codex/${req.file.filename}` : null
            };

            await CodexModel.create(data);
            res.redirect('/admin/codex');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menyimpan arsip lore.');
        }
    },

    renderEdit: async (req, res) => {
        try {
            const codex = await CodexModel.getById(req.params.id);
            if (!codex) return res.status(404).send('Arsip lore tidak ditemukan.');
            
            const categories = await CodexModel.getAllCategories();
            res.render('admin/codex/edit', { codex, categories, errors: [] });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan.');
        }
    },

    update: async (req, res) => {
        const errors = validationResult(req);
        const codexId = req.params.id;

        if (!errors.isEmpty()) {
            if (req.file) fs.unlinkSync(path.join(__dirname, '../public/uploads/codex/', req.file.filename));
            const codex = await CodexModel.getById(codexId);
            const categories = await CodexModel.getAllCategories();
            return res.render('admin/codex/edit', { codex, categories, errors: errors.array() });
        }

        try {
            const oldCodex = await CodexModel.getById(codexId);
            let imageUrl = oldCodex.image_url;

            if (req.file) {
                imageUrl = `/uploads/codex/${req.file.filename}`;
                if (oldCodex.image_url) {
                    const oldImagePath = path.join(__dirname, '../public', oldCodex.image_url);
                    if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
                }
            }

            const data = {
                category_id: req.body.category_id,
                title: req.body.title,
                content: req.body.content,
                image_url: imageUrl
            };

            await CodexModel.update(codexId, data);
            res.redirect('/admin/codex');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal memperbarui arsip lore.');
        }
    },

    delete: async (req, res) => {
        try {
            const codex = await CodexModel.getById(req.params.id);
            if (codex && codex.image_url) {
                const imagePath = path.join(__dirname, '../public', codex.image_url);
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            }

            await CodexModel.delete(req.params.id);
            res.redirect('/admin/codex');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menghapus arsip lore.');
        }
    }
};

module.exports = CodexController;