const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL =
  process.env.GOOGLE_CALLBACK_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://shodh-portal.onrender.com/api/auth/google/callback'
    : 'http://localhost:5000/api/auth/google/callback');

if (clientID && clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = (profile.emails && profile.emails[0]?.value || '').toLowerCase().trim();
          const name =
            profile.displayName ||
            `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() ||
            'Google User';
          const avatar = (profile.photos && profile.photos[0]?.value) || '';

          if (!email) {
            return done(new Error('No email found in Google account profile'), null);
          }

          // Check if user already exists
          let user = await User.findOne({ email });

          if (user) {
            // Existing user: link Google ID and avatar if missing
            let updated = false;
            if (!user.googleId && profile.id) {
              user.googleId = profile.id;
              updated = true;
            }
            if (!user.avatar && avatar) {
              user.avatar = avatar;
              updated = true;
            }
            if (updated) {
              try {
                await user.save();
              } catch (_) {}
            }
            return done(null, user);
          }

          // New user: auto-create User document with Google profile data and authProvider: 'google'
          user = await User.create({
            name,
            email,
            avatar,
            role: 'user',
            phone: '',
            bio: 'Signed in via Google',
            googleId: profile.id,
            authProvider: 'google',
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth 2.0 (Passport.js) initialized successfully.');
} else {
  console.log('ℹ️ Google OAuth: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set in .env (OAuth routes ready in standby mode).');
}

module.exports = passport;
