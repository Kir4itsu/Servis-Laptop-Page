const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua artikel
router.get("/", (req, res) => {
  db.query("SELECT * FROM articles", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET artikel by ID
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM articles WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Artikel tidak ditemukan" });
    res.json(results[0]);
  });
});

// POST artikel (admin/expert only)
router.post("/", authMiddleware, (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "expert") {
    return res.status(403).json({ message: "Hanya admin/expert yang bisa menambahkan artikel" });
  }

  const { judul, konten } = req.body;
  db.query(
    "INSERT INTO articles (judul, konten, penulis_id) VALUES (?, ?, ?)",
    [judul, konten, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Artikel ditambahkan", id: result.insertId });
    }
  );
});

// UPDATE artikel
router.put("/:id", authMiddleware, (req, res) => {
  const { judul, konten } = req.body;
  db.query(
    "UPDATE articles SET judul=?, konten=? WHERE id=?",
    [judul, konten, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Artikel diperbarui" });
    }
  );
});

// DELETE artikel
router.delete("/:id", authMiddleware, (req, res) => {
  db.query("DELETE FROM articles WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Artikel dihapus" });
  });
});

module.exports = router;
