const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua post
router.get("/", (req, res) => {
  db.query("SELECT posts.*, users.nama FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
});

// BUAT post
router.post("/", authMiddleware, (req, res) => {
  const { konten } = req.body;
  db.query("INSERT INTO posts (user_id, konten) VALUES (?, ?)",
    [req.user.id, konten],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Post berhasil dibuat", id: result.insertId });
    });
});

// GET komentar by post_id
router.get("/:id/comments", (req, res) => {
  db.query(
    "SELECT comments.*, users.nama FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = ? ORDER BY created_at ASC",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// BUAT komentar
router.post("/:id/comments", authMiddleware, (req, res) => {
  const { konten } = req.body;
  db.query(
    "INSERT INTO comments (post_id, user_id, konten) VALUES (?, ?, ?)",
    [req.params.id, req.user.id, konten],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Komentar ditambahkan", id: result.insertId });
    }
  );
});

module.exports = router;
