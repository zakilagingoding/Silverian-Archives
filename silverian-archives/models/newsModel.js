const db = require('../config/database');

const NewsModel = {
    getAll: async (search, limit, offset) => {
        let query = `
            SELECT n.*, u.username as author_name 
            FROM news n
            LEFT JOIN users u ON n.author_id = u.id
        `;
        let params = [];

        if (search) {
            query += ' WHERE n.title LIKE ? OR n.content LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY n.id DESC LIMIT ? OFFSET ?';
        params.push(Number(limit), Number(offset));

        const [rows] = await db.query(query, params);
        return rows;
    },

    countAll: async (search) => {
        let query = 'SELECT COUNT(*) as total FROM news n';
        let params = [];

        if (search) {
            query += ' WHERE n.title LIKE ? OR n.content LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [rows] = await db.query(query, params);
        return rows[0].total;
    },

    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM news WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (data) => {
        const { author_id, title, content, banner_url } = data;
        const [result] = await db.execute(
            'INSERT INTO news (author_id, title, content, banner_url) VALUES (?, ?, ?, ?)',
            [author_id, title, content, banner_url]
        );
        return result;
    },

    update: async (id, data) => {
        const { title, content, banner_url } = data;
        const [result] = await db.execute(
            'UPDATE news SET title = ?, content = ?, banner_url = ? WHERE id = ?',
            [title, content, banner_url, id]
        );
        return result;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM news WHERE id = ?', [id]);
        return result;
    }
};

module.exports = NewsModel;