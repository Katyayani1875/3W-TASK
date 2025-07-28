// A humanly written comment:
// This is where the magic happens. This file contains all the functions
// that do the actual work for our API endpoints.
// We've separated the logic from the routes to keep our code clean and organized.

const User = require('../models/userModel');
const History = require('../models/historyModel');

// A humanly written comment:
// This is our new and improved seeder function. On server start, it will
// wipe the slate clean and insert a predefined set of users with points.
// This is perfect for development and testing to ensure our leaderboard
// looks great every time we start the server.

const seedInitialUsers = async () => {
  try {
    // To ensure a consistent test environment, we clear previous data.
    await User.deleteMany({});
    console.log('Previous user data cleared.');

    // A professional and clean dataset for testing and demonstration.
    const professionalUsers = [
      { name: 'Elena Petrova', totalPoints: 2450 },      // Rank 1
      { name: 'Marcus Johnson', totalPoints: 2175 },     // Rank 2
      { name: 'Aisha Khan', totalPoints: 1980 },         // Rank 3
      { name: 'Liam O\'Connell', totalPoints: 1760 },    // Rank 4
      { name: 'Sofia Rossi', totalPoints: 1520 },        // Rank 5
      { name: 'Kenji Tanaka', totalPoints: 1240 },       // Rank 6
      { name: 'Chloe Dubois', totalPoints: 985 },        // Rank 7
      { name: 'David Miller', totalPoints: 730 },        // Rank 8
      { name: 'Isabella Garcia', totalPoints: 510 },     // Rank 9
      { name: 'Noah Williams', totalPoints: 355 },       // Rank 10
    ];

    await User.insertMany(professionalUsers);
    console.log('Database re-seeded successfully with professional data! ✨');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Get all users (for the dropdown)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name'); // We only need name and ID
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const newUser = await User.create({ name: req.body.name });
    res.status(201).json({ status: 'success', data: { user: newUser } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Failed to create user. Is the name unique?' });
  }
};

// Get the leaderboard (sorted users)
exports.getLeaderboard = async (req, res) => {
  try {
    // Find all users and sort them by points in descending order.
    const leaderboard = await User.find().sort({ totalPoints: -1 });
    res.status(200).json({ status: 'success', data: { leaderboard } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// The main feature: claiming points!
exports.claimPoints = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ status: 'fail', message: 'User ID is required.' });
    }

    // Generate a random number between 1 and 10.
    const randomPoints = Math.floor(Math.random() * 10) + 1;

    // Find the user and update their points in one atomic operation.
    // The { new: true } option makes sure we get the updated user back.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: randomPoints } }, // $inc is efficient for incrementing
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    // Now, let's log this event in our history collection.
    await History.create({
      userId: userId,
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
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Export the seeding function to be called on server start
exports.seedInitialUsers = seedInitialUsers;