const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Face Verification App!');
});
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const institutionRoutes = require('./routes/institutionRoutes');
app.use('/api/institutions', institutionRoutes);


// Database Connection
const URI = process.env.MONGO_URI;
mongoose.connect(URI)
  .then(() => console.log('Connected to database successfully'))
  .catch((err) => console.error('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
