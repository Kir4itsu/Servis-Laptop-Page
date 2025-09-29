const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const JWT_SECRET = "";

// REGISTER
router.post("/register", (req, res) => {
  const { nama, email, password } = req.body;
  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Lengkapi data" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
    [nama, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Registrasi berhasil" });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(400).json({ message: "Email tidak ditemukan" });

    const user = results[0];
    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Password salah" });

    // Tambah poin harian
    const today = new Date().toISOString().split("T")[0];
    if (!user.last_login || user.last_login.toISOString().split("T")[0] !== today) {
      db.query(
        "UPDATE users SET points = points + 1, last_login = ? WHERE id = ?",
        [today, user.id]
      );
      user.points += 1; // update di response juga
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login berhasil",
      token,
      user: { id: user.id, nama: user.nama, role: user.role, points: user.points }
    });
  });
});


module.exports = router;
