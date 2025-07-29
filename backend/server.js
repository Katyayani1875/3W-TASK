const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = process.env.MONGO_URI;

if (!db) {
  console.error('FATAL ERROR: MONGO_URI is not defined in the .env file.');
  process.exit(1); // Exit the application if the database connection string is missing
}

mongoose
  .connect(db)
  .then(() => {
    console.log('MongoDB connection successful!');
    // importing the seeder function specifically
    const { seedInitialUsers } = require('./controllers/userController');
    seedInitialUsers();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit if we cannot connect to the database
  });

const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes');

app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Backend server is running with perfection on port ${port} `);
});