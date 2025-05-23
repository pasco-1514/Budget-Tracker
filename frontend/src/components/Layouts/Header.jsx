// src/components/Layouts/Header.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaWallet,
  FaHome,
  FaMoneyBillWave,
  FaReceipt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Check if link is active
  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname.includes(path) && path !== "/dashboard";
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white text-gray-800 shadow-md py-2"
          : "bg-violet-600 text-white py-4"
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center'>
        {/* Logo */}
        <Link to='/dashboard' className='flex items-center'>
          <FaWallet
            className={`text-2xl ${
              scrolled ? "text-violet-600" : "text-white"
            }`}
          />
          <h1 className='ml-2 text-xl font-bold'>Budget Buddy</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex space-x-1'>
          <NavLink
            to='/dashboard'
            icon={<FaHome />}
            label='Home'
            isActive={isActive("/dashboard")}
            scrolled={scrolled}
          />
          <NavLink
            to='/income'
            icon={<FaMoneyBillWave />}
            label='Income'
            isActive={isActive("/income")}
            scrolled={scrolled}
          />
          <NavLink
            to='/expenses'
            icon={<FaReceipt />}
            label='Expenses'
            isActive={isActive("/expenses")}
            scrolled={scrolled}
          />
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className='md:hidden'
          aria-label='Toggle menu'
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Logout Button (Desktop) */}
        <button
          onClick={handleLogout}
          className='hidden md:flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium ml-3'
        >
          <FaSignOutAlt className='mr-2' />
          Logout
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden bg-white shadow-lg rounded-b-lg mt-2 overflow-hidden'>
          <div className='px-4 py-2 space-y-1'>
            <MobileNavLink
              to='/dashboard'
              icon={<FaHome />}
              label='Home'
              isActive={isActive("/dashboard")}
            />
            <MobileNavLink
              to='/income'
              icon={<FaMoneyBillWave />}
              label='Income'
              isActive={isActive("/income")}
            />
            <MobileNavLink
              to='/expenses'
              icon={<FaReceipt />}
              label='Expenses'
              isActive={isActive("/expenses")}
            />

            <button
              onClick={handleLogout}
              className='w-full mt-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center'
            >
              <FaSignOutAlt className='mr-2' />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, icon, label, isActive, scrolled }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-lg flex items-center transition-all ${
      isActive
        ? scrolled
          ? "bg-violet-100 text-violet-700 font-medium"
          : "bg-violet-500 text-white font-medium"
        : scrolled
        ? "text-gray-600 hover:bg-gray-100"
        : "text-white hover:bg-violet-500"
    }`}
  >
    <span className='mr-1'>{icon}</span>
    <span>{label}</span>
  </Link>
);

// Mobile Navigation Link
const MobileNavLink = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-violet-100 text-violet-700 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <div className='flex items-center'>
      <span className='mr-3'>{icon}</span>
      <span>{label}</span>
    </div>
  </Link>
);

export default Header;
