const jwt      = require('jsonwebtoken');
const { findById } = require('../repositories/userRepository');

const protect = async (req, res, next) => {
  // Read the token from the cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the actual user from the database to ensure they still exist
    req.user = await findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Token is valid — pass control to the route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };