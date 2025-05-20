// src/components/Layouts/Header.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="w-full flex justify-between items-center bg-purple-600 p-4 text-white shadow-md mb-6">
      <h1 className="text-xl font-bold">💸 Budget Buddy</h1>
      <nav className="flex gap-4">
        <Link to="/dashboard" className="hover:underline">Home</Link>
        <Link to="/dashboard/income" className="hover:underline">Income</Link>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
      </nav>
    </header>
  );
};

export default Header;
