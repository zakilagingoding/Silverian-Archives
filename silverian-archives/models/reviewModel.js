const db = require('../config/database');

const ReviewModel = {
    // Mengambil semua review berserta komentar dan jumlah like-nya
    getReviewsByCharacter: async (characterId, currentUserId = null) => {
        const [reviews] = await db.execute(`
            SELECT r.*, u.username, u.role 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.character_id = ? 
            ORDER BY r.created_at DESC
        `, [characterId]);

        // Looping untuk menempelkan data Like dan Komentar ke masing-masing Review
        for (let review of reviews) {
            // 1. Hitung total like
            const [likes] = await db.execute('SELECT COUNT(*) as total FROM review_likes WHERE review_id = ?', [review.id]);
            review.likes_count = likes[0].total;

            // 2. Cek apakah user yang sedang login sudah me-like review ini
            if (currentUserId) {
                const [userLike] = await db.execute('SELECT id FROM review_likes WHERE review_id = ? AND user_id = ?', [review.id, currentUserId]);
                review.user_has_liked = userLike.length > 0;
            } else {
                review.user_has_liked = false;
            }

            // 3. Ambil semua komentar untuk review ini
            const [comments] = await db.execute(`
                SELECT c.*, u.username, u.role 
                FROM review_comments c 
                JOIN users u ON c.user_id = u.id 
                WHERE c.review_id = ? 
                ORDER BY c.created_at ASC
            `, [review.id]);
            review.comments = comments;
        }

        return reviews;
    },

    // Fitur: Hitung Rata-rata Rating Otomatis
    getAverageRating: async (characterId) => {
        const [result] = await db.execute('SELECT AVG(rating) as avg_rating, COUNT(id) as total_reviews FROM reviews WHERE character_id = ?', [characterId]);
        return {
            average: result[0].avg_rating ? parseFloat(result[0].avg_rating).toFixed(1) : 0,
            total: result[0].total_reviews
        };
    },

    // CRUD Review Utama
    createReview: async (characterId, userId, rating, content) => {
        const [result] = await db.execute(
            'INSERT INTO reviews (character_id, user_id, rating, content) VALUES (?, ?, ?, ?)',
            [characterId, userId, rating, content]
        );
        return result;
    },

    updateReview: async (reviewId, userId, content, rating) => {
        // Memastikan hanya pemilik review yang bisa edit
        const [result] = await db.execute(
            'UPDATE reviews SET content = ?, rating = ? WHERE id = ? AND user_id = ?',
            [content, rating, reviewId, userId]
        );
        return result;
    },

    deleteReview: async (reviewId, userId) => {
        // Memastikan hanya pemilik review yang bisa hapus
        const [result] = await db.execute('DELETE FROM reviews WHERE id = ? AND user_id = ?', [reviewId, userId]);
        return result;
    },

    // Fitur Like
    toggleLike: async (reviewId, userId) => {
        const [existing] = await db.execute('SELECT id FROM review_likes WHERE review_id = ? AND user_id = ?', [reviewId, userId]);
        if (existing.length > 0) {
            await db.execute('DELETE FROM review_likes WHERE review_id = ? AND user_id = ?', [reviewId, userId]);
            return 'unliked';
        } else {
            await db.execute('INSERT INTO review_likes (review_id, user_id) VALUES (?, ?)', [reviewId, userId]);
            return 'liked';
        }
    },

    // Fitur Komentar
    addComment: async (reviewId, userId, content) => {
        const [result] = await db.execute(
            'INSERT INTO review_comments (review_id, user_id, content) VALUES (?, ?, ?)',
            [reviewId, userId, content]
        );
        return result;
    }
};

module.exports = ReviewModel;