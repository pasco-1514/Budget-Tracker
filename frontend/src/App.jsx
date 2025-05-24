import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import DashboardLayout from './pages/Dashboard/DashboardLayout'; // New layout

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard Layout with Nested Routes */}
        <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
          <Route index element={<Home />} />
          <Route path="income" element={<Income />} />
          <Route path="expense" element={<Expense />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;

// Redirect based on auth
const RootRedirect = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />;
};

// Protect dashboard routes
const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};
