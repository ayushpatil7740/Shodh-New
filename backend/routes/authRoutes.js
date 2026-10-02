const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { googleCallback } = require('../controllers/oauthController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Standard Authentication Routes
router.post('/register', upload.single('avatar'), validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

// Google OAuth 2.0 Routes
router.get('/google', (req, res, next) => {
  if (!passport._strategies || !passport._strategies.google) {
    return res.status(503).json({
      success: false,
      message:
        'Google OAuth 2.0 is not configured yet. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your backend .env file.',
    });
  }
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
});

router.get(
  '/google/callback',
  (req, res, next) => {
    if (!passport._strategies || !passport._strategies.google) {
      return res.redirect('/login?error=' + encodeURIComponent('Google OAuth not configured in backend'));
    }
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/login?error=' + encodeURIComponent('Google authentication failed or was cancelled'),
    })(req, res, next);
  },
  googleCallback
);

module.exports = router;
