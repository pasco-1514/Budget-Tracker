const mongoose = require('mongoose');

const incomeCategories = ['Salary', 'Bonus', 'Freelance', 'Investment', 'Other'];
const expenseCategories = ['Food', 'Transport', 'Bills', 'Healthcare', 'Entertainment', 'Other'];

const transactionSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'UserID is required']
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: [true, 'Transaction type (Income/Expense) is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
    validate: {
      validator: Number.isFinite,
      message: 'Amount must be a valid number'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    validate: {
      validator: function(value) {
        if (this.type === 'Income') {
          return incomeCategories.includes(value);
        } else {
          return expenseCategories.includes(value);
        }
      },
      message: props => `${props.value} is not a valid category`
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],  // Added required
    default: Date.now
  }
});

// Most critical indexes
transactionSchema.index({ userID: 1, date: -1 });       // Primary view: Recent transactions
transactionSchema.index({ userID: 1, category: 1 });    // Category spending analysis
transactionSchema.index({ userID: 1, type: 1 });        // Income vs. expense overview
transactionSchema.index({ userID: 1, amount: 1 });      // For finding large transactions
transactionSchema.index({ userID: 1, type: 1, date: 1 }); // Monthly income/expense reports

module.exports = mongoose.model('Transaction', transactionSchema);