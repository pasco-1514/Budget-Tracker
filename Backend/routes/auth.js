const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const { ensureLoggedOut, ensureLoggedIn } = require('../middleware/auth');

// REGISTER
router.post('/register', ensureLoggedOut, async (req,res) => {
  const {name,email,password} = req.body;
  const exists = await User.findOne({email});
  if (exists) return res.status(400).json({success:false, message:'Email in use'});
  const hash = await bcrypt.hash(password,10);
  await new User({ name, email, password:hash }).save();
  res.json({ success:true });
});

// LOGIN
router.post('/login', ensureLoggedOut,
  passport.authenticate('local'),
  (req,res) => res.json({ success:true, user:req.user.name })
);

// LOGOUT
router.get('/logout', ensureLoggedIn, (req,res) => {
  req.logout(()=>{
    res.json({ success:true });
  });
});

module.exports = router;
