import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";

const AnalyticsChart = () => {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const incomeRes = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/get`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const expenseRes = await axios.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/get`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const income = incomeRes.data;
      const expense = expenseRes.data;

      const monthlyData = {};

      // Group Income
      income.forEach(({ date, amount }) => {
        const month = new Date(date).toLocaleString("default", {
          month: "short",
        });
        monthlyData[month] = monthlyData[month] || {
          month,
          income: 0,
          expense: 0,
        };
        monthlyData[month].income += amount;
      });

      // Group Expense
      expense.forEach(({ date, amount }) => {
        const month = new Date(date).toLocaleString("default", {
          month: "short",
        });
        monthlyData[month] = monthlyData[month] || {
          month,
          income: 0,
          expense: 0,
        };
        monthlyData[month].expense += amount;
      });

      // Convert to Array & sort by month
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const chartData = Object.values(monthlyData).sort(
        (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
      );

      setData(chartData);
      setIsLoading(false);
    } catch (err) {
      console.error("Chart fetch error:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate date range for display
  const getDateRange = () => {
    if (data.length === 0) return "No data available";

    // Find earliest and latest dates
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const sortedData = [...data].sort(
      (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
    );

    if (sortedData.length === 1)
      return `${sortedData[0].month} ${new Date().getFullYear()}`;

    return `${sortedData[0].month} to ${
      sortedData[sortedData.length - 1].month
    } ${new Date().getFullYear()}`;
  };

  const toggleChartType = () => {
    setChartType(chartType === "bar" ? "line" : "bar");
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className='flex items-center justify-center h-64'>
          <div className='animate-pulse flex space-x-2'>
            <div className='h-3 w-3 bg-violet-400 rounded-full'></div>
            <div className='h-3 w-3 bg-violet-500 rounded-full'></div>
            <div className='h-3 w-3 bg-violet-600 rounded-full'></div>
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className='flex items-center justify-center h-64 text-gray-400'>
          No transaction data available
        </div>
      );
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => [`$${value}`, ""]}
            />
            <Legend />
            <Bar
              dataKey='income'
              name='Income'
              fill='#a78bfa'
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey='expense'
              name='Expense'
              fill='#7c3aed'
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => [`$${value}`, ""]}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey='income'
              name='Income'
              stroke='#a78bfa'
              strokeWidth={3}
              dot={{ fill: "#a78bfa", r: 5 }}
              activeDot={{ r: 8, fill: "#7c3aed" }}
            />
            <Line
              type='monotone'
              dataKey='expense'
              name='Expense'
              stroke='#7c3aed'
              strokeWidth={3}
              dot={{ fill: "#7c3aed", r: 5 }}
              activeDot={{ r: 8, fill: "#a78bfa" }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className='bg-white p-6 rounded-xl shadow-lg mt-8 transition-all duration-300 hover:shadow-xl'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-xl font-semibold text-gray-800'>
            All Transactions
          </h2>
          <p className='text-sm text-gray-500 mt-1'>{getDateRange()}</p>
        </div>
        <div className='flex items-center'>
          <button
            onClick={toggleChartType}
            className='px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-lg transition-colors flex items-center text-sm font-medium'
          >
            Switch to {chartType === "bar" ? "Line" : "Bar"} Chart
          </button>
          <button
            onClick={fetchData}
            className='ml-2 p-2 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-lg transition-colors'
            title='Refresh data'
          >
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
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
          </button>
        </div>
      </div>

      {renderChart()}
    </div>
  );
};

export default AnalyticsChart;
