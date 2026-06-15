const jwt = require('jsonwebtoken');
const { findByEmail, findByUsername, createUser } = require('../repositories/userRepository');

// Cookie configuration — same settings used everywhere
const COOKIE_OPTIONS = {
  httpOnly: true,  
  secure: process.env.NODE_ENV === 'production', 
  sameSite: 'lax', 
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Helper: generate a signed JWT containing the user's ID
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// ===== REGISTER =====
// POST /api/auth/register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailExists = await findByEmail(email);
  if (emailExists) return res.status(400).json({ message: 'Email already in use' });

  const usernameExists = await findByUsername(username);
  if (usernameExists) return res.status(400).json({ message: 'Username already taken' });

  // Create user, password is hashed automatically by the pre-save hook
  const user = await createUser({ username, email, password });

  const token = generateToken(user._id);

  res.cookie('token', token, COOKIE_OPTIONS);

  // Return the safe user data (no token in body, no password)
  res.status(201).json({
    user: {
      id:       user._id,
      username: user.username,
      email:    user.email,
      name:     user.name,
      avatar:   user.avatar,
      phone:    user.phone,
    },
  });
};

// ===== LOGIN =====
// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = await findByEmail(email);
  // Same generic message for wrong email or wrong password — don't reveal which
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);

  res.cookie('token', token, COOKIE_OPTIONS);

  res.status(200).json({
    user: {
      id:       user._id,
      username: user.username,
      email:    user.email,
      name:     user.name,
      avatar:   user.avatar,
      phone:    user.phone,
    },
  });
};

// ===== LOGOUT =====
// POST /api/auth/logout
const logout = (req, res) => {
  res.cookie('token', '', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };