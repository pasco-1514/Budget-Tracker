const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');

module.exports = passport => {
  passport.use(new LocalStrategy({ usernameField:'email' },
    async (email, pwd, done) => {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message:'No user' });
      const ok = await bcrypt.compare(pwd, user.password);
      if (!ok) return done(null, false, { message:'Bad password' });
      return done(null, user);
    }
  ));
  passport.serializeUser((u,done)=> done(null,u.id));
  passport.deserializeUser(async (id,done)=> done(null, await User.findById(id)));
};
