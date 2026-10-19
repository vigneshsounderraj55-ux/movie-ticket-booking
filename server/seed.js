// Run this script to add sample movies to your database
// Usage: node seed.js

const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('./models/Movie');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moviebooking';

const sampleMovies = [
  {
    title: 'Avengers: Endgame',
    image: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg',
    genre: 'Action',
    language: 'English',
    duration: 181,
    description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
    rating: 8.4,
    releaseDate: '2019-04-26',
  },
  {
    title: 'Inception',
    image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    genre: 'Sci-Fi',
    language: 'English',
    duration: 148,
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    rating: 8.8,
    releaseDate: '2010-07-16',
  },
  {
    title: 'The Dark Knight',
    image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    genre: 'Action',
    language: 'English',
    duration: 152,
    description: 'Batman must deal with the chaos unleashed by the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.',
    rating: 9.0,
    releaseDate: '2008-07-18',
  },
  {
    title: 'Interstellar',
    image: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    genre: 'Sci-Fi',
    language: 'English',
    duration: 169,
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    rating: 8.6,
    releaseDate: '2014-11-07',
  },
  {
    title: 'Parasite',
    image: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
    genre: 'Thriller',
    language: 'Korean',
    duration: 132,
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    rating: 8.5,
    releaseDate: '2019-05-30',
  },
  {
    title: 'Spider-Man: No Way Home',
    image: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
    genre: 'Action',
    language: 'English',
    duration: 148,
    description: 'Peter Parker asks Doctor Strange to help people forget his identity as Spider-Man, but the spell goes wrong and brings villains from other universes.',
    rating: 8.2,
    releaseDate: '2021-12-17',
  },
];

const seedAdmin = {
  name: 'Admin User',
  email: 'admin@cinebook.com',
  password: 'admin123',
  isAdmin: true,
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    console.log('🗑️  Cleared existing movies');

    // Add movies
    await Movie.insertMany(sampleMovies);
    console.log(`🎬 Added ${sampleMovies.length} sample movies`);

    // Create admin user (if not exists)
    const existing = await User.findOne({ email: seedAdmin.email });
    if (!existing) {
      await User.create(seedAdmin);
      console.log('👤 Admin user created: admin@cinebook.com / admin123');
    } else {
      console.log('👤 Admin user already exists');
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('📧 Admin Login: admin@cinebook.com');
    console.log('🔑 Admin Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
