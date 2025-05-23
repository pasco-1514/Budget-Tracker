const Expense = require('../models/Expense');
const xlsx = require('xlsx');

// Add Expense
const addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date)
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Expenses
const getAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Expense
const updateExpense = async (req, res) => {
  const userId = req.user.id;
  const { category, amount, date } = req.body;

  if (!category || !amount || !date) {
    return res.status(400).json({ message: 'All fields (category, amount, date) are required' });
  }

  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    expense.category = category;
    expense.amount = amount;
    expense.date = new Date(date);

    const updated = await expense.save();

    res.json(updated);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error while updating expense' });
  }
};

// Download to Excel
const downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split('T')[0]
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Expense');
    xlsx.writeFile(wb, 'expense-details.xlsx');
    res.download('expense-details.xlsx');
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Export all functions
module.exports = {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
  updateExpense
};
