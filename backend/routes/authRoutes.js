import express from 'express';
import upload from '../middlewares/upload.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route GET /api/auth/public
 * @desc Public endpoint, accessible to everyone
 * @access Public
 */
router.get('/public', (req, res) => {
  res.json({ message: '✅ This is a public endpoint that does not require authentication.' });
});

/**
 * @route POST /api/auth/register
 * @desc Register a new user (with optional profile picture)
 * @access Public
 */
router.post('/register', (req, res, next) => {
  upload.single('profilePic')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }
    next();
  });
}, registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login', loginUser);

/**
 * @route GET /api/auth/admin/dashboard
 * @desc Admin Dashboard - Accessible only by Admin users
 * @access Private (Admin Only)
 */
router.get('/admin/dashboard', protectRoute(['Admin']), (req, res) => {
  res.json({
    message: '✅ Welcome to the Admin Dashboard',
    user: req.user,
  });
});

export default router;
