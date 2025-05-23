import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Layouts/Header";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaChartPie,
  FaCalendarAlt,
  FaInfoCircle,
  FaFilter,
  FaSort,
  FaPrint,
} from "react-icons/fa";

const Expense = () => {
  const [expenseList, setExpenseList] = useState([]);
  const [formData, setFormData] = useState({ category: "", amount: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // For animation
  const [isVisible, setIsVisible] = useState(false);
  // For category filter
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  // For sorting
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Stats
  const [stats, setStats] = useState({
    totalExpense: 0,
    topCategory: { category: "", amount: 0 },
    avgExpense: 0,
    recentActivity: { count: 0, total: 0 },
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/get`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setExpenseList(res.data);

      if (res.data.length > 0) {
        // Extract unique categories
        const uniqueCategories = [
          ...new Set(res.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);

        // Calculate statistics
        const total = res.data.reduce((sum, item) => sum + item.amount, 0);
        const avg = total / res.data.length;

        // Find top category
        const categoryMap = {};
        res.data.forEach((item) => {
          if (!categoryMap[item.category]) {
            categoryMap[item.category] = 0;
          }
          categoryMap[item.category] += item.amount;
        });

        const topCategory = Object.keys(categoryMap).reduce(
          (a, b) => (categoryMap[a] > categoryMap[b] ? a : b),
          Object.keys(categoryMap)[0]
        );

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
          totalExpense: total,
          topCategory: {
            category: topCategory || "None",
            amount: topCategory ? categoryMap[topCategory] : 0,
          },
          avgExpense: avg,
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
      console.error("Expense fetch error", err);
      setError("Failed to load expense records.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!formData.category || !formData.amount)
      return alert("Please fill in all fields");

    try {
      if (isEditing && editId) {
        await axios.put(
          `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/${editId}`,
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
          `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/add`,
          {
            ...formData,
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
      fetchExpenses();
    } catch (err) {
      console.error("Expense save error", err);
      alert("Error saving expense");
    }
  };

  const handleEdit = (item) => {
    setFormData({ category: item.category, amount: item.amount });
    setEditId(item._id);
    setIsEditing(true);
    setShowForm(true);

    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById("expense-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchExpenses();
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete");
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking on the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortedAndFilteredExpenses = () => {
    // First filter by category if needed
    let result =
      selectedCategory === "all"
        ? [...expenseList]
        : expenseList.filter(
            (expense) => expense.category === selectedCategory
          );

    // Then sort
    result.sort((a, b) => {
      let valA, valB;

      if (sortBy === "date") {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (sortBy === "amount") {
        valA = a.amount;
        valB = b.amount;
      } else if (sortBy === "category") {
        valA = a.category.toLowerCase();
        valB = b.category.toLowerCase();
      }

      // Apply sort order
      if (sortOrder === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    return result;
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Get sorted and filtered expenses
  const filteredExpenses = getSortedAndFilteredExpenses();

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
          <div className='animate-spin h-12 w-12 border-t-2 border-b-2 border-red-500 rounded-full mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading your expense data...</p>
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
            onClick={fetchExpenses}
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors'
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
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mt-6 mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4 md:mb-0'>
            Expense Management
          </h2>
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={handlePrint}
              className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg shadow-sm transition-all flex items-center text-sm'
            >
              <FaPrint className='mr-2' />
              <span>Print</span>
            </button>

            <button
              onClick={() => {
                setShowForm(!showForm);
                setFormData({ category: "", amount: "" });
                setIsEditing(false);
              }}
              className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center'
            >
              {showForm ? (
                <span>Cancel</span>
              ) : (
                <>
                  <FaPlus className='mr-2' />
                  <span>Add Expense</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <div
            className={`bg-white rounded-xl p-5 shadow-md transition-all duration-500 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className='flex items-center mb-3'>
              <div className='bg-red-100 p-3 rounded-full text-red-600 mr-3'>
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
                    d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <h3 className='text-gray-600 text-sm font-medium'>
                Total Expenses
              </h3>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              ${stats.totalExpense.toFixed(2)}
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
              <div className='bg-orange-100 p-3 rounded-full text-orange-600 mr-3'>
                <FaChartPie />
              </div>
              <h3 className='text-gray-600 text-sm font-medium'>
                Top Category
              </h3>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              ${stats.topCategory.amount.toFixed(2)}
            </p>
            <p className='text-sm text-gray-500 mt-1 capitalize'>
              {stats.topCategory.category}
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
              <div className='bg-blue-100 p-3 rounded-full text-blue-600 mr-3'>
                <FaInfoCircle />
              </div>
              <h3 className='text-gray-600 text-sm font-medium'>
                Average Expense
              </h3>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              ${stats.avgExpense.toFixed(2)}
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
              <div className='bg-purple-100 p-3 rounded-full text-purple-600 mr-3'>
                <FaCalendarAlt />
              </div>
              <h3 className='text-gray-600 text-sm font-medium'>
                Recent Spending
              </h3>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              ${stats.recentActivity.total.toFixed(2)}
            </p>
            <p className='text-sm text-gray-500 mt-1'>
              from {stats.recentActivity.count} transactions (30 days)
            </p>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div
            id='expense-form'
            className='bg-white p-6 rounded-xl shadow-md max-w-md mb-8 border border-red-100 transition-all duration-300 animate-fadeIn'
          >
            <h3 className='text-xl font-semibold mb-4 text-gray-800 flex items-center'>
              {isEditing ? (
                <>
                  <FaEdit className='mr-2 text-red-500' />
                  <span>Update Expense</span>
                </>
              ) : (
                <>
                  <FaPlus className='mr-2 text-red-500' />
                  <span>Add New Expense</span>
                </>
              )}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block mb-1 text-sm font-medium text-gray-700'>
                  Category
                </label>
                <input
                  type='text'
                  className='w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none'
                  placeholder='e.g. Groceries, Rent, Utilities'
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  list='categories'
                />
                <datalist id='categories'>
                  {categories.map((category, idx) => (
                    <option key={idx} value={category} />
                  ))}
                </datalist>
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
                    className='w-full border border-gray-300 p-2 pl-8 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none'
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
                  className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-colors shadow-md mr-2 flex-grow'
                >
                  {isEditing ? "Update Expense" : "Save Expense"}
                </button>

                {isEditing && (
                  <button
                    type='button'
                    onClick={() => {
                      setShowForm(false);
                      setIsEditing(false);
                      setFormData({ category: "", amount: "" });
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

        {/* Filter and Sort Controls */}
        {expenseList.length > 0 && (
          <div
            className={`mb-6 transition-all duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className='bg-white p-4 rounded-lg shadow-sm'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                {/* Category Filter */}
                <div className='flex items-center flex-wrap mb-4 md:mb-0'>
                  <div className='flex items-center mr-2 text-gray-500'>
                    <FaFilter className='mr-2' />
                    <span className='text-sm font-medium'>Filter:</span>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        selectedCategory === "all"
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition-colors`}
                    >
                      All Categories
                    </button>
                    {categories.map((category, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap capitalize ${
                          selectedCategory === category
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } transition-colors`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Controls */}
                <div className='flex items-center'>
                  <div className='flex items-center mr-2 text-gray-500'>
                    <FaSort className='mr-2' />
                    <span className='text-sm font-medium'>Sort by:</span>
                  </div>

                  <div className='flex rounded-lg bg-gray-100 overflow-hidden'>
                    <button
                      onClick={() => handleSort("date")}
                      className={`px-3 py-1 text-sm ${
                        sortBy === "date"
                          ? "bg-gray-700 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      Date{" "}
                      {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                      onClick={() => handleSort("amount")}
                      className={`px-3 py-1 text-sm ${
                        sortBy === "amount"
                          ? "bg-gray-700 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      Amount{" "}
                      {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                      onClick={() => handleSort("category")}
                      className={`px-3 py-1 text-sm ${
                        sortBy === "category"
                          ? "bg-gray-700 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      Category{" "}
                      {sortBy === "category" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expense Table */}
        <div
          className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
            <h3 className='text-xl font-semibold text-gray-800'>
              {selectedCategory === "all"
                ? "All Expenses"
                : `Expenses: ${selectedCategory}`}
              {selectedCategory !== "all" && (
                <span className='ml-2 text-sm font-normal text-gray-500'>
                  ({filteredExpenses.length} items)
                </span>
              )}
            </h3>
            {expenseList.length > 0 && (
              <button
                onClick={fetchExpenses}
                className='text-red-500 hover:text-red-600 transition-colors text-sm flex items-center'
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

          {filteredExpenses.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full table-auto'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Category
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
                  {filteredExpenses.map((item, index) => (
                    <tr
                      key={index}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4 font-medium text-gray-800 capitalize'>
                        {item.category}
                      </td>
                      <td className='px-6 py-4 text-red-600 font-medium'>
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
                            title='Edit expense'
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className='text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded'
                            title='Delete expense'
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
              <p>
                {selectedCategory === "all"
                  ? "No expense records available."
                  : `No expenses found in category "${selectedCategory}".`}
              </p>
              <div className='mt-4 flex justify-center space-x-3'>
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className='text-red-500 hover:text-red-600 transition-colors text-sm font-medium'
                  >
                    Show all categories
                  </button>
                )}
                <button
                  onClick={() => setShowForm(true)}
                  className='text-red-500 hover:text-red-600 transition-colors text-sm font-medium'
                >
                  Add an expense
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Extra Print Styles (hidden in normal view) */}
        <style jsx>{`
          @media print {
            header,
            footer,
            button,
            .no-print {
              display: none !important;
            }
            body,
            html {
              background-color: white !important;
            }
            .bg-white {
              box-shadow: none !important;
              border: 1px solid #e5e7eb !important;
            }
            .min-h-screen {
              min-height: auto !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Expense;
