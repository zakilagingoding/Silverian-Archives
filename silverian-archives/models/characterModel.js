const db = require('../config/database');

const CharacterModel = {
    getAll: async (search, limit, offset) => {
        let query = 'SELECT * FROM characters';
        let params = [];

        if (search) {
            query += ' WHERE name LIKE ? OR element LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(Number(limit), Number(offset));

        const [rows] = await db.query(query, params);
        return rows;
    },

    countAll: async (search) => {
        let query = 'SELECT COUNT(*) as total FROM characters';
        let params = [];

        if (search) {
            query += ' WHERE name LIKE ? OR element LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [rows] = await db.query(query, params);
        return rows[0].total;
    },

    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM characters WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const { tier_id, name, element, description, lore_background, image_url } = data;
        const [result] = await db.execute(
            'INSERT INTO characters (tier_id, name, element, description, lore_background, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [tier_id || null, name, element, description, lore_background, image_url]
        );
        return result;
    },

    update: async (id, data) => {
        const { tier_id, name, element, description, lore_background, image_url } = data;
        const [result] = await db.execute(
            'UPDATE characters SET tier_id = ?, name = ?, element = ?, description = ?, lore_background = ?, image_url = ? WHERE id = ?',
            [tier_id || null, name, element, description, lore_background, image_url, id]
        );
        return result;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM characters WHERE id = ?', [id]);
        return result;
    }
};

module.exports = CharacterModel;