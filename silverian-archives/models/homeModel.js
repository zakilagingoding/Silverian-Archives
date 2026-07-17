const db = require('../config/database');

const HomeModel = {
    getFeaturedCharacters: async () => {
        const [rows] = await db.execute('SELECT id, name, element, image_url, description FROM characters ORDER BY id DESC LIMIT 4');
        return rows;
    },
    
    getLatestNews: async () => {
        const [rows] = await db.execute('SELECT id, title, banner_url, created_at FROM news ORDER BY id DESC LIMIT 3');
        return rows;
    },
    
    getLatestMechanics: async () => {
        const [rows] = await db.execute('SELECT id, title, thumbnail_url FROM game_mechanics ORDER BY id DESC LIMIT 3');
        return rows;
    },
    
    getLatestCodex: async () => {
        const [rows] = await db.execute('SELECT ce.id, ce.title, ce.image_url, cc.name as category_name FROM codex_entries ce LEFT JOIN codex_categories cc ON ce.category_id = cc.id ORDER BY ce.id DESC LIMIT 3');
        return rows;
    },
    
    getLatestReviews: async () => {
        const [rows] = await db.execute(`
            SELECT r.rating, r.content, u.username, c.id as char_id, c.name as char_name, c.image_url as char_image 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN characters c ON r.character_id = c.id
            ORDER BY r.created_at DESC LIMIT 3
        `);
        return rows;
    },
    
    getTierPreview: async () => {
        // Ambil 3 tier teratas (misal: S+, S, A)
        const [tiers] = await db.execute('SELECT id, name, description FROM tiers ORDER BY id ASC LIMIT 3');
        const [characters] = await db.execute('SELECT id, name, image_url, tier_id FROM characters WHERE tier_id IS NOT NULL');
        
        // Masukkan karakter ke dalam tier-nya masing-masing (maksimal 5 karakter per tier agar rapi)
        tiers.forEach(tier => {
            tier.characters = characters.filter(char => char.tier_id === tier.id).slice(0, 5);
        });
        return tiers;
    }
};

module.exports = HomeModel;