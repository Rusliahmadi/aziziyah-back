const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API endpoints
app.get('/api/santri', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM santri');
  res.json(rows);
});

app.get('/api/materi', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM materi');
  res.json(rows);
});

app.get('/api/rekap-materi', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM rekap_materi');
  res.json(rows);
});

app.get('/api/absen', async (req, res) => {
  const { kelas, sesi, dari, sampai } = req.query;
  let q = 'SELECT * FROM absen WHERE tanggal BETWEEN ? AND ?';
  const params = [dari, sampai];
  if (kelas) { q += ' AND kelas = ?'; params.push(kelas); }
  if (sesi) { q += ' AND sesi = ?'; params.push(sesi); }
  const [rows] = await db.query(q, params);
  res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API berjalan di http://localhost:${PORT}`));
