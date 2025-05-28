const express = require('express');
const router = express.Router();

const incomeController = require('../controllers/incomeController');
console.log("🔍 Income Controller:", incomeController);

const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, incomeController.addIncomeData);
router.get('/get', protect, incomeController.getAllIncome);
router.put('/:id', protect, incomeController.updateIncome);
router.delete('/:id', protect, incomeController.deleteIncome);

module.exports = router;
