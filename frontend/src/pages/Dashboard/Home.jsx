import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Layouts/Header";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaWallet,
  FaChartLine,
  FaRegCalendarAlt,
  FaDownload,
  FaFilter,
} from "react-icons/fa";
import AnalyticsChart from "./AnalyticsChart";

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ category: "", amount: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  // For animations
  const [isVisible, setIsVisible] = useState(false);
  // For transaction filtering
  const [transactionFilter, setTransactionFilter] = useState("all");
  // For balance trends
  const [balanceTrend, setBalanceTrend] = useState({
    percentage: 0,
    isUp: true,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDashboardData(res.data);

      // Calculate balance trend (normally would come from API)
      // This is just a placeholder - in a real app, you'd get this data from your API
      const randomTrend = Math.floor(Math.random() * 15) + 5; // 5-20%
      setBalanceTrend({
        percentage: randomTrend,
        isUp: res.data.totalBalance > 0,
      });

      setLoading(false);
      // Trigger animations
      setTimeout(() => setIsVisible(true), 100);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unauthorized or session expired. Please log in again.");
      setLoading(false);
    }
  };
  const handleAddOrUpdateExpense = async (e) => {
    e.preventDefault();
    const { category, amount } = formData;

    if (!category || !amount) return alert("Please fill out all fields");

    try {
      const token = localStorage.getItem("token");
      if (isEditing && editId) {
        await axios.put(
          `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/${editId}`,
          {
            category,
            amount: parseFloat(amount),
            date: new Date().toISOString(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/add`,
          {
            category,
            amount: parseFloat(amount),
            date: new Date().toISOString(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setFormData({ category: "", amount: "" });
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
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById("expense-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleExportData = () => {
    if (!dashboardData) return;

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Category/Source,Amount,Date\n";

    dashboardData.recentTransactions.forEach((txn) => {
      const row = [
        txn.type,
        txn.category || txn.source,
        txn.amount,
        new Date(txn.date).toLocaleDateString(),
      ].join(",");
      csvContent += row + "\n";
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `budget-data-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);

    // Trigger download
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = () => {
    if (!dashboardData || !dashboardData.recentTransactions) return [];

    if (transactionFilter === "all") {
      return dashboardData.recentTransactions;
    }
    return dashboardData.recentTransactions.filter(
      (txn) => txn.type === transactionFilter
    );
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
          <div className='animate-spin h-12 w-12 border-t-2 border-b-2 border-violet-500 rounded-full mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading your dashboard...</p>
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
          <h2 className='text-xl font-bold text-gray-800 mb-2'>
            Authentication Error
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className='bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
          <div className='text-yellow-500 text-5xl mb-4'>
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
                d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
              />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-800 mb-2'>
            No Data Available
          </h2>
          <p className='text-gray-600'>Dashboard data could not be loaded.</p>
        </div>
      </div>
    );
  }
  return (
    <div className='min-h-screen bg-gray-50 pb-10'>
      <Header />

      <div className='px-6 max-w-7xl mx-auto'>
        {/* Welcome Banner */}
        <div
          className={`mt-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transition-all duration-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold mb-2'>
                Welcome to Budget Buddy
              </h1>
              <p className='text-violet-100'>Your personal finance dashboard</p>
            </div>
            <div className='mt-4 md:mt-0'>
              <div className='flex items-center gap-2'>
                <span className='text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full'>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <button
                  onClick={fetchDashboardData}
                  className='bg-white text-violet-700 hover:bg-violet-100 px-3 py-1 rounded-full text-sm transition-colors'
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
          {/* Income Card */}
          <div
            className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-500 transform hover:shadow-lg ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className='p-5'>
              <div className='flex justify-between items-start'>
                <div>
                  <div className='flex items-center'>
                    <div className='bg-green-100 p-2 rounded-lg mr-3'>
                      <FaArrowUp className='text-green-600' />
                    </div>
                    <p className='text-gray-500 text-sm font-medium'>
                      Total Income
                    </p>
                  </div>
                  <h3 className='text-3xl font-bold text-gray-800 mt-3'>
                    ${dashboardData.totalIncome || 0}
                  </h3>
                </div>
                <div className='bg-green-500 text-white text-xs px-2 py-1 rounded-full'>
                  +12% ↑
                </div>
              </div>
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <a
                  href='/income'
                  className='text-green-600 hover:text-green-700 text-sm font-medium transition-colors'
                >
                  View Income Details →
                </a>
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div
            className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-500 transform hover:shadow-lg ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className='p-5'>
              <div className='flex justify-between items-start'>
                <div>
                  <div className='flex items-center'>
                    <div className='bg-red-100 p-2 rounded-lg mr-3'>
                      <FaArrowDown className='text-red-600' />
                    </div>
                    <p className='text-gray-500 text-sm font-medium'>
                      Total Expenses
                    </p>
                  </div>
                  <h3 className='text-3xl font-bold text-gray-800 mt-3'>
                    ${dashboardData.totalExpense || 0}
                  </h3>
                </div>
                <div className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                  +8% ↑
                </div>
              </div>
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <a
                  href='/expenses'
                  className='text-red-600 hover:text-red-700 text-sm font-medium transition-colors'
                >
                  View Expense Details →
                </a>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div
            className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-500 transform hover:shadow-lg ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className='p-5'>
              <div className='flex justify-between items-start'>
                <div>
                  <div className='flex items-center'>
                    <div className='bg-blue-100 p-2 rounded-lg mr-3'>
                      <FaWallet className='text-blue-600' />
                    </div>
                    <p className='text-gray-500 text-sm font-medium'>
                      Total Balance
                    </p>
                  </div>
                  <h3 className='text-3xl font-bold text-gray-800 mt-3'>
                    ${dashboardData.totalBalance || 0}
                  </h3>
                </div>
                <div
                  className={`${
                    balanceTrend.isUp ? "bg-green-500" : "bg-red-500"
                  } text-white text-xs px-2 py-1 rounded-full`}
                >
                  {balanceTrend.isUp ? "+" : "-"}
                  {balanceTrend.percentage}% {balanceTrend.isUp ? "↑" : "↓"}
                </div>
              </div>
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <div className='flex items-center'>
                  <div className='text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mr-2'>
                    <FaChartLine className='inline mr-1' size={10} />
                    Positive trend
                  </div>
                  <div className='text-gray-500 text-xs'>
                    <FaRegCalendarAlt className='inline mr-1' size={10} />
                    Last 30 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons and Analytics Chart */}
        <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Action Buttons */}
          <div
            className={`md:col-span-1 transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Quick Actions
              </h3>

              <div className='space-y-3'>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setFormData({ category: "", amount: "" });
                    setIsEditing(false);
                  }}
                  className='w-full bg-violet-500 hover:bg-violet-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center'
                >
                  <FaPlus className='mr-2' />
                  {showForm ? "Cancel" : "Add New Expense"}
                </button>

                <a
                  href='/income'
                  className='block w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors text-center'
                >
                  <FaPlus className='inline-block mr-2' />
                  Add New Income
                </a>

                <button
                  onClick={handleExportData}
                  className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg transition-colors flex items-center justify-center'
                >
                  <FaDownload className='mr-2' />
                  Export Transactions
                </button>
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <div
                  id='expense-form'
                  className='mt-6 p-4 bg-violet-50 rounded-lg border border-violet-100 animate-fadeIn'
                >
                  <h4 className='font-medium text-violet-700 mb-3 flex items-center'>
                    {isEditing ? (
                      <>
                        <FaEdit className='mr-2' />
                        Edit Expense
                      </>
                    ) : (
                      <>
                        <FaPlus className='mr-2' />
                        New Expense
                      </>
                    )}
                  </h4>

                  <form onSubmit={handleAddOrUpdateExpense}>
                    <div className='mb-3'>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Category
                      </label>
                      <input
                        type='text'
                        className='w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none'
                        placeholder='e.g. Groceries'
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      />
                    </div>
                    <div className='mb-3'>
                      <label className='block mb-1 text-sm font-medium text-gray-700'>
                        Amount
                      </label>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                          <span className='text-gray-500'>$</span>
                        </div>
                        <input
                          type='number'
                          className='w-full border border-gray-300 p-2 pl-8 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none'
                          placeholder='0.00'
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <button
                      type='submit'
                      className='w-full bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition-colors'
                    >
                      {isEditing ? "Update Expense" : "Save Expense"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Chart */}
          <div
            className={`md:col-span-2 transition-all duration-500 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <AnalyticsChart />
          </div>
        </div>
        {/* Transactions Table */}
        <div
          className={`mt-8 transition-all duration-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className='bg-white rounded-xl shadow-md overflow-hidden'>
            <div className='p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4 md:mb-0'>
                Recent Transactions
              </h3>

              {/* Transaction Filter */}
              {dashboardData.recentTransactions &&
                dashboardData.recentTransactions.length > 0 && (
                  <div className='flex items-center space-x-2'>
                    <div className='text-gray-500 mr-2 flex items-center'>
                      <FaFilter className='mr-1' />
                      <span className='text-sm'>Filter:</span>
                    </div>
                    <button
                      onClick={() => setTransactionFilter("all")}
                      className={`px-3 py-1 rounded-full text-xs ${
                        transactionFilter === "all"
                          ? "bg-violet-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setTransactionFilter("income")}
                      className={`px-3 py-1 rounded-full text-xs ${
                        transactionFilter === "income"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      Income
                    </button>
                    <button
                      onClick={() => setTransactionFilter("expense")}
                      className={`px-3 py-1 rounded-full text-xs ${
                        transactionFilter === "expense"
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      Expenses
                    </button>
                  </div>
                )}
            </div>

            {dashboardData.recentTransactions &&
            filteredTransactions().length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full table-auto'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Type
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Category / Source
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
                    {filteredTransactions().map((txn, index) => (
                      <tr
                        key={index}
                        className='hover:bg-gray-50 transition-colors'
                      >
                        <td className='px-6 py-4'>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              txn.type === "income"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {txn.type === "income" ? (
                              <FaArrowUp className='mr-1' />
                            ) : (
                              <FaArrowDown className='mr-1' />
                            )}
                            {txn.type}
                          </span>
                        </td>
                        <td className='px-6 py-4 font-medium text-gray-800 capitalize'>
                          {txn.category || txn.source}
                        </td>
                        <td className='px-6 py-4'>
                          <span
                            className={
                              txn.type === "income"
                                ? "text-green-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            ${txn.amount}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-gray-500'>
                          {new Date(txn.date).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4'>
                          {txn.type === "expense" && (
                            <div className='flex space-x-2'>
                              <button
                                onClick={() => handleEditExpense(txn)}
                                className='text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded'
                                title='Edit'
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(txn._id)}
                                className='text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded'
                                title='Delete'
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='p-6 text-center'>
                {dashboardData.recentTransactions &&
                dashboardData.recentTransactions.length > 0 ? (
                  <div className='text-gray-500'>
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
                        d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
                      />
                    </svg>
                    <p>
                      No {transactionFilter !== "all" ? transactionFilter : ""}{" "}
                      transactions found.
                    </p>
                    {transactionFilter !== "all" && (
                      <button
                        onClick={() => setTransactionFilter("all")}
                        className='mt-2 text-violet-500 hover:text-violet-600 text-sm font-medium'
                      >
                        Show all transactions
                      </button>
                    )}
                  </div>
                ) : (
                  <div className='text-gray-500'>
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
                        d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                      />
                    </svg>
                    <p>No recent transactions.</p>
                    <p className='mt-2 text-sm'>
                      Add income or expenses to see your transactions here.
                    </p>
                    <div className='mt-4 flex justify-center space-x-4'>
                      <button
                        onClick={() => setShowForm(true)}
                        className='text-violet-500 hover:text-violet-600 text-sm font-medium'
                      >
                        Add Expense
                      </button>
                      <a
                        href='/income'
                        className='text-green-500 hover:text-green-600 text-sm font-medium'
                      >
                        Add Income
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Financial Tips Section */}
        <div
          className={`mt-8 transition-all duration-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className='bg-white rounded-xl shadow-md overflow-hidden'>
            <div className='p-6 border-b border-gray-200'>
              <h3 className='text-xl font-semibold text-gray-800'>
                Financial Tips
              </h3>
            </div>

            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Tip 1 */}
                <div className='bg-violet-50 rounded-lg p-4 border border-violet-100'>
                  <div className='bg-violet-100 w-10 h-10 rounded-full flex items-center justify-center mb-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-violet-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <h4 className='text-lg font-medium text-gray-800 mb-2'>
                    50/30/20 Rule
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    Allocate 50% of your income to needs, 30% to wants, and 20%
                    to savings for a balanced budget.
                  </p>
                </div>

                {/* Tip 2 */}
                <div className='bg-blue-50 rounded-lg p-4 border border-blue-100'>
                  <div className='bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-blue-600'
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
                  <h4 className='text-lg font-medium text-gray-800 mb-2'>
                    Emergency Fund
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    Save 3-6 months of expenses in an easily accessible account
                    for unexpected emergencies.
                  </p>
                </div>

                {/* Tip 3 */}
                <div className='bg-green-50 rounded-lg p-4 border border-green-100'>
                  <div className='bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mb-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-green-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  </div>
                  <h4 className='text-lg font-medium text-gray-800 mb-2'>
                    Track Every Expense
                  </h4>
                  <p className='text-gray-600 text-sm'>
                    Consistently tracking all expenses helps identify areas
                    where you can cut back and save more.
                  </p>
                </div>
              </div>

              <div className='mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100'>
                <div className='flex items-start'>
                  <div className='bg-yellow-100 p-2 rounded-full mr-3 mt-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-yellow-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className='text-md font-medium text-gray-800 mb-1'>
                      Budget Analysis
                    </h4>
                    <p className='text-gray-600 text-sm mb-2'>
                      Based on your current spending patterns, you could save
                      approximately{" "}
                      <span className='font-semibold text-green-600'>
                        $120 more per month
                      </span>{" "}
                      by reducing discretionary expenses.
                    </p>
                    <button className='text-violet-600 hover:text-violet-700 text-sm font-medium transition-colors'>
                      View Detailed Analysis →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div
          className={`mt-8 transition-all duration-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <div className='bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-bold mb-2'>Coming Soon</h3>
                <p className='text-indigo-100 mb-4'>
                  We're working on exciting new features to help you manage your
                  finances better!
                </p>
                <div className='flex flex-wrap gap-2'>
                  <span className='bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm'>
                    Budget Goals
                  </span>
                  <span className='bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm'>
                    Savings Tracker
                  </span>
                  <span className='bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm'>
                    Bill Reminders
                  </span>
                  <span className='bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm'>
                    Mobile App
                  </span>
                </div>
              </div>
              <div className='hidden md:block'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-24 w-24 text-white opacity-20'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
