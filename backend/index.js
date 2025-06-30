const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://face-verification-app-neon.vercel.app'],
  credentials: true,
}));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Face Verification App!');
});

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use routes
app.use('/api/students', studentRoutes);
app.use('/api/admins', adminRoutes);

// MongoDB connection
const URI = process.env.MONGO_URI;
mongoose.connect(URI)
  .then(() => console.log('✅ Connected to database successfully'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT: ${PORT}`);
});
