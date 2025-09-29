const jwt = require("jsonwebtoken");
const JWT_SECRET = ""; // ganti dengan env kalau serius

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Token tidak ada" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid" });
  }
}

module.exports = authMiddleware;
