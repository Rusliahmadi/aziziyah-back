const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Koneksi MySQL (gunakan env vars nanti)
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});


db.connect(err => {
  if (err) console.error('❌ DB Connection Error:', err);
  else console.log('✅ Connected to MySQL!');
});

app.get('/santri', (req, res) => {
  db.query('SELECT * FROM santri', (err, results) => {
    if (err) res.status(500).json(err);
    else res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
