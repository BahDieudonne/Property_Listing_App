const jwt = require('jsonwebtoken');
const { findByEmail, findByUsername, createUser } = require('../repositories/userRepository');

// Helper function to generate a signed JWT token containing the user's ID
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// ===== REGISTER =====
// POST /api/auth/register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate that all required fields were provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if email is already registered to prevent duplicates
  const emailExists = await findByEmail(email);
  if (emailExists) return res.status(400).json({ message: 'Email already in use' });

  // Check if username is already taken
  const usernameExists = await findByUsername(username);
  if (usernameExists) return res.status(400).json({ message: 'Username already taken' });

  // Create the user and hash the password 
  const user = await createUser({ username, email, password });

  const token = generateToken(user._id);

  // Return 201 Created with the token and safe user data 
  res.status(201).json({
    token,
    user: {
      id:       user._id,
      username: user.username,
      email:    user.email,
      name:     user.name,
      avatar:   user.avatar,
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

  // Return the same generic message whether email or password is wrong
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Compare the provided password against the stored bcrypt hash
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Generate a JWT for the authenticated user
  const token = generateToken(user._id);

  // Return 200 OK with the token and safe user data
  res.status(200).json({
    token,
    user: {
      id:       user._id,
      username: user.username,
      email:    user.email,
      name:     user.name,
      avatar:   user.avatar,
    },
  });
};

module.exports = { register, login };