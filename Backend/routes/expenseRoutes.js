const express = require("express");
const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel,
    updateExpense
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloadExcel", protect, downloadExpenseExcel);
router.delete("/:id", protect, deleteExpense);
router.put("/:id", protect, updateExpense);

module.exports = router;
