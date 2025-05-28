require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminroutes');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminRoutes);

// Pages
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login', { success: null, error: null }));
app.get('/signup', (req, res) => res.render('signup', { error: null }));
app.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard',
        currentPage: 'dashboard',
        API_URL: process.env.API_URL || 'http://localhost:5000'
    });
});
app.get('/income/add', (req, res) => res.render('addIncome', { error: null }));
app.get('/admin/dashboard', (req, res) => {
  res.render('adminDashboard'); // you'll create this EJS view
});
app.get('/income', (req, res) => {
    res.render('income', {
        title: 'Income Management',
        currentPage: 'income',
        API_URL: process.env.API_URL || 'http://localhost:5000'
    });
});
app.get('/expenses', (req, res) => {
    res.render('expense', {
        title: 'Expense Management',
        currentPage: 'expenses',
        API_URL: process.env.API_URL || 'http://localhost:5000'
    });
});

// Signup EJS route
app.post('/signup', async (req, res) => {
  try {
    await axios.post('http://localhost:5000/api/v1/auth/register', req.body);
    res.render('login', { success: 'User registered.', error: null });
  } catch (err) {
    res.render('signup', { error: 'Registration failed.' });
  }
});

// ✅ Create admin after DB is connected
async function createAdmin() {
  const adminEmail = 'admin@budget.com';
  await User.deleteOne({ email: adminEmail }); // optional, for clean test
  const exists = await User.findOne({ email: adminEmail });
  if (exists) return;
  
  await User.create({
  fullName: 'Super Admin',
  email: adminEmail,
  password: 'Admin1234!',  // plain password — let pre('save') hash it
  isAdmin: true
});

  console.log('✅ Admin created');
}

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        createAdmin();
      });
    });