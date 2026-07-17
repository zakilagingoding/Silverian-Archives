const db = require('../config/database');

const MechanicModel = {
    getAll: async (search, limit, offset) => {
        let query = `
            SELECT gm.*, u.username as author_name 
            FROM game_mechanics gm
            LEFT JOIN users u ON gm.author_id = u.id
        `;
        let params = [];

        if (search) {
            query += ' WHERE gm.title LIKE ?';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY gm.id DESC LIMIT ? OFFSET ?';
        params.push(Number(limit), Number(offset));

        const [rows] = await db.query(query, params);
        return rows;
    },

    countAll: async (search) => {
        let query = 'SELECT COUNT(*) as total FROM game_mechanics';
        let params = [];

        if (search) {
            query += ' WHERE title LIKE ?';
            params.push(`%${search}%`);
        }

        const [rows] = await db.query(query, params);
        return rows[0].total;
    },

    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM game_mechanics WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const { author_id, title, content, thumbnail_url, youtube_url, tips, faq } = data;
        const [result] = await db.execute(
            'INSERT INTO game_mechanics (author_id, title, content, thumbnail_url, youtube_url, tips, faq) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [author_id, title, content, thumbnail_url, youtube_url, tips, faq]
        );
        return result;
    },

    update: async (id, data) => {
        const { title, content, thumbnail_url, youtube_url, tips, faq } = data;
        const [result] = await db.execute(
            'UPDATE game_mechanics SET title = ?, content = ?, thumbnail_url = ?, youtube_url = ?, tips = ?, faq = ? WHERE id = ?',
            [title, content, thumbnail_url, youtube_url, tips, faq, id]
        );
        return result;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM game_mechanics WHERE id = ?', [id]);
        return result;
    }
};

module.exports = MechanicModel;