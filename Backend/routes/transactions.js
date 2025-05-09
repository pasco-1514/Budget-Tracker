const r = require('express').Router();
const Tx = require('../models/Transaction');
const { ensureLoggedIn } = require('../middleware/auth');

r.use(ensureLoggedIn);

// LIST
r.get('/', async (req,res) => {
  const txs = await Tx.find({ user:req.user.id }).sort('-date');
  res.json({ success:true, data:txs });
});
// CREATE
r.post('/', async (req,res) => {
  const { type,amount,description } = req.body;
  const t = await new Tx({ user:req.user.id,type,amount,description }).save();
  res.json({ success:true, data:t });
});
// UPDATE
r.put('/:id', async (req,res) => {
  const t = await Tx.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json({ success:true, data:t });
});
// DELETE
r.delete('/:id', async (req,res) => {
  await Tx.findByIdAndDelete(req.params.id);
  res.json({ success:true });
});

module.exports = r;
