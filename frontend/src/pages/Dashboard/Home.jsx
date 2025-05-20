import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Layouts/Header';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AnalyticsChart from "./AnalyticsChart";


const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ category: '', amount: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login again.');
        setLoading(false);
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDashboardData(res.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Unauthorized or session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateExpense = async (e) => {
    e.preventDefault();
    const { category, amount } = formData;

    if (!category || !amount) return alert("Please fill out all fields");

    try {
      const token = localStorage.getItem('token');
      if (isEditing && editId) {
        await axios.put(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/${editId}`, {
          category,
          amount: parseFloat(amount),
          date: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/add`, {
          category,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setFormData({ category: '', amount: '' });
      setShowForm(false);
      setIsEditing(false);
      setEditId(null);
      fetchDashboardData();
    } catch (err) {
      console.error("Error saving expense", err);
      alert("Failed to save expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  const handleEditExpense = (txn) => {
    setFormData({ category: txn.category, amount: txn.amount });
    setIsEditing(true);
    setEditId(txn._id);
    setShowForm(true);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!dashboardData) return <div className="p-6">No dashboard data available.</div>;

  return (
    <div className="px-6">
      <Header />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Income</h3>
          <p className="text-2xl font-bold text-green-700">${dashboardData.totalIncome || 0}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-700">${dashboardData.totalExpense || 0}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Balance</h3>
          <p className="text-2xl font-bold text-blue-700">${dashboardData.totalBalance || 0}</p>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ category: '', amount: '' });
            setIsEditing(false);
          }}
          className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600"
        >
          {showForm ? "Cancel" : "Add Expense"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleAddOrUpdateExpense} className="mt-4 bg-white p-4 rounded shadow max-w-md">
          <div className="mb-3">
            <label className="block mb-1 text-sm">Category</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="e.g. Groceries"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-sm">Amount</label>
            <input
              type="number"
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="e.g. 50"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            {isEditing ? "Update Expense" : "Save Expense"}
          </button>
        </form>
      )}
<div className="mt-8">
  <AnalyticsChart />
</div>


      {/* Transactions Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Type</th>
                <th className="p-2">Category / Source</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentTransactions.map((txn, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{txn.type}</td>
                  <td className="p-2">{txn.category || txn.source}</td>
                  <td className="p-2">${txn.amount}</td>
                  <td className="p-2">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="p-2 flex gap-2">
                    {txn.type === "expense" && (
                      <>
                        <button onClick={() => handleEditExpense(txn)} className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteExpense(txn._id)} className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No recent transactions.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
