// server.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET all santri aktif
app.get('/api/santri', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM santri WHERE status = "aktif"');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching santri', error: err.message });
  }
});

// GET santri by id
app.get('/api/santri/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM santri WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Santri not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching santri', error: err.message });
  }
});

// POST add new santri
app.post('/api/santri', async (req, res) => {
  const { nama, alias, jk, tgl_lahir, wali, alamat, tgl_masuk, kelas_utama, kelas_extra, kelompok } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO santri (nama, alias, jk, tgl_lahir, wali, alamat, tgl_masuk, kelas_utama, kelas_extra, kelompok, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'aktif')`,
      [nama, alias, jk, tgl_lahir, wali, alamat, tgl_masuk, kelas_utama, kelas_extra, kelompok]
    );
    res.status(201).json({ id: result.insertId, message: 'Santri created' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding santri', error: err.message });
  }
});

// PUT update santri
app.put('/api/santri/:id', async (req, res) => {
  const id = req.params.id;
  const { nama, alias, jk, tgl_lahir, wali, alamat, tgl_masuk, kelas_utama, kelas_extra, kelompok, status } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE santri SET nama=?, alias=?, jk=?, tgl_lahir=?, wali=?, alamat=?, tgl_masuk=?, kelas_utama=?, kelas_extra=?, kelompok=?, status=? WHERE id=?`,
      [nama, alias, jk, tgl_lahir, wali, alamat, tgl_masuk, kelas_utama, kelas_extra, kelompok, status || 'aktif', id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Santri not found' });
    res.json({ message: 'Santri updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating santri', error: err.message });
  }
});

// DELETE santri (soft delete)
app.delete('/api/santri/:id', async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE santri SET status="nonaktif" WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Santri not found' });
    res.json({ message: 'Santri deleted (status set to nonaktif)' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting santri', error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

