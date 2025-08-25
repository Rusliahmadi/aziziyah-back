require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Koneksi ke database
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});

db.connect(err => {
  if (err) {
    console.error('❌ DB Connection Error:', err);
  } else {
    console.log('✅ Connected to MySQL!');
  }
});

// 📁 Endpoint: Ambil semua santri
app.get('/api/santri', (req, res) => {
  db.query('SELECT * FROM santri', (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Gagal mengambil data santri' });
    }
    res.json(results);
  });
});

// 🚀 Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});

