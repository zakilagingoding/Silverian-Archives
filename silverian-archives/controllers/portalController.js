const CharacterModel = require('../models/characterModel');
const ReviewModel = require('../models/reviewModel');
const HomeModel = require('../models/homeModel');
const NewsModel = require('../models/newsModel');

const PortalController = {
    // Menampilkan Halaman Home Publik
    renderHome: async (req, res) => {
        try {
            // Menjalankan semua query secara paralel untuk kecepatan maksimal
            const [characters, news, mechanics, codex, reviews, tiers] = await Promise.all([
                HomeModel.getFeaturedCharacters(),
                HomeModel.getLatestNews(),
                HomeModel.getLatestMechanics(),
                HomeModel.getLatestCodex(),
                HomeModel.getLatestReviews(),
                HomeModel.getTierPreview()
            ]);

            res.render('portal/home', {
                characters,
                news,
                mechanics,
                codex,
                reviews,
                tiers,
                session: req.session
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan saat memuat Halaman Utama.');
        }
    },

    // Menampilkan Halaman Detail Karakter Publik & Reviews
    showCharacterDetail: async (req, res) => {
        try {
            const charId = req.params.id;
            const currentUserId = req.session.userId || null;

            const character = await CharacterModel.getById(charId);
            if (!character) return res.status(404).send('Karakter tidak ditemukan di arsip.');

            const reviews = await ReviewModel.getReviewsByCharacter(charId, currentUserId);
            const ratingData = await ReviewModel.getAverageRating(charId);

            res.render('portal/character_detail', { character, reviews, ratingData, session: req.session });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan internal.');
        }
    },

    // Menampilkan Detail Berita Publik (INI YANG BARU DITAMBAHKAN)
    showNewsDetail: async (req, res) => {
        try {
            const news = await NewsModel.getById(req.params.id);
            if (!news) return res.status(404).send('Berita tidak ditemukan.');
            res.render('portal/news_detail', { news, session: req.session });
        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan internal membaca berita.');
        }
    },

    // ==================== REVIEW ACTIONS ====================
    submitReview: async (req, res) => {
        try {
            await ReviewModel.createReview(req.params.charId, req.session.userId, req.body.rating, req.body.content);
            res.redirect(`/character/${req.params.charId}`);
        } catch (error) { console.error(error); res.status(500).send('Gagal mengirim review.'); }
    },
    updateReview: async (req, res) => {
        try {
            await ReviewModel.updateReview(req.params.reviewId, req.session.userId, req.body.content, req.body.rating);
            res.redirect(`/character/${req.body.charId}`);
        } catch (error) { console.error(error); res.status(500).send('Gagal mengedit review.'); }
    },
    deleteReview: async (req, res) => {
        try {
            await ReviewModel.deleteReview(req.params.reviewId, req.session.userId);
            res.redirect(`/character/${req.body.charId}`);
        } catch (error) { console.error(error); res.status(500).send('Gagal menghapus review.'); }
    },
    toggleLike: async (req, res) => {
        try {
            await ReviewModel.toggleLike(req.params.reviewId, req.session.userId);
            res.redirect(`/character/${req.body.charId}`);
        } catch (error) { console.error(error); res.status(500).send('Gagal memproses like.'); }
    },
    addComment: async (req, res) => {
        try {
            await ReviewModel.addComment(req.params.reviewId, req.session.userId, req.body.content);
            res.redirect(`/character/${req.body.charId}`);
        } catch (error) { console.error(error); res.status(500).send('Gagal mengirim komentar.'); }
    }
};

module.exports = PortalController;