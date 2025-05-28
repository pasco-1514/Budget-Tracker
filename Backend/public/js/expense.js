document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const API = '/api/v1';
    let expenseList = [];
    let selectedCategory = 'all';
    let sortBy = 'date';
    let sortOrder = 'desc';
    let categories = [];
    let stats = {
        totalExpense: 0,
        topCategory: { category: '', amount: 0 },
        avgExpense: 0,
        recentActivity: { count: 0, total: 0 }
    };

    async function fetchExpenses() {
        try {
            const res = await fetch(`${API}/expense/get`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            expenseList = data;
            categories = [...new Set(data.map(item => item.category))];
            calculateStats();
            updateUI();
        } catch (err) {
            console.error('Fetch error:', err);
            alert('Failed to load expenses');
        }
    }

    function calculateStats() {
        // Calculate total
        stats.totalExpense = expenseList.reduce((sum, item) => sum + item.amount, 0);
        
        // Calculate average
        stats.avgExpense = stats.totalExpense / (expenseList.length || 1);

        // Find top category
        const categoryMap = {};
        expenseList.forEach(item => {
            categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
        });
        const topCategory = Object.entries(categoryMap)
            .sort(([,a], [,b]) => b - a)[0] || ['None', 0];
        stats.topCategory = { category: topCategory[0], amount: topCategory[1] };

        // Recent activity
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentItems = expenseList.filter(item => new Date(item.date) >= thirtyDaysAgo);
        stats.recentActivity = {
            count: recentItems.length,
            total: recentItems.reduce((sum, item) => sum + item.amount, 0)
        };
    }

    function updateUI() {
        updateStatsCards();
        updateFilters();
        updateTable();
    }

    // Toggle expense form visibility
    function toggleExpenseForm() {
        const expenseForm = document.getElementById('expenseForm');
        const formToggleText = document.getElementById('formToggleText');
        const formTitle = document.getElementById('formTitle');
        const submitButtonText = document.getElementById('submitButtonText');
        
        if (expenseForm.classList.contains('hidden')) {
            expenseForm.classList.remove('hidden');
            formToggleText.textContent = 'Close Form';
            formTitle.textContent = 'Add New Expense';
            submitButtonText.textContent = 'Save Expense';
        } else {
            expenseForm.classList.add('hidden');
            formToggleText.textContent = 'Add Expense';
            document.getElementById('expenseSubmitForm').reset();
        }
    }

    // Handle form submission
    document.getElementById('expenseSubmitForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const category = document.getElementById('category').value;
        const amount = document.getElementById('amount').value;
        
        if (!category || !amount) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category,
                    amount: parseFloat(amount)
                })
            });

            if (response.ok) {
                // Reset form and refresh expenses
                document.getElementById('expenseSubmitForm').reset();
                toggleExpenseForm();
                fetchExpenses(); // Make sure you have this function defined
            } else {
                alert('Failed to add expense');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the expense');
        }
    });

    // Print functionality
    function handlePrint() {
        window.print();
    }

    // Initial load
    fetchExpenses();
});
