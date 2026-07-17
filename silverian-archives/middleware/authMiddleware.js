const AuthMiddleware = {
    isLogin: (req, res, next) => {
        if (req.session.userId) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    },
    
    isAdmin: (req, res, next) => {
        if (req.session.userId && req.session.role === 'Admin') {
            next();
        } else {
            res.status(403).send('Akses Ditolak: Membutuhkan Otorisasi Level Admin.');
        }
    }
};

module.exports = AuthMiddleware;