const express = require('express');
const router = express.Router();
const { getShowsByMovie, getShowById, addShow, deleteShow } = require('../controllers/showController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/movie/:movieId', getShowsByMovie);
router.get('/:id', getShowById);
router.post('/', protect, adminOnly, addShow);
router.delete('/:id', protect, adminOnly, deleteShow);

module.exports = router;
