const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['client', 'worker'],
    default: 'client',
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  // Additional fields for workers
  workerProfile: {
    services: [{
      type: String,
      enum: ['electrician', 'plumber', 'carpenter', 'painter']
    }],
    skills: [String],
    experience: Number, // in years
    hourlyRate: Number,
    availability: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 