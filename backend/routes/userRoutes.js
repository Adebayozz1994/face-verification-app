const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register user
router.post('/register', async (req, res) => {
  const { name, email, descriptor } = req.body;

  if (!name || !email || !descriptor) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: 'User already exists.' });

    const user = new User({ name, email, descriptor });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user.', error: err.message });
  }
});

// Face verification
router.post('/verify', async (req, res) => {
  const { descriptor: liveDescriptor } = req.body;

  try {
    const users = await User.find();

    let bestMatch = null;
    let minDistance = Infinity;

    users.forEach((user) => {
      const distance = euclideanDistance(user.descriptor, liveDescriptor);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = user;
      }
    });

    if (minDistance < 0.5) {
      res.json({ success: true, user: bestMatch });
    } else {
      res.json({ success: false, message: 'No face match found.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error verifying face.', error: err.message });
  }
});

// Get all users with descriptors
router.get('/descriptors', async (req, res) => {
    try {
      const users = await User.find({}, 'name email descriptor');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching descriptors.', error: err.message });
    }
  });
  

function euclideanDistance(d1, d2) {
  let sum = 0;
  for (let i = 0; i < d1.length; i++) {
    sum += (d1[i] - d2[i]) ** 2;
  }
  return Math.sqrt(sum);
}

module.exports = router;
