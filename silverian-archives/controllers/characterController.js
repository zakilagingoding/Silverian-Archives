const CharacterModel = require('../models/characterModel');
const TierModel = require('../models/tierModel'); // Import Model Tier
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const CharacterController = {
    index: async (req, res) => {
        try {
            const search = req.query.search || '';
            const page = parseInt(req.query.page) || 1;
            const limit = 5; 
            const offset = (page - 1) * limit;

            const characters = await CharacterModel.getAll(search, limit, offset);
            const totalData = await CharacterModel.countAll(search);
            const totalPages = Math.ceil(totalData / limit);

            res.render('admin/characters/index', {
                characters,
                search,
                page,
                totalPages,
                username: req.session.username
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan saat memuat data karakter.');
        }
    },

    renderCreate: async (req, res) => {
        try {
            const tiers = await TierModel.getAll(); // Ambil list tier
            res.render('admin/characters/create', { errors: [], formData: {}, tiers });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan memuat form create.');
        }
    },

    store: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../public/uploads/characters/', req.file.filename));
            }
            const tiers = await TierModel.getAll(); // Mengirim ulang data tier jika validasi gagal
            return res.render('admin/characters/create', { 
                errors: errors.array(), 
                formData: req.body,
                tiers
            });
        }

        try {
            const data = {
                tier_id: req.body.tier_id || null, // Menangkap input tier_id
                name: req.body.name,
                element: req.body.element,
                description: req.body.description,
                lore_background: req.body.lore_background,
                image_url: req.file ? `/uploads/characters/${req.file.filename}` : null
            };

            await CharacterModel.create(data);
            res.redirect('/admin/characters');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menyimpan karakter.');
        }
    },

    renderEdit: async (req, res) => {
        try {
            const character = await CharacterModel.getById(req.params.id);
            if (!character) return res.status(404).send('Karakter tidak ditemukan.');
            
            const tiers = await TierModel.getAll(); // Ambil list tier
            res.render('admin/characters/edit', { character, errors: [], tiers });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan memuat form edit.');
        }
    },

    update: async (req, res) => {
        const errors = validationResult(req);
        const characterId = req.params.id;

        if (!errors.isEmpty()) {
            if (req.file) fs.unlinkSync(path.join(__dirname, '../public/uploads/characters/', req.file.filename));
            const character = await CharacterModel.getById(characterId);
            const tiers = await TierModel.getAll(); // Mengirim ulang data tier jika validasi gagal
            return res.render('admin/characters/edit', { character, errors: errors.array(), tiers });
        }

        try {
            const oldCharacter = await CharacterModel.getById(characterId);
            let imageUrl = oldCharacter.image_url;

            if (req.file) {
                imageUrl = `/uploads/characters/${req.file.filename}`;
                if (oldCharacter.image_url) {
                    const oldImagePath = path.join(__dirname, '../public', oldCharacter.image_url);
                    if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
                }
            }

            const data = {
                tier_id: req.body.tier_id || null, // Menangkap update tier_id
                name: req.body.name,
                element: req.body.element,
                description: req.body.description,
                lore_background: req.body.lore_background,
                image_url: imageUrl
            };

            await CharacterModel.update(characterId, data);
            res.redirect('/admin/characters');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal memperbarui karakter.');
        }
    },

    delete: async (req, res) => {
        try {
            const character = await CharacterModel.getById(req.params.id);
            if (character && character.image_url) {
                const imagePath = path.join(__dirname, '../public', character.image_url);
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            }

            await CharacterModel.delete(req.params.id);
            res.redirect('/admin/characters');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menghapus karakter.');
        }
    }
};

module.exports = CharacterController;