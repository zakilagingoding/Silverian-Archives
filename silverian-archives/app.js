const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'silverian_archives_super_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

// Mengimpor semua file routing
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const characterRoutes = require('./routes/characterRoutes');
const codexRoutes = require('./routes/codexRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');
const tierRoutes = require('./routes/tierRoutes');
const portalRoutes = require('./routes/portalRoutes'); // Rute Publik & Home
const newsRoutes = require('./routes/newsRoutes');

// Mendaftarkan Routing ke Express
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes); 
app.use('/admin/characters', characterRoutes);
app.use('/admin/codex', codexRoutes);
app.use('/admin/mechanics', mechanicRoutes);
app.use('/admin/tiers', tierRoutes);
app.use('/admin/news', newsRoutes);

// Portal Publik berada di root URL
app.use('/', portalRoutes); 

module.exports = app;