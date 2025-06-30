// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Register Admin
router.post('/register', async (req, res) => {
  const { name, email, password, faculty } = req.body;

  if (!name || !email || !password || !faculty) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const registrationLink = `https://face-verification-app-neon.vercel.app/register/${uuidv4()}`;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Admin with this email already exists.' });
    }

    const admin = new Admin({
      name,
      email,
      password,
      faculty,
      registrationLink,
    });

    await admin.save();
    res.status(201).json({ success: true, registrationLink });
  } catch (err) {
    res.status(500).json({ message: 'Error registering admin.', error: err.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required.' });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        faculty: admin.faculty,
        registrationLink: admin.registrationLink,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error.', error: err.message });
  }
});

// Admin Dashboard
router.get('/dashboard/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .select('-password')
      .populate('students', 'name email matricNo department admissionNo'); // populate student info

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard.', error: err.message });
  }
});

module.exports = router;

