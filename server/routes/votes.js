
//server/routes/votes
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware'); // Импорт middleware
const {
  getCurrentVote,
  getVoteHistory,
  createVote,
  vote,
  getVoterDetails,
} = require('../controllers/voteController');

const router = express.Router();

// Защищенные маршруты с использованием authMiddleware
router.get('/current', verifyToken, getCurrentVote);
router.get('/history', verifyToken, getVoteHistory);
router.post('/create', verifyToken, createVote);
router.post('/vote', verifyToken, vote); // Обробник для POST-запиту
router.get('/:voteId/voters', verifyToken, getVoterDetails);


module.exports = router;




