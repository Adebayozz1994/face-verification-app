const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  descriptor: {
    type: [Number],
    required: true,
    unique: true,
  },

  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution', 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
