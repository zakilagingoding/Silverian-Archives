const db = require('./config/database');
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        // Cek apakah email admin sudah ada di database
        const [existingUser] = await db.execute(
            'SELECT * FROM users WHERE email = ?', 
            ['zaki@silverianarchives.com']
        );

        if (existingUser.length > 0) {
            console.log('⚠️ Akun Administrator sudah ada di database.');
            process.exit(0);
        }

        // Hash password menggunakan bcrypt
        const hashedPassword = await bcrypt.hash('Silver@Palace', 10);

        // Masukkan data admin ke database
        // Catatan: Sesuai struktur tabel Tahap 4, tidak ada kolom 'name', 
        // sehingga 'Administrator' kita wakilkan pada role dan username.
        await db.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'zaki@silverianarchives.com', hashedPassword, 'Admin']
        );
        
        console.log('✅ Akun Default Administrator berhasil dibuat!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Terjadi kesalahan saat membuat admin:', error);
        process.exit(1);
    }
}

createAdmin();