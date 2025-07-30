const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const allowedOrigins = [
  'https://leaderboard-task-coral.vercel.app/', 
  'http://localhost:5173',                   // Your local frontend for testing
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

const db = process.env.MONGO_URI;

if (!db) {
  console.error('FATAL ERROR: MONGO_URI is not defined in the .env file.');
  process.exit(1);
}

mongoose
  .connect(db)
  .then(() => {
    console.log('MongoDB connection successful!');
    const { seedInitialUsers } = require('./controllers/userController');
    seedInitialUsers();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes');

app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Backend server is running with perfection on port ${port}`);
});