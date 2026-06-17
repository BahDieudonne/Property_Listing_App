const { findById, updateUser, findByIdWithPassword } = require('../repositories/userRepository');

// GET /api/users/me
const getProfile = async (req, res) => {
  try {
    const user = await findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const updated = await updateUser(req.user._id, { name, phone, avatar });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// PUT /api/users/me/password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await findByIdWithPassword(req.user._id);
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) return res.status(401).json({ message: 'Old password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error changing password' });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
