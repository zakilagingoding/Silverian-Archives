const db = require('../config/database');

const UserModel = {
    createUser: async (username, email, password) => {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, 'User']
        );
        return result;
    },
    
    getUserByEmail: async (email) => {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0]; // Mengembalikan object user atau undefined
    }
};

module.exports = UserModel;