const mongoose = require('mongoose');

module.exports = () => {
  const uri = process.env.MONGO_URI;
  console.log('🔍 Connecting with MONGO_URI:', uri);

  mongoose
    .connect(uri)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
};
