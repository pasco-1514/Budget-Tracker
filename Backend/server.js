require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const session   = require('express-session');
const passport  = require('passport');

// 1) DB & passport
require('./config/database')();
require('./config/passport')(passport);

const app = express();
app.use(cors({ origin:'http://localhost:5500', credentials:true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// 2) Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tx',   require('./routes/transactions'));
app.use('/api/bud',  require('./routes/budgets'));

app.get('/', (req,res) => res.send('API is up'));


const PORT = process.env.PORT||5000;
app.listen(PORT,()=> console.log(`🚀 Backend listening on ${PORT}`));


