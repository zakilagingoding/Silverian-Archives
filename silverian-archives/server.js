const app = require('./app.js');
const db = require('./config/database.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const connection = await db.getConnection();
        console.log('Database Connected');
        connection.release(); 

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Koneksi Database Gagal:', error.message);
        process.exit(1); 
    }
}

startServer();