const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {

    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
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