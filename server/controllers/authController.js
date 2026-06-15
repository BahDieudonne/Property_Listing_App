const jwt = require('jsonwebtoken');
const { findByEmail, findByUsername, createUser } = require('../repositories/userRepository');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailExists = await findByEmail(email);
  if (emailExists) return res.status(400).json({ message: 'Email already in use' });

  const usernameExists = await findByUsername(username);
  if (usernameExists) return res.status(400).json({ message: 'Username already taken' });

  const user = await createUser({ username, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: { id: user._id, username: user.username, email: user.email, name: user.name, avatar: user.avatar },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = await findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);
  res.status(200).json({
    token,
    user: { id: user._id, username: user.username, email: user.email, name: user.name, avatar: user.avatar },
  });
};

module.exports = { register, login };