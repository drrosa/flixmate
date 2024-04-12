const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
  },
  (async (accessToken, refreshToken, profile, cb) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) return cb(null, user);
      user = await User.create({
        name: profile.displayName,
        googleId: profile.id,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
      });
      user.thumbsUp.push({ name: 'My Movies', description: 'All liked movies.' });
      user.toWatch.push({ name: 'To Watch', description: 'All recommendations.' });
      await user.save();
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }),
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (userId, cb) => {
  cb(null, await User.findById(userId));
});
