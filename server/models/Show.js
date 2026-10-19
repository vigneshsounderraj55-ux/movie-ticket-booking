const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theater: {
      type: String,
      required: [true, 'Theater name is required'],
    },
    showTime: {
      type: String,
      required: [true, 'Show time is required'],
    },
    showDate: {
      type: String,
      required: [true, 'Show date is required'],
    },
    totalSeats: {
      type: Number,
      default: 50,
    },
    bookedSeats: {
      type: [String], // array of seat labels like "A1", "B3"
      default: [],
    },
    ticketPrice: {
      type: Number,
      required: true,
      default: 250,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', showSchema);
