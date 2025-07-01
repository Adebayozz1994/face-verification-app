const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admissionNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  department: {
    type: String,
    enum: ['Computer Science', 'Mathematics', 'Physics', 'Geology'],
    required: true,
  },
  descriptor: { type: [Number], required: true, unique: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
