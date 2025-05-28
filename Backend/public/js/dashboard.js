// public/js/dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const API = "/api/v1";

  const fetchDashboard = async () => {
    const res = await fetch(`${API}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    populateDashboard(data);
  };

  function populateDashboard(data) {
    const cards = `
      <div class="col s12 m4"><div class="card green lighten-4"><div class="card-content"><h6>Total Income</h6><h5 class="green-text">$${data.totalIncome || 0}</h5></div></div></div>
      <div class="col s12 m4"><div class="card red lighten-4"><div class="card-content"><h6>Total Expense</h6><h5 class="red-text">$${data.totalExpense || 0}</h5></div></div></div>
      <div class="col s12 m4"><div class="card blue lighten-4"><div class="card-content"><h6>Total Balance</h6><h5 class="blue-text">$${data.totalBalance || 0}</h5></div></div></div>
    `;
    document.getElementById("dashboardCards").innerHTML = cards;

    const rows = data.recentTransactions.map(txn => `
      <tr>
        <td>${txn.type}</td>
        <td>${txn.category || txn.source}</td>
        <td>$${txn.amount}</td>
        <td>${new Date(txn.date).toLocaleDateString()}</td>
        <td>
          ${txn.type === 'expense' ? `
            <button class="btn-small blue" onclick='editExpense("${txn._id}", "${txn.category}", ${txn.amount})'>Edit</button>
            <button class="btn-small red" onclick='deleteExpense("${txn._id}")'>Delete</button>
          ` : `
            <button class="btn-small blue" onclick='openIncomeEditModal("${txn._id}", "${txn.source}", ${txn.amount}, "${txn.category}", "${txn.date}", "${txn.description || ''}")'>Edit</button>
            <button class="btn-small red" onclick='deleteIncome("${txn._id}")'>Delete</button>
          `}
        </td>
      </tr>
    `).join("");

    document.getElementById("transactionsTable").innerHTML = rows;
  }

  window.editExpense = (id, category, amount) => {
    document.getElementById("editId").value = id;
    document.getElementById("category").value = category;
    document.getElementById("amount").value = amount;
    M.updateTextFields();
    document.getElementById("expenseFormWrapper").style.display = "block";
  };

  window.deleteExpense = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`${API}/expense/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDashboard();
  };

  window.openIncomeEditModal = (id, source, amount, category, date, description) => {
    document.getElementById("incomeEditId").value = id;
    document.getElementById("incomeTitle").value = source;
    document.getElementById("incomeAmount").value = amount;
    document.getElementById("incomeCategory").value = category;
    document.getElementById("incomeDate").value = new Date(date).toISOString().split("T")[0];
    document.getElementById("incomeDescription").value = description;
    M.updateTextFields();
    document.getElementById("incomeFormWrapper").style.display = "block";
  };

  window.deleteIncome = async (id) => {
    if (!confirm("Are you sure you want to delete this income?")) return;
    await fetch(`${API}/income/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDashboard();
  };

  document.getElementById("toggleFormBtn").onclick = () => {
    const wrapper = document.getElementById("expenseFormWrapper");
    wrapper.style.display = wrapper.style.display === "block" ? "none" : "block";
  };

  document.getElementById("expenseForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editId").value;
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;

    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${API}/expense/${id}` : `${API}/expense/add`;

    await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, amount, date: new Date().toISOString() }),
    });

    document.getElementById("expenseForm").reset();
    document.getElementById("expenseFormWrapper").style.display = "none";
    fetchDashboard();
  });

  document.getElementById("incomeForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("incomeEditId").value;
    const data = {
      source: document.getElementById("incomeTitle").value,
      amount: document.getElementById("incomeAmount").value,
      date: document.getElementById("incomeDate").value,
      category: document.getElementById("incomeCategory").value,
      description: document.getElementById("incomeDescription").value
    };

    const endpoint = id ? `${API}/income/${id}` : `${API}/income/add`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      document.getElementById("incomeForm").reset();
      document.getElementById("incomeFormWrapper").style.display = "none";
      fetchDashboard();
    } else {
      const err = await res.json();
      alert(err.message || "Failed to update income.");
    }
  });

  fetchDashboard();
});
