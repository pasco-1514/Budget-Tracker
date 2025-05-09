const mongoose = require('mongoose');
const s = new mongoose.Schema({
  user:        { type:mongoose.ObjectId, ref:'User' },
  type:        { type:String, enum:['income','expense'] },
  amount:      Number,
  description: String,
  date:        { type:Date, default:Date.now }
});
module.exports = mongoose.model('Transaction', s);
