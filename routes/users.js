const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const admin = require('firebase-admin');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register new user
router.post('/register',
  [
    body('email').isEmail(),
    body('fullName').notEmpty(),
    body('role').isIn(['client', 'worker']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, fullName, role, phoneNumber, address } = req.body;

      // Create user in Firebase
      const firebaseUser = await admin.auth().createUser({
        email,
        password: req.body.password,
        displayName: fullName,
      });

      // Create user in MongoDB
      const user = new User({
        firebaseUid: firebaseUser.uid,
        email,
        fullName,
        role,
        phoneNumber,
        address,
      });

      await user.save();
      res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, phoneNumber, address } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { 
        $set: { 
          fullName,
          phoneNumber,
          address,
          ...(req.body.workerProfile && { workerProfile: req.body.workerProfile })
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Get all workers
router.get('/workers', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' });
    res.json(workers);
  } catch (error) {
    console.error('Workers fetch error:', error);
    res.status(500).json({ error: 'Error fetching workers' });
  }
});

// Get worker by ID
router.get('/workers/:id', async (req, res) => {
  try {
    const worker = await User.findOne({ _id: req.params.id, role: 'worker' });
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    console.error('Worker fetch error:', error);
    res.status(500).json({ error: 'Error fetching worker' });
  }
});

module.exports = router; 