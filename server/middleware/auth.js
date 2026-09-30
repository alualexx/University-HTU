const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'httu-holy-trinity-theology-secret-key-2026';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.findById('users', decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'User is inactive or not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Insufficient privileges' });
    }
    next();
  };
}

module.exports = {
  authenticate,
  authorize,
  JWT_SECRET
};
