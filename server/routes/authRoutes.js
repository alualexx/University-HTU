const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  const username = req.body.username || req.body.email;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username or email and password required' });
  }

  const user = db.findOne('users', u => 
    u.username.toLowerCase() === username.toLowerCase() || 
    u.email.toLowerCase() === username.toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Exclude password hash from response
  const { password_hash, ...safeUser } = user;

  res.json({
    token,
    user: safeUser,
    institution: "Ethiopia Holy Trinity Theology University (HTTU)"
  });
});

// GET /api/v1/auth/me
router.get('/me', authenticate, (req, res) => {
  const { password_hash, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// GET /api/v1/auth/demo-users (helpful for instant portal preview)
router.get('/demo-users', (req, res) => {
  const users = db.find('users').map(u => ({
    username: u.username,
    role: u.role,
    name: u.full_name,
    amharic_name: u.amharic_name,
    password: u.username === 'admin' ? 'admin123' : 'password123'
  }));
  res.json({ demo_accounts: users });
});

module.exports = router;
