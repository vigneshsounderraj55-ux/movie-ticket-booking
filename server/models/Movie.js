const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Movie poster URL is required'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      default: 'English',
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    releaseDate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
