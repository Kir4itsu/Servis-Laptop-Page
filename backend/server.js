const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const artikelRoutes = require('./routes/artikel');
const konsultasiRoutes = require('./routes/konsultasi');
const postRoutes = require('./routes/post');

// Gunakan routes
app.use('/api/auth', authRoutes);
app.use('/api/artikel', artikelRoutes);
app.use('/api/konsultasi', konsultasiRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API berjalan!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
