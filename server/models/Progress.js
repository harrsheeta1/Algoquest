const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: String,
  mode: String,
  difficulty: String,
  minPathSum: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', ProgressSchema);
