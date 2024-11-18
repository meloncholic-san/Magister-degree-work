const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { verifyToken } = require('../middleware/authMiddleware');

// Роуты голосования
router.get('/current', verifyToken, voteController.getCurrentVote);
router.get('/history', verifyToken, voteController.getVoteHistory);
router.post('/', verifyToken, voteController.createVote);
router.post('/vote', verifyToken, voteController.vote);

module.exports = router;
