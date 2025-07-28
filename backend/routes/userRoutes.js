// A humanly written comment:
// This file is like a switchboard operator. It takes an incoming URL
// (like '/leaderboard') and connects it to the right function in the controller
// (like 'getLeaderboard'). It keeps our main server file clean.

const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users', userController.getAllUsers);
router.post('/users', userController.addUser);

router.get('/leaderboard', userController.getLeaderboard);
router.post('/claim', userController.claimPoints);

module.exports = router;