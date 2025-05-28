document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    let incomeData = [];
    
    // Initialize the stats
    const stats = {
        totalIncome: 0,
        maxIncome: { amount: 0, source: "" },
        averageIncome: 0,
        recentActivity: { count: 0, total: 0 },
    };

    async function fetchIncome() {
        try {
            const response = await fetch('/api/v1/income/get', {
                headers: { Authorization: `Bearer ${token}` }
            });
            incomeData = await response.json();
            updateStats();
            renderStats();
            renderIncomeTable();
        } catch (error) {
            console.error('Error fetching income:', error);
        }
    }

    function updateStats() {
        if (incomeData.length === 0) return;

        stats.totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
        
        stats.maxIncome = incomeData.reduce((max, item) => 
            item.amount > max.amount ? { amount: item.amount, source: item.source } : max,
            { amount: 0, source: "" }
        );

        stats.averageIncome = stats.totalIncome / incomeData.length;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentItems = incomeData.filter(item => new Date(item.date) >= thirtyDaysAgo);
        stats.recentActivity = {
            count: recentItems.length,
            total: recentItems.reduce((sum, item) => sum + item.amount, 0)
        };
    }

    function renderStats() {
        const statsHTML = `
            <div class="bg-white rounded-xl p-5 shadow-md">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center">
                            <div class="bg-green-100 p-2 rounded-lg mr-3">
                                <i class="bx bx-dollar text-green-600"></i>
                            </div>
                            <p class="text-gray-500 text-sm font-medium">Total Income</p>
                        </div>
                        <h3 class="text-3xl font-bold text-gray-800 mt-3">$${stats.totalIncome.toFixed(2)}</h3>
                    </div>
                </div>
            </div>
            // ...rest of the stats cards
        `;
        document.getElementById('statsCards').innerHTML = statsHTML;
    }

    function renderIncomeTable() {
        const tbody = document.querySelector('#incomeTable tbody');
        const selectedCategory = document.getElementById('categoryFilter').value;
        
        const filteredIncome = selectedCategory === 'all' 
            ? incomeData 
            : incomeData.filter(item => item.category === selectedCategory);

        tbody.innerHTML = filteredIncome.map(income => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">${income.source}</td>
                <td class="px-6 py-4 text-green-600 font-medium">$${income.amount}</td>
                <td class="px-6 py-4 capitalize">${income.category}</td>
                <td class="px-6 py-4">${new Date(income.date).toLocaleDateString()}</td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="handleEdit('${income._id}')" class="text-blue-600 hover:text-blue-800">
                            <i class="bx bx-edit"></i>
                        </button>
                        <button onclick="handleDelete('${income._id}')" class="text-red-600 hover:text-red-800">
                            <i class="bx bx-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ... rest of the JavaScript with event handlers for form submission, edit, delete, etc.

    // Initial fetch
    fetchIncome();

    // Set up event listeners
    document.getElementById('categoryFilter').addEventListener('change', renderIncomeTable);
});
