const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

// GET - Main page with all expenses
router.get("/", expenseController.getAllExpenses);

// POST - Create a new expense
router.post("/expenses", expenseController.createExpense);

// GET - Show the update expense form
router.get("/expenses/:id/edit", expenseController.getExpenseForEdit);

// PUT - Update an expense
router.put("/expenses/:id", expenseController.updateExpense);

// DELETE - Delete an expense
router.delete("/expenses/:id", expenseController.deleteExpense);

// GET - Show expense report (chart)
router.get("/report", expenseController.getExpenseReport);

// GET - Search expenses
router.get("/search", expenseController.searchExpenses);

module.exports = router;
