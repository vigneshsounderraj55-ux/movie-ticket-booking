const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, addMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', protect, adminOnly, addMovie);
router.put('/:id', protect, adminOnly, updateMovie);
router.delete('/:id', protect, adminOnly, deleteMovie);

module.exports = router;
