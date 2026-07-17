const TierModel = require('../models/tierModel');
const { validationResult } = require('express-validator');

const TierController = {
    index: async (req, res) => {
        try {
            await TierModel.seedDefaultTiers(); // Otomatis generate S+, S, A, B, C di awal

            const tiers = await TierModel.getTierListWithCharacters(); // Ambil tier & karakternya
            res.render('admin/tiers/index', { tiers, username: req.session.username });
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal memuat Tier List.');
        }
    },

    renderCreate: (req, res) => {
        res.render('admin/tiers/create', { errors: [], formData: {} });
    },

    store: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.render('admin/tiers/create', { errors: errors.array(), formData: req.body });
        
        try {
            await TierModel.create(req.body);
            res.redirect('/admin/tiers');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menyimpan Tier.');
        }
    },

    renderEdit: async (req, res) => {
        try {
            const tier = await TierModel.getById(req.params.id);
            if (!tier) return res.status(404).send('Tier tidak ditemukan.');
            res.render('admin/tiers/edit', { tier, errors: [] });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan.');
        }
    },

    update: async (req, res) => {
        const errors = validationResult(req);
        const tierId = req.params.id;
        
        if (!errors.isEmpty()) {
            const tier = await TierModel.getById(tierId);
            return res.render('admin/tiers/edit', { tier, errors: errors.array() });
        }
        
        try {
            await TierModel.update(tierId, req.body);
            res.redirect('/admin/tiers');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal memperbarui Tier.');
        }
    },

    delete: async (req, res) => {
        try {
            await TierModel.delete(req.params.id);
            res.redirect('/admin/tiers');
        } catch (error) {
            console.error(error);
            res.status(500).send('Gagal menghapus Tier.');
        }
    }
};

module.exports = TierController;