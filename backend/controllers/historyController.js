// This controller is dedicated to handling the history logs.
// The star of the show here is the pagination logic, which ensures we can efficiently query and display thousands of logs without slowing down the app.

const History = require('../models/historyModel');

exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [totalLogs, logs] = await Promise.all([
      History.countDocuments(),
      History.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name')
        .lean()
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        logs,
      },
      pagination: {
        totalLogs,
        totalPages: Math.ceil(totalLogs / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// This function handles the logic for clearing all history logs.
exports.clearHistory = async (req, res) => {
  try {
    await History.deleteMany({}); //it Deletes all documents in the History collection
    res.status(200).json({
      status: 'success',
      message: 'Claim history cleared successfully.',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear history.',
    });
  }
};