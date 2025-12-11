const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const gamesRouter = require('./routes/games');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected successfully');
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err);
    process.exit(1);
  });

// Routes
app.use('/api/games', gamesRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  Listening on http://localhost:${PORT}
  
  `);
});

module.exports = app;
