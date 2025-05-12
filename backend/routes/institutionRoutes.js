// routes/institutionRoutes.js
const express = require('express');
const router = express.Router();
const Institution = require('../models/Institution');
const { v4: uuidv4 } = require('uuid');

router.post('/register', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'All fields are required.' });

  const registrationLink = `http://localhost:5173/register/${uuidv4()}`;

  try {
    const institution = new Institution({ name, email, registrationLink });
    await institution.save();
    res.status(201).json({ success: true, registrationLink });
  } catch (err) {
    res.status(500).json({ message: 'Error registering institution.', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const institution = await Institution.findOne({ registrationLink: new RegExp(id, 'i') });
    if (!institution) return res.status(404).json({ message: 'Institution not found.' });
    res.json(institution);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching institution.', error: err.message });
  }
});


router.post('/register/:linkId', async (req, res) => {
    const { linkId } = req.params;
    const { name, email, descriptor } = req.body;
  
    const institution = await Institution.findOne({ registrationLink: new RegExp(linkId, 'i') });
    if (!institution) return res.status(404).json({ message: 'Invalid institution link.' });
  
    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(409).json({ message: 'User already exists.' });
  
      const user = new User({ name, email, descriptor, institutionId: institution._id });
      await user.save();
  
      res.status(201).json({ success: true, message: 'User registered under institution.' });
    } catch (err) {
      res.status(500).json({ message: 'Error registering user.', error: err.message });
    }
  });

module.exports = router;
