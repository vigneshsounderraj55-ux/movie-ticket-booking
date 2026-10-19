const express = require('express');
const router = express.Router();
const { bookTickets, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, bookTickets);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);

module.exports = router;
