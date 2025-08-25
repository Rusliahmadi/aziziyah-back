const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE (POST)
router.post('/', (req, res) => {
  const {
    nama,
    alias,
    jk,
    tgl_lahir,
    wali,
    alamat,
    tgl_masuk,
    status
  } = req.body;

  const sql = `
    INSERT INTO santri 
    (nama, alias, jk, tgl_lahir, wali, alamat, tgl_masuk, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nama, alias, jk, tgl_lahir, wali, alamat, tgl_masuk, status], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal menyimpan data' });
    }
    res.status(201).json({ message: 'Data berhasil disimpan', id: result.insertId });
  });
});

module.exports = router;
