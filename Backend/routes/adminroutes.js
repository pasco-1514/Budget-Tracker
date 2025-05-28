// routes/adminRoutes.js
/*const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminmiddleware');

router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.put('/users/:id/promote', protect, adminOnly, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true });
  res.json(user);
});

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;*/
// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminmiddleware');

// ✅ Render admin dashboard page
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.render('adminDashboard');
});

// ✅ Get all users (excluding passwords)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// ✅ Promote user to admin
router.put('/users/:id/make-admin', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = true;
    await user.save();
    res.json({ message: 'User promoted to admin' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to promote user' });
  }
});

// ✅ Delete user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;

