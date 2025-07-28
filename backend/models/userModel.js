// A humanly written comment:
// This file defines the 'User' in our database.
// Think of it as the blueprint for each user's data.
// We're keeping it simple: a name and their total points.
// The 'unique: true' for the name ensures we don't have duplicate users.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name.'],
    trim: true,
    unique: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;