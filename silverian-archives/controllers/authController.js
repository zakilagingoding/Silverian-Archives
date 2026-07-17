const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const AuthController = {
    renderLogin: (req, res) => {
        if (req.session.userId) return res.redirect('/');
        res.render('auth/login', { error: null });
    },

    renderRegister: (req, res) => {
        if (req.session.userId) return res.redirect('/');
        res.render('auth/register', { error: null });
    },

    register: async (req, res) => {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('auth/register', { error: 'Otorisasi Gagal: Password tidak cocok.' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await UserModel.createUser(username, email, hashedPassword);
            res.redirect('/auth/login');
        } catch (error) {
            console.error(error);
            res.render('auth/register', { error: 'Otorisasi Gagal: Email atau Username sudah terdaftar.' });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await UserModel.getUserByEmail(email);

            if (!user) {
                return res.render('auth/login', { error: 'Kredensial tidak ditemukan di arsip.' });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.render('auth/login', { error: 'Kunci enkripsi (Password) salah.' });
            }

            // Inisialisasi Sesi User
            req.session.userId = user.id;
            req.session.role = user.role;
            req.session.username = user.username;

            // Logika Redirect Berdasarkan Role
            if (user.role === 'Admin') {
                res.redirect('/admin/dashboard'); 
            } else {
                res.redirect('/');
            }
        } catch (error) {
            console.error(error);
            res.render('auth/login', { error: 'Terjadi kesalahan sistem internal.' });
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error('Error saat logout:', err);
            res.redirect('/auth/login');
        });
    }
};

module.exports = AuthController;