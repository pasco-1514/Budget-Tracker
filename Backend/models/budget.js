const mongoose = require('mongoose');
const s = new mongoose.Schema({
  user:     { type:mongoose.ObjectId, ref:'User' },
  category: String,
  limit:    Number,
  created:  { type:Date, default:Date.now }
});
module.exports = mongoose.model('Budget', s);
