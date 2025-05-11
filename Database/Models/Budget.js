const mongoose = require('mongoose');

// Define valid categories (align with Transaction model)
const budgetCategories = [
  'Food', 'Transport', 'Bills', 'Healthcare', 
  'Entertainment', 'Shopping', 'Education', 'Savings', 'Other'
];

const budgetSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'UserID is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: budgetCategories,
      message: '{VALUE} is not a valid budget category'
    }
  },
  budgetLimit: {
    type: Number,
    required: [true, 'Budget limit is required'],
    min: [0, 'Budget limit must be positive'],
    validate: {
      validator: Number.isFinite,
      message: 'Budget limit must be a valid number'
    }
  }
});

// Compound indexes for optimal query performance
budgetSchema.index({ userID: 1, category: 1 }, { unique: true }); // One budget per category per user

module.exports = mongoose.model('Budget', budgetSchema);