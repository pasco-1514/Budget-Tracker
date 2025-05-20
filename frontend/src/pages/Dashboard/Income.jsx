import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Layouts/Header';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Income = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [formData, setFormData] = useState({ source: '', amount: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncomeList(res.data);
    } catch (err) {
      console.error("Income fetch error", err);
      setError("Failed to load income records.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!formData.source || !formData.amount) return alert("Please fill in all fields");

    try {
      if (isEditing && editId) {
        await axios.put(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/${editId}`, {
          ...formData,
          date: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/add`, {
          ...formData,
          date: new Date().toISOString()
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setFormData({ source: '', amount: '' });
      setShowForm(false);
      setIsEditing(false);
      setEditId(null);
      fetchIncome();
    } catch (err) {
      console.error("Income save error", err);
      alert("Error saving income");
    }
  };

  const handleEdit = (item) => {
    setFormData({ source: item.source, amount: item.amount });
    setEditId(item._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this income record?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchIncome();
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete");
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  return (
    <div className="px-6">
      <Header />
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-2xl font-semibold">Income Overview</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ source: '', amount: '' });
            setIsEditing(false);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {showForm ? "Cancel" : "Add Income"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mt-4 max-w-md">
          <div className="mb-3">
            <label className="block text-sm mb-1">Source</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Freelance, Salary, etc."
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="1000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {isEditing ? "Update Income" : "Save Income"}
          </button>
        </form>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Recent Income</h3>
        {incomeList.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Source</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeList.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{item.source}</td>
                  <td className="p-2">${item.amount}</td>
                  <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No income records available.</p>
        )}
      </div>
    </div>
  );
};

export default Income;
