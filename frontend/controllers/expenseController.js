const axios = require("axios");

// API Endpoint from your requestMethods.js
const API_BASE_URL = "http://localhost:4444/api/v1";

// Get all expenses and render the main page
exports.getAllExpenses = async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses`);
    const expenses = response.data;

    // Calculate total sum of expenses
    const totalSum = expenses.reduce((acc, curr) => acc + curr.value, 0);

    res.render("index", {
      expenses,
      totalSum,
      searchTerm: "",
      error: null,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.render("index", {
      expenses: [],
      totalSum: 0,
      searchTerm: "",
      error: "Failed to fetch expenses",
    });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { label, date, value } = req.body;

    await axios.post(`${API_BASE_URL}/expenses`, {
      label,
      date,
      value: Number(value),
    });

    res.redirect("/");
  } catch (error) {
    console.error("Error creating expense:", error);
    res.redirect("/?error=Failed to create expense");
  }
};

// Get expense for editing
exports.getExpenseForEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(`${API_BASE_URL}/expenses/${id}`);
    const expense = response.data;

    res.render("edit-expense", { expense });
  } catch (error) {
    console.error("Error fetching expense for edit:", error);
    res.redirect("/?error=Failed to fetch expense for edit");
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const { label, date, value } = req.body;

    await axios.put(`${API_BASE_URL}/expenses/${id}`, {
      label,
      date,
      value: Number(value),
    });

    res.redirect("/");
  } catch (error) {
    console.error("Error updating expense:", error);
    res.redirect("/?error=Failed to update expense");
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const id = req.params.id;
    await axios.delete(`${API_BASE_URL}/expenses/${id}`);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.redirect("/?error=Failed to delete expense");
  }
};

// Get expense report for chart visualization
exports.getExpenseReport = async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses`);
    const expenses = response.data;

    // Calculate total sum of expenses
    const totalSum = expenses.reduce((acc, curr) => acc + curr.value, 0);

    res.render("report", { expenses, totalSum });
  } catch (error) {
    console.error("Error fetching expense report:", error);
    res.redirect("/?error=Failed to fetch expense report");
  }
};

// Search expenses by label
exports.searchExpenses = async (req, res) => {
  try {
    const searchTerm = req.query.term || "";
    const response = await axios.get(`${API_BASE_URL}/expenses`);
    let expenses = response.data;

    // Filter expenses by search term
    if (searchTerm) {
      expenses = expenses.filter((expense) =>
        expense.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Calculate total sum of filtered expenses
    const totalSum = expenses.reduce((acc, curr) => acc + curr.value, 0);

    res.render("index", {
      expenses,
      totalSum,
      searchTerm,
      error: null,
    });
  } catch (error) {
    console.error("Error searching expenses:", error);
    res.render("index", {
      expenses: [],
      totalSum: 0,
      searchTerm: req.query.term || "",
      error: "Failed to search expenses",
    });
  }
};
