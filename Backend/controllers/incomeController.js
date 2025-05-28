const Income = require('../models/Income');

// ✅ Add Income
exports.addIncomeData = async (req, res) => {
  try {
    const { source, amount, date, category, description } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const income = await Income.create({
      userId: req.user._id,
      source,
      amount,
      date,
      category,
      description
    });

    res.status(201).json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding income' });
  }
};

// ✅ Get All Income
exports.getAllIncome = async (req, res) => {
  try {
    const incomeList = await Income.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(incomeList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch income list' });
  }
};

// ✅ Update Income
exports.updateIncome = async (req, res) => {
  try {
    const updated = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating income' });
  }
};

// ✅ Delete Income
exports.deleteIncome = async (req, res) => {
  try {
    const removed = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.status(200).json(removed);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting income' });
  }
};
