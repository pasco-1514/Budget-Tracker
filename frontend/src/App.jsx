import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";

// Loading spinner component
const LoadingSpinner = () => (
  <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
    <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
      <div className='animate-spin h-12 w-12 border-t-2 border-b-2 border-violet-500 rounded-full mx-auto mb-4'></div>
      <p className='text-gray-600'>Loading...</p>
    </div>
  </div>
);

// Not found page with style
const NotFound = () => (
  <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
    <div className='bg-white p-8 rounded-xl shadow-lg text-center max-w-md'>
      <div className='text-violet-500 text-5xl mb-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-24 w-24 mx-auto'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </div>
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>
        404 - Page Not Found
      </h1>
      <p className='text-gray-600 mb-6'>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => (window.location.href = "/dashboard")}
        className='bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition-colors'
      >
        Back to Dashboard
      </button>
    </div>
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Check auth on initial load
  useEffect(() => {
    // Simulate auth check with a small delay for better UX
    const timer = setTimeout(() => {
      setAuthChecked(true);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Default Redirect */}
        <Route path='/' element={<RootRedirect />} />

        {/* Auth Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />

        {/* Dashboard Layout with Nested Routes */}
        <Route
          path='/'
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path='dashboard' element={<Home />} />
          <Route path='income' element={<Income />} />
          <Route path='expenses' element={<Expense />} />
        </Route>

        {/* 404 fallback */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

// Redirect based on auth
const RootRedirect = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

// Protect dashboard routes with better UX
const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login but remember where they were trying to go
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
