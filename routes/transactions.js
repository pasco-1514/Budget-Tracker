const r = require('express').Router();
const Tx = require('../models/Transaction');
const { ensureLoggedIn } = require('../middleware/auth');

r.use(ensureLoggedIn);

// LIST
r.get('/', async (req,res) => {
  const txs = await Tx.find({ user:req.user.id }).sort('-date');
  res.json();

  try {
    const expenses = await Tx.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ success:true, data:txs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

});

// CREATE
r.post('/', async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, amount, description, date } = req.body;

  try {
    const t = new Tx({
      userId: req.user.userId,
      type,
      amount,
      description,
      date
    });

    await t.save();
    res.status(201).json({ success:true, data:t });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

});


// UPDATE
r.put('/:id', async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, amount, date, description } = req.body;

  try {
    const t = await Tx.findOne({ _id: req.params.id, user: req.user.id });
    if (!t) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (type) t.type = type;
    if (amount) t.amount = amount;
    if (date !== undefined) t.date = date;
    if (description !== undefined) t.description = description;

    await expense.save();
    res.json({ success:true, data:t });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

});


// DELETE
r.delete('/:id', async (req,res) => {
  try {
    const t = await Tx.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!t) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ success:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

});

module.exports = r;
