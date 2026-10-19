const Booking = require('../models/Booking');
const Show = require('../models/Show');

// @desc    Book tickets
// @route   POST /api/bookings
// @access  Private
const bookTickets = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    // Find the show
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    // Check if seats are already booked
    const alreadyBooked = seats.filter((seat) => show.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message: `Seats already booked: ${alreadyBooked.join(', ')}`,
      });
    }

    // Calculate total amount
    const totalAmount = seats.length * show.ticketPrice;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      movie: show.movie,
      show: showId,
      seats,
      totalAmount,
    });

    // Update show's bookedSeats
    show.bookedSeats = [...show.bookedSeats, ...seats];
    await show.save();

    // Populate and return
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title image genre')
      .populate('show', 'theater showTime showDate ticketPrice');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title image genre duration')
      .populate('show', 'theater showTime showDate ticketPrice')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title')
      .populate('show', 'theater showTime showDate')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookTickets, getMyBookings, getAllBookings };
