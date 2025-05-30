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



// In /api/users/register
const Institution = require('../models/Institution');

router.post('/register/:linkId', async (req, res) => {
  const { linkId } = req.params;
  const { name, email, descriptor } = req.body;

  const institution = await Institution.findOne({ registrationLink: new RegExp(linkId, 'i') });
  if (!institution) return res.status(404).json({ message: 'Invalid institution link.' });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: 'User already exists.' });

  const user = new User({ name, email, descriptor, institution: institution._id });
    await user.save();

      institution.users.push(user._id);
    await institution.save();

    res.status(201).json({ success: true, message: 'User registered under institution.' });
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

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); 
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
