const r = require('express').Router();
const Bud = require('../models/budget.js');
const { ensureLoggedIn } = require('../middleware/auth');

r.use(ensureLoggedIn);

r.get('/', async (req,res) => {
  const b = await Bud.find({ user:req.user.id });
  res.json({ success:true, data:b });
});
r.post('/', async (req,res) => {
  const {category,limit} = req.body;
  const bud = await new Bud({ user:req.user.id,category,limit }).save();
  res.json({ success:true, data:bud });
});

module.exports = r;
