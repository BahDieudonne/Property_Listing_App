const { findById, updateUser, findByIdWithPassword } = require('../repositories/userRepository');

// ===== GET PROFILE =====
// GET /api/users/me
const getProfile = async (req, res) => {
  const user = await findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json(user);
};

// ===== UPDATE PROFILE =====
// PUT /api/users/me
const updateProfile = async (req, res) => {
  const { name, phone, avatar } = req.body;

  const updated = await updateUser(req.user._id, { name, phone, avatar });
  res.status(200).json(updated);
};

// ===== CHANGE PASSWORD =====
// PUT /api/users/me/password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Both passwords are required' });
  }

  // Enforce minimum length on the new password
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  const user = await findByIdWithPassword(req.user._id);

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) return res.status(401).json({ message: 'Old password is incorrect' });

  // Set the new password 
  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
};

module.exports = { getProfile, updateProfile, changePassword };