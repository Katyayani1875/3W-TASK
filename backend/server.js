// A humanly written comment:
// This is the entry point of our backend. It starts the server,
// connects to the database, and sets up all the middleware.
// Think of it as the main engine of our application.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

// Load environment variables from our .env file
dotenv.config();

const app = express();

// Middlewares - These are functions that process requests before they hit our route handlers.
app.use(cors()); // Allows our React frontend to talk to this backend
app.use(express.json()); // Allows us to read JSON from the request body

// Connect to our MongoDB database
const db = process.env.MONGO_URI;
mongoose
  .connect(db)
  .then(() => {
    console.log('MongoDB connection successful! ✨');
    // We call our seeder function here after the connection is established.
    const { seedInitialUsers } = require('./controllers/userController');
    seedInitialUsers();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes); // All our user-related routes will be prefixed with /api

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend server is running with perfection on port ${port} 🔥`);
});