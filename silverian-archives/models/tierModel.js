 const db = require('../config/database');

const TierModel = {
    getAll: async () => {
        const [rows] = await db.execute('SELECT * FROM tiers ORDER BY id ASC');
        return rows;
    },
    
    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM tiers WHERE id = ?', [id]);
        return rows[0];
    },
    
    create: async (data) => {
        const [result] = await db.execute('INSERT INTO tiers (name, description) VALUES (?, ?)', [data.name, data.description]);
        return result;
    },
    
    update: async (id, data) => {
        const [result] = await db.execute('UPDATE tiers SET name = ?, description = ? WHERE id = ?', [data.name, data.description, id]);
        return result;
    },
    
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM tiers WHERE id = ?', [id]);
        return result;
    },

    // Fungsi cerdas untuk mengambil Tier sekaligus Karakter yang terhubung
    getTierListWithCharacters: async () => {
        const [tiers] = await db.execute('SELECT * FROM tiers ORDER BY id ASC');
        // Ambil karakter yang memiliki tier_id
        const [characters] = await db.execute('SELECT id, name, image_url, tier_id FROM characters WHERE tier_id IS NOT NULL');
        
        // Memasukkan array karakter ke dalam objek tier masing-masing
        tiers.forEach(tier => {
            tier.characters = characters.filter(char => char.tier_id === tier.id);
        });
        
        return tiers;
    },

    // Fungsi otomatis untuk membuat Tier S+, S, A, B, C jika database masih kosong
    seedDefaultTiers: async () => {
        const [rows] = await db.execute('SELECT COUNT(*) as total FROM tiers');
        if (rows[0].total === 0) {
            const defaults = [
                ['S+', 'Karakter meta absolut, wajib dimiliki, mendominasi permainan.'],
                ['S', 'Sangat kuat, unggul di hampir semua mode permainan.'],
                ['A', 'Kuat dan dapat diandalkan, pilihan yang sangat solid.'],
                ['B', 'Rata-rata, bisa digunakan namun butuh komposisi tim spesifik.'],
                ['C', 'Kurang optimal di meta saat ini, kalah saing dari yang lain.']
            ];
            for (let t of defaults) {
                await db.execute('INSERT INTO tiers (name, description) VALUES (?, ?)', t);
            }
        }
    }
};

module.exports = TierModel;