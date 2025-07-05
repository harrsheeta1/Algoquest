const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ username, email, password: hash });
    await newUser.save();
    res.json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: "User already exists or error saving" });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid email" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, user: { username: user.username, email: user.email } });
});

module.exports = router;
