const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Register student under admin link
router.post('/register/:linkId', async (req, res) => {
  const { linkId } = req.params;
  const { name, email, descriptor, admissionNo, department } = req.body;

  if (!name || !email || !descriptor || !admissionNo || !department) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const admin = await Admin.findOne({ registrationLink: new RegExp(linkId, 'i') });
    if (!admin) return res.status(404).json({ message: 'Invalid registration link.' });

    const studentExists = await Student.findOne({ email });
    if (studentExists) return res.status(409).json({ message: 'Student already exists.' });

    const student = new Student({
      name,
      email,
      descriptor,
      admissionNo,
      department,
      admin: admin._id
    });

    await student.save();
    admin.students.push(student._id);
    await admin.save();

    res.status(201).json({ success: true, message: 'Student registered under faculty.' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering student.', error: err.message });
  }
});

// Face verification
router.post('/verify', async (req, res) => {
  const { descriptor: liveDescriptor } = req.body;

  // Validate descriptor
  if (!Array.isArray(liveDescriptor) || liveDescriptor.length !== 128) {
    return res.status(400).json({ message: 'Invalid descriptor format.' });
  }

  try {
    const students = await Student.find({}, 'name email descriptor admissionNo department');

    let bestMatch = null;
    let minDistance = Infinity;

    students.forEach((student) => {
      const studentDescriptor = Array.isArray(student.descriptor)
        ? student.descriptor.map(Number)
        : [];

      const distance = euclideanDistance(studentDescriptor, liveDescriptor.map(Number));

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = student;
      }
    });

    if (minDistance < 0.5) {
      return res.json({ success: true, user: bestMatch }); // renamed to `user` for consistency
    } else {
      return res.json({ success: false, message: 'No face match found.' });
    }
  } catch (err) {
    console.error("Error verifying face:", err);
    return res.status(500).json({ message: 'Error verifying face.', error: err.message });
  }
});


// Get all student descriptors
router.get('/descriptors', async (req, res) => {
  try {
    const students = await Student.find({}, 'name email descriptor admissionNo department');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching descriptors.', error: err.message });
  }
});

// Get single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

function euclideanDistance(d1, d2) {
  let sum = 0;
  for (let i = 0; i < 128; i++) {
    const a = typeof d1[i] === 'number' ? d1[i] : parseFloat(d1[i]);
    const b = typeof d2[i] === 'number' ? d2[i] : parseFloat(d2[i]);
    sum += (a - b) ** 2;
  }
  return Math.sqrt(sum);
}


module.exports = router;
