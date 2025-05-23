import React from "react";
import CARD_2 from "../../assets/images/card2.png";
// Replacing all Lucide icons with Bootstrap Icons
import {
  BiTrendingUp,
  BiPieChart,
  BiWallet,
  BiBarChart,
  BiShield,
} from "react-icons/bi";
import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-50 overflow-hidden'>
      {/* Content Side */}
      <motion.div
        className='w-full md:w-[55%] px-6 md:px-12 pt-8 pb-12 flex flex-col justify-between relative'
        initial='hidden'
        animate='visible'
        variants={containerVariants}
      >
        {/* Top decorative shapes */}
        <motion.div
          className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-100 to-transparent rounded-full -mr-32 -mt-32 opacity-70'
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        <motion.div
          className='absolute top-1/4 left-0 w-32 h-32 bg-gradient-to-br from-fuchsia-100 to-transparent rounded-full -ml-16 opacity-60'
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Logo & Brand */}
        <div className='z-10'>
          <motion.div
            className='flex items-center mb-8'
            variants={itemVariants}
          >
            <div className='bg-gradient-to-r from-violet-600 to-fuchsia-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200'>
              <BiWallet className='text-white text-xl' />
            </div>
            <h2 className='ml-3 text-xl font-bold text-gray-800 tracking-wide'>
              Budget Buddy
            </h2>
          </motion.div>

          {/* Form Container */}
          <motion.div
            className='bg-white rounded-2xl p-8 shadow-xl shadow-violet-200/20 border border-gray-100'
            variants={itemVariants}
          >
            {children}
          </motion.div>
        </div>

        {/* Testimonial/Stat Footer */}
        <motion.div
          className='mt-6 z-10 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-100/50'
          variants={itemVariants}
        >
          <div className='flex items-center justify-between'>
            <div className='flex'>
              <div className='flex -space-x-2'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold'>
                  JD
                </div>
                <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold'>
                  MK
                </div>
                <div className='w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-red-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold'>
                  SL
                </div>
              </div>
              <div className='ml-3'>
                <p className='text-gray-700 text-sm'>
                  Joined by <span className='font-bold'>10,000+</span> users
                </p>
                <div className='flex items-center'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className='w-3 h-3 text-yellow-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                  <span className='ml-1 text-xs text-gray-600'>4.9/5</span>
                </div>
              </div>
            </div>
            <div className='hidden md:block text-right'>
              <div className='text-xs text-gray-600'>TRUSTED BY COMPANIES</div>
              <div className='flex items-center justify-end mt-1 space-x-3'>
                <div className='w-12 h-5 bg-gray-200 rounded opacity-50'></div>
                <div className='w-16 h-5 bg-gray-300 rounded opacity-70'></div>
                <div className='w-14 h-5 bg-gray-400 rounded opacity-60'></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Image/Decorator Side */}
      <motion.div
        className='hidden md:block w-[45%] h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 overflow-hidden p-8 relative'
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Decorative elements */}
        <motion.div
          className='w-48 h-48 rounded-[40px] bg-white/10 backdrop-blur-md absolute -top-7 -left-5'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.div
          className='w-48 h-56 rounded-[40px] border-[10px] border-white/20 backdrop-blur-sm absolute top-[30%] -right-10'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        <motion.div
          className='w-48 h-48 rounded-[40px] bg-white/10 backdrop-blur-md absolute -bottom-7 -left-5'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />

        {/* Overlay pattern - using CSS background */}
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100 100H0V0h100v100zM0 71.429l12.5 12.5L25 171l12.5-12.5L25 37.5l12.5-12.5L50 37l12.5-12.5L50 0l25 25l12.5-12.5L75 0l-12.5 12.5L50 0z' fill='%23fff' fill-opacity='.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Content */}
        <div className='relative z-20 h-full flex flex-col justify-between'>
          <div>
            <motion.h2
              className='text-white text-3xl md:text-4xl font-bold mb-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Take control
              <br />
              of your finances
            </motion.h2>
            <motion.p
              className='text-violet-100 mb-8 max-w-md'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join thousands of users who use Budget Buddy to track expenses,
              manage income, and achieve financial goals.
            </motion.p>

            <div className='grid grid-cols-1 gap-4'>
              <motion.div
                variants={cardVariants}
                initial='hidden'
                animate='visible'
                transition={{ delay: 0.4 }}
              >
                <StatusInfoCard
                  icon={<BiTrendingUp />}
                  label='Track Income & Expenses'
                  color='bg-gradient-to-br from-violet-500 to-purple-600'
                />
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial='hidden'
                animate='visible'
                transition={{ delay: 0.6 }}
              >
                <StatusInfoCard
                  icon={<BiPieChart />}
                  label='Visualize Your Spending'
                  color='bg-gradient-to-br from-purple-500 to-fuchsia-600'
                />
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial='hidden'
                animate='visible'
                transition={{ delay: 0.8 }}
              >
                <StatusInfoCard
                  icon={<BiShield />}
                  label='Secure & Private Data'
                  color='bg-gradient-to-br from-fuchsia-500 to-pink-600'
                />
              </motion.div>
            </div>
          </div>

          <div className='relative'>
            <motion.img
              src={CARD_2}
              className='w-64 lg:w-[80%] mx-auto shadow-2xl shadow-purple-900/30 rounded-lg object-cover'
              alt='Financial Dashboard Preview'
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />

            {/* Floating stats */}
            <motion.div
              className='absolute top-10 -right-4 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className='flex items-center'>
                <div className='w-8 h-8 flex items-center justify-center bg-green-100 rounded-full text-green-600'>
                  <BiBarChart />
                </div>
                <div className='ml-2'>
                  <p className='text-xs text-gray-500'>SAVINGS</p>
                  <p className='text-sm font-bold text-gray-800'>+27.4%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className='absolute -bottom-4 left-10 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className='flex items-center'>
                <div className='w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600'>
                  <BiBarChart />
                </div>
                <div className='ml-2'>
                  <p className='text-xs text-gray-500'>GOALS</p>
                  <p className='text-sm font-bold text-gray-800'>
                    2/3 Achieved
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;

const StatusInfoCard = ({ icon, label, color }) => {
  return (
    <motion.div
      className='flex gap-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 z-10'
      whileHover={{
        y: -5,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 },
      }}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center text-[20px] text-white ${color} rounded-xl shadow-lg`}
      >
        {icon}
      </div>
      <div className='flex items-center'>
        <h6 className='text-gray-800 font-semibold'>{label}</h6>
      </div>
    </motion.div>
  );
};
