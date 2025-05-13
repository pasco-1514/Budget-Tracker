const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Check if model already exists. If so, reuse it.
module.exports = mongoose.models.User
  ? mongoose.model('User')
  : mongoose.model('User', UserSchema);
