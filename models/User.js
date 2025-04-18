const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // ✅ Add password field
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email }, // 🔥 FIXED: using id instead of _id
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return token;
};



module.exports = mongoose.model('User', userSchema);
