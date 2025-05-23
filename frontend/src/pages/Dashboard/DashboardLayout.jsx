import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import {
  FaWallet,
  FaHome,
  FaMoneyBillWave,
  FaReceipt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCog,
} from "react-icons/fa";

const DashboardLayout = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Add initial loading animation
    setIsLoaded(true);

    // Add smooth scrolling to top on route change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Check if link is active
  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname.includes(path) && path !== "/dashboard";
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background decoration - wavy pattern */}
      <div className='fixed top-0 w-full h-64 overflow-hidden z-0 opacity-50'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1440 320'
          className='w-full h-full'
        >
          <path
            fill='#a78bfa'
            fillOpacity='0.2'
            d='M0,160L48,154.7C96,149,192,139,288,149.3C384,160,480,192,576,186.7C672,181,768,139,864,128C960,117,1056,139,1152,165.3C1248,192,1344,224,1392,240L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
          ></path>
        </svg>
      </div>

      <div className='relative z-10'>
        <Outlet />
      </div>

      {/* Footer */}
      <footer className='bg-white shadow-md py-4 mt-12 relative z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-4 md:mb-0'>
            <h3 className='text-lg font-bold text-violet-600 flex items-center'>
              <FaWallet className='text-xl mr-2' />
              Budget Buddy
            </h3>
            <p className='text-gray-500 text-sm'>
              Track your finances with ease
            </p>
          </div>

          <div className='flex flex-wrap justify-center space-x-1 mb-4 md:mb-0'>
            <FooterLink
              to='/dashboard'
              icon={<FaHome />}
              label='Home'
              isActive={isActive("/dashboard")}
            />
            <FooterLink
              to='/income'
              icon={<FaMoneyBillWave />}
              label='Income'
              isActive={isActive("/income")}
            />
            <FooterLink
              to='/expenses'
              icon={<FaReceipt />}
              label='Expenses'
              isActive={isActive("/expenses")}
            />
            <FooterLink
              to='/settings'
              icon={<FaCog />}
              label='Settings'
              isActive={isActive("/settings")}
            />
          </div>
        </div>

        <div className='mt-4 text-center text-sm text-gray-500'>
          <p>© {new Date().getFullYear()} Budget Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Footer Link Component
const FooterLink = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-lg flex items-center transition-all ${
      isActive
        ? "bg-violet-100 text-violet-700 font-medium"
        : "text-gray-600 hover:bg-violet-100 hover:text-violet-700"
    }`}
  >
    <span className='mr-1'>{icon}</span>
    <span>{label}</span>
  </Link>
);

export default DashboardLayout;
