const db = require('../config/database');

const AdminController = {
    getDashboardStats: async (req, res) => {
        try {
            // Melakukan query paralel menggunakan Promise.all agar loading lebih cepat
            const [
                [userResult],
                [charResult],
                [reviewResult],
                [loreResult],
                [mechanicsResult],
                [newsResult]
            ] = await Promise.all([
                db.execute('SELECT COUNT(*) as total FROM users'),
                db.execute('SELECT COUNT(*) as total FROM characters'),
                db.execute('SELECT COUNT(*) as total FROM reviews'),
                db.execute('SELECT COUNT(*) as total FROM codex_entries'),
                db.execute('SELECT COUNT(*) as total FROM game_mechanics'),
                db.execute('SELECT COUNT(*) as total FROM news')
            ]);

            // Mengirim data hasil perhitungan ke file view EJS
            res.render('admin/dashboard', {
                username: req.session.username,
                stats: {
                    users: userResult[0].total,
                    characters: charResult[0].total,
                    reviews: reviewResult[0].total,
                    lore: loreResult[0].total,
                    mechanics: mechanicsResult[0].total,
                    news: newsResult[0].total
                }
            });
        } catch (error) {
            console.error('Error memuat data dashboard:', error);
            res.status(500).send('Terjadi kesalahan pada server internal.');
        }
    }
};

module.exports = AdminController;