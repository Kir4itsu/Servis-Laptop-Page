const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua konsultasi (admin/expert only)
router.get("/", authMiddleware, (req, res) => {
  if (req.user.role === "user") {
    return res.status(403).json({ message: "Hanya admin/expert yang bisa melihat semua konsultasi" });
  }

  db.query("SELECT * FROM consultations", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET konsultasi user sendiri
router.get("/my", authMiddleware, (req, res) => {
  db.query("SELECT * FROM consultations WHERE user_id=?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST pertanyaan (user)
router.post("/", authMiddleware, (req, res) => {
  const { pertanyaan } = req.body;
  db.query(
    "INSERT INTO consultations (user_id, pertanyaan) VALUES (?, ?)",
    [req.user.id, pertanyaan],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Pertanyaan dikirim", id: result.insertId });
    }
  );
});

// PUT jawab pertanyaan (expert/admin)
router.put("/:id", authMiddleware, (req, res) => {
  if (req.user.role !== "expert" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Hanya expert/admin yang bisa menjawab" });
  }

  const { jawaban } = req.body;
  db.query(
    "UPDATE consultations SET jawaban=?, expert_id=?, status='answered' WHERE id=?",
    [jawaban, req.user.id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Pertanyaan dijawab" });
    }
  );
});

module.exports = router;
