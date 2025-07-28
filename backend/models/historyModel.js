// A humanly written comment:
// This is our logbook. Every time someone claims points,
// we create a record here. This is great for auditing or
// for future features like showing a user's claim history.
// We link it back to the User model using a 'ref'.

const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // This creates a reference to the User model
    required: [true, 'History must belong to a user.'],
  },
  pointsClaimed: {
    type: Number,
    required: [true, 'History must have the number of points claimed.'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const History = mongoose.model('History', historySchema);

module.exports = History;