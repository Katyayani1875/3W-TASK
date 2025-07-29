const mongoose = require('mongoose');
const User = require('../models/userModel');
const History = require('../models/historyModel');

const seedInitialUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('Previous user data cleared.');

    const indianUsers = [
      { name: 'Priya Sharma', totalPoints: 2450 },
      { name: 'Rohan Mehra', totalPoints: 2175 },
      { name: 'Ananya Gupta', totalPoints: 1980 },
      { name: 'Vikram Singh', totalPoints: 1760 },
      { name: 'Isha Patel', totalPoints: 1520 },
      { name: 'Arjun Reddy', totalPoints: 1240 },
      { name: 'Saanvi Desai', totalPoints: 985 },
      { name: 'Aditya Kumar', totalPoints: 730 },
      { name: 'Diya Joshi', totalPoints: 510 },
      { name: 'Kabir Verma', totalPoints: 355 },
    ];

    await User.insertMany(indianUsers);
    console.log('Database re-seeded successfully with professional Indian names!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('name');
      res.status(200).json({ status: 'success', data: { users } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error fetching users.' });
    }
  },
  addUser: async (req, res) => {
    try {
      const newUser = await User.create({ name: req.body.name });
      res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (error) {
      res.status(400).json({ status: 'error', message: 'Failed to create user. Is the name unique?' });
    }
  },
  getLeaderboard: async (req, res) => {
    try {
      const leaderboard = await User.find().sort({ totalPoints: -1 });
      res.status(200).json({ status: 'success', data: { leaderboard } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error fetching leaderboard.' });
    }
  },
  claimPoints: async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ status: 'fail', message: 'User ID is required.' });
      }
      const randomPoints = Math.floor(Math.random() * 10) + 1;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { totalPoints: randomPoints } },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ status: 'fail', message: 'User not found.' });
      }
      await History.create({
        userId: new mongoose.Types.ObjectId(userId),
        pointsClaimed: randomPoints,
      });
      res.status(200).json({
        status: 'success',
        message: `Successfully claimed ${randomPoints} points for ${updatedUser.name}!`,
        data: {
          pointsClaimed: randomPoints
        }
      });
    } catch (error) {
      console.error('Error in claimPoints:', error);
      res.status(500).json({ status: 'error', message: 'An internal server error occurred.' });
    }
  },
};


module.exports = {
  seedInitialUsers,
  userController,
};
