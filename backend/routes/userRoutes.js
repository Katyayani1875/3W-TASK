const express = require('express');
const { userController } = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);

router.get('/leaderboard', userController.getLeaderboard);

router.post('/claim', userController.claimPoints);

module.exports = router;