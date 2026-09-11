const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return done(null, false, { message: 'Invalid email or password' });
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Invalid email or password' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) return done(null, user);

      user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });
      if (user) {
        user.googleId = profile.id;
        user.avatar = profile.photos[0]?.value;
        await user.save();
        return done(null, user);
      }

      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value.toLowerCase(),
        name: profile.displayName,
        avatar: profile.photos[0]?.value
      });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;
