const db = require('../config/database');

const CodexModel = {
    getAll: async (search, limit, offset) => {
        let query = `
            SELECT ce.*, cc.name as category_name 
            FROM codex_entries ce
            LEFT JOIN codex_categories cc ON ce.category_id = cc.id
        `;
        let params = [];

        if (search) {
            query += ' WHERE ce.title LIKE ? OR cc.name LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY ce.id DESC LIMIT ? OFFSET ?';
        params.push(Number(limit), Number(offset));

        const [rows] = await db.query(query, params);
        return rows;
    },

    countAll: async (search) => {
        let query = `
            SELECT COUNT(*) as total 
            FROM codex_entries ce
            LEFT JOIN codex_categories cc ON ce.category_id = cc.id
        `;
        let params = [];

        if (search) {
            query += ' WHERE ce.title LIKE ? OR cc.name LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [rows] = await db.query(query, params);
        return rows[0].total;
    },

    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM codex_entries WHERE id = ?', [id]);
        return rows[0];
    },

    getAllCategories: async () => {
        const [rows] = await db.execute('SELECT * FROM codex_categories ORDER BY name ASC');
        return rows;
    },

    create: async (data) => {
        const { category_id, title, content, image_url } = data;
        const [result] = await db.execute(
            'INSERT INTO codex_entries (category_id, title, content, image_url) VALUES (?, ?, ?, ?)',
            [category_id, title, content, image_url]
        );
        return result;
    },

    update: async (id, data) => {
        const { category_id, title, content, image_url } = data;
        const [result] = await db.execute(
            'UPDATE codex_entries SET category_id = ?, title = ?, content = ?, image_url = ? WHERE id = ?',
            [category_id, title, content, image_url, id]
        );
        return result;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM codex_entries WHERE id = ?', [id]);
        return result;
    },

    // Fitur bantuan: Mengisi kategori default jika admin belum pernah membuat kategori sama sekali
    seedCategoriesIfEmpty: async () => {
        const [rows] = await db.execute('SELECT COUNT(*) as total FROM codex_categories');
        if (rows[0].total === 0) {
            await db.execute("INSERT INTO codex_categories (name, description) VALUES ('Ancient History', 'Arsip sejarah kuno'), ('Factions', 'Informasi faksi dan organisasi'), ('World Geography', 'Lokasi dan area'), ('Magic Systems', 'Hukum sihir dan energi')");
        }
    }
};

module.exports = CodexModel;