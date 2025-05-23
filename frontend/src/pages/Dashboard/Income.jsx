import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Layouts/Header";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaMoneyBillWave,
  FaChartLine,
} from "react-icons/fa";

const Income = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [formData, setFormData] = useState({ source: "", amount: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  // For animation
  const [isVisible, setIsVisible] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalIncome: 0,
    maxIncome: { amount: 0, source: "" },
    averageIncome: 0,
    recentActivity: { count: 0, total: 0 },
  });

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/get`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIncomeList(res.data);

      // Calculate statistics
      if (res.data.length > 0) {
        const total = res.data.reduce((sum, item) => sum + item.amount, 0);
        const max = res.data.reduce((prev, current) =>
          prev.amount > current.amount ? prev : current
        );
        const avg = total / res.data.length;

        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentItems = res.data.filter(
          (item) => new Date(item.date) >= thirtyDaysAgo
        );

        const recentTotal = recentItems.reduce(
          (sum, item) => sum + item.amount,
          0
        );

        setStats({
          totalIncome: total,
          maxIncome: max,
          averageIncome: avg,
          recentActivity: {
            count: recentItems.length,
            total: recentTotal,
          },
        });
      }

      setLoading(false);

      // Trigger animations after data is loaded
      setTimeout(() => setIsVisible(true), 100);
    } catch (err) {
      console.error("Income fetch error", err);
      setError("Failed to load income records.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!formData.source || !formData.amount)
      return alert("Please fill in all fields");

    try {
      if (isEditing && editId) {
        await axios.put(
          `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/${editId}`,
          {
            ...formData,
            date: new Date().toISOString(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/add`,
          {
            ...formData,
            date: new Date().toISOString(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setFormData({ source: "", amount: "" });
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

    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById("income-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this income record?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchIncome();
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete");
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
          <div className='animate-spin h-12 w-12 border-t-2 border-b-2 border-green-500 rounded-full mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading your income data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-xl shadow-lg text-center max-w-md'>
          <div className='text-red-500 text-5xl mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-16 w-16 mx-auto'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-800 mb-2'>Error</h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={fetchIncome}
            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-10'>
      <Header />

      {/* Main Content */}
      <div className='px-6 max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mt-6 mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800'>
            Income Overview
          </h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormData({ source: "", amount: "" });
              setIsEditing(false);
            }}
            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center'
          >
            {showForm ? (
              <span>Cancel</span>
            ) : (
              <>
                <FaPlus className='mr-2' />
                <span>Add Income</span>
              </>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div
            className={`bg-white rounded-xl p-5 shadow-md transition-all duration-500 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className='flex items-center mb-3'>
              <div className='bg-green-100 p-3 rounded-full text-green-600 mr-3'>
                <FaMoneyBillWave />
              </div>
              <h3 className='text-gray-600 text-sm font-medium'>
                Total Income
              </h3>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              ${stats.totalIncome.toFixed(2)}
            </p>
          </div>

          <div
            className={`bg-white rounded-xl p-5 shadow-md transition-all duration-500 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className='flex items-center mb-3'>
              <div className='bg-blue-100 p-3 rounded-full text-blue-600 mr-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h3 className='text-gray-600 text-sm font-medium'>
                Largest Income
              </h3>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              ${stats.maxIncome.amount.toFixed(2)}
            </p>
            <p className='text-sm text-gray-500 mt-1'>
              {stats.maxIncome.source}
            </p>
          </div>

          <div
            className={`bg-white rounded-xl p-5 shadow-md transition-all duration-500 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className='flex items-center mb-3'>
              <div className='bg-purple-100 p-3 rounded-full text-purple-600 mr-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'
                  />
                </svg>
              </div>
              <h3 className='text-gray-600 text-sm font-medium'>
                Average Income
              </h3>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              ${stats.averageIncome.toFixed(2)}
            </p>
          </div>

          <div
            className={`bg-white rounded-xl p-5 shadow-md transition-all duration-500 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className='flex items-center mb-3'>
              <div className='bg-yellow-100 p-3 rounded-full text-yellow-600 mr-3'>
                <FaChartLine />
              </div>
              <h3 className='text-gray-600 text-sm font-medium'>
                Recent Activity
              </h3>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              ${stats.recentActivity.total.toFixed(2)}
            </p>
            <p className='text-sm text-gray-500 mt-1'>
              from {stats.recentActivity.count} sources (30 days)
            </p>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div
            id='income-form'
            className='bg-white p-6 rounded-xl shadow-md max-w-md mb-8 border border-green-100 transition-all duration-300 animate-fadeIn'
          >
            <h3 className='text-xl font-semibold mb-4 text-gray-800 flex items-center'>
              {isEditing ? (
                <>
                  <FaEdit className='mr-2 text-green-500' />
                  <span>Update Income</span>
                </>
              ) : (
                <>
                  <FaPlus className='mr-2 text-green-500' />
                  <span>Add New Income</span>
                </>
              )}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block mb-1 text-sm font-medium text-gray-700'>
                  Source
                </label>
                <input
                  type='text'
                  className='w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none'
                  placeholder='e.g. Salary, Freelance, Investment'
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                />
              </div>

              <div className='mb-4'>
                <label className='block mb-1 text-sm font-medium text-gray-700'>
                  Amount
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <span className='text-gray-500'>$</span>
                  </div>
                  <input
                    type='number'
                    className='w-full border border-gray-300 p-2 pl-8 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none'
                    placeholder='0.00'
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className='flex items-center'>
                <button
                  type='submit'
                  className='bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition-colors shadow-md mr-2 flex-grow'
                >
                  {isEditing ? "Update Income" : "Save Income"}
                </button>

                {isEditing && (
                  <button
                    type='button'
                    onClick={() => {
                      setShowForm(false);
                      setIsEditing(false);
                      setFormData({ source: "", amount: "" });
                    }}
                    className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition-colors'
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Income Table */}
        <div
          className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
            <h3 className='text-xl font-semibold text-gray-800'>
              Income History
            </h3>
            {incomeList.length > 0 && (
              <button
                onClick={fetchIncome}
                className='text-green-500 hover:text-green-600 transition-colors text-sm flex items-center'
                title='Refresh data'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  />
                </svg>
                Refresh
              </button>
            )}
          </div>

          {incomeList.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full table-auto'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Source
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {incomeList.map((item, index) => (
                    <tr
                      key={index}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4 font-medium text-gray-800'>
                        {item.source}
                      </td>
                      <td className='px-6 py-4 text-green-600 font-medium'>
                        ${item.amount}
                      </td>
                      <td className='px-6 py-4 text-gray-500'>
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleEdit(item)}
                            className='text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded'
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className='text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded'
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='p-6 text-center text-gray-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16 mx-auto text-gray-300 mb-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p>No income records available.</p>
              <button
                onClick={() => setShowForm(true)}
                className='mt-4 text-green-500 hover:text-green-600 transition-colors text-sm font-medium'
              >
                Add your first income source
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;
