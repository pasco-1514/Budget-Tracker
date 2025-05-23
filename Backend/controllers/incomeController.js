const Income = require('../models/Income');
const xlsx = require('xlsx');

// Add Income
const addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date)
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Incomes
const getAllIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Income
const deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Income
const updateIncome = async (req, res) => {
  const userId = req.user.id;
  const { source, amount, date } = req.body;

  if (!source || !amount || !date) {
    return res.status(400).json({ message: 'All fields (source, amount, date) are required' });
  }

  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (income.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this income' });
    }

    income.source = source;
    income.amount = amount;
    income.date = new Date(date);

    const updated = await income.save();

    res.json(updated);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error while updating income' });
  }
};

// Download Excel
const downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    const data = incomes.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split('T')[0]
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Income');
    xlsx.writeFile(wb, 'income-details.xlsx');
    res.download('income-details.xlsx');
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Export all
module.exports = {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
  updateIncome
};
