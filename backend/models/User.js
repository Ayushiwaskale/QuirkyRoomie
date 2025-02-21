const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  flatCode: { type: String, required: true },
  karmaPoints: { type: Number, default: 0 }, // Ensure this field is defined
});

module.exports = mongoose.model('User', userSchema);
