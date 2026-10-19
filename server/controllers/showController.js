const Show = require('../models/Show');

// @desc    Get shows for a movie
// @route   GET /api/shows/movie/:movieId
// @access  Public
const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId }).populate('movie', 'title');
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single show by ID
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie');
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new show
// @route   POST /api/shows
// @access  Private/Admin
const addShow = async (req, res) => {
  try {
    const { movie, theater, showTime, showDate, totalSeats, ticketPrice } = req.body;
    const show = await Show.create({ movie, theater, showTime, showDate, totalSeats, ticketPrice });
    res.status(201).json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getShowsByMovie, getShowById, addShow, deleteShow };
