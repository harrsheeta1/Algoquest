const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  progress: {
    mazeGame: { level: Number, score: Number },
    treasureHunt: { level: Number, score: Number },
  },
});

module.exports = mongoose.model('User', userSchema);
