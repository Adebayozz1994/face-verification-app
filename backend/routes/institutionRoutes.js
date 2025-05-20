// routes/institutionRoutes.js
const express = require('express');
const router = express.Router();
const Institution = require('../models/Institution');
const { v4: uuidv4 } = require('uuid');


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const registrationLink = `http://localhost:5173/register/${uuidv4()}`;

  try {
    const existing = await Institution.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Institution with this email already exists.' });
    }

    const institution = new Institution({
      name,
      email,
      password,
      registrationLink,
    });

    await institution.save();
    res.status(201).json({ success: true, registrationLink });
  } catch (err) {
    res.status(500).json({ message: 'Error registering institution.', error: err.message });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required.' });

  try {
    const institution = await Institution.findOne({ email });
    if (!institution) return res.status(404).json({ message: 'Institution not found.' });

    const isMatch = await bcrypt.compare(password, institution.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    res.status(200).json({
      success: true,
      institution: {
        id: institution._id,
        name: institution.name,
        email: institution.email,
        registrationLink: institution.registrationLink,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error.', error: err.message });
  }
});

// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const institution = await Institution.findOne({ registrationLink: new RegExp(id, 'i') });
//     if (!institution) return res.status(404).json({ message: 'Institution not found.' });
//     res.json(institution);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching institution.', error: err.message });
//   }
// });


// router.post('/register/:linkId', async (req, res) => {
//     const { linkId } = req.params;
//     const { name, email, descriptor } = req.body;
  
//     const institution = await Institution.findOne({ registrationLink: new RegExp(linkId, 'i') });
//     if (!institution) return res.status(404).json({ message: 'Invalid institution link.' });
  
//     try {
//       const userExists = await User.findOne({ email });
//       if (userExists) return res.status(409).json({ message: 'User already exists.' });
  
//       const user = new User({ name, email, descriptor, institutionId: institution._id });
//       await user.save();
  
//       res.status(201).json({ success: true, message: 'User registered under institution.' });
//     } catch (err) {
//       res.status(500).json({ message: 'Error registering user.', error: err.message });
//     }
//   });

module.exports = router;
