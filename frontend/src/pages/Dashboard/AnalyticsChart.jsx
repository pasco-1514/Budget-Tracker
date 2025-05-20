import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import axios from 'axios';

const AnalyticsChart = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const incomeRes = await axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/income/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const expenseRes = await axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/expense/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const income = incomeRes.data;
      const expense = expenseRes.data;

      const monthlyData = {};

      // Group Income
      income.forEach(({ date, amount }) => {
        const month = new Date(date).toLocaleString('default', { month: 'short' });
        monthlyData[month] = monthlyData[month] || { month, income: 0, expense: 0 };
        monthlyData[month].income += amount;
      });

      // Group Expense
      expense.forEach(({ date, amount }) => {
        const month = new Date(date).toLocaleString('default', { month: 'short' });
        monthlyData[month] = monthlyData[month] || { month, income: 0, expense: 0 };
        monthlyData[month].expense += amount;
      });

      // Convert to Array
      const chartData = Object.values(monthlyData);
      setData(chartData);
    } catch (err) {
      console.error("Chart fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Transactions</h2>
        <span className="text-sm text-gray-500">2nd Jan to 21st Dec</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#a78bfa" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="#7c3aed" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
