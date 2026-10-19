import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieById, fetchShowsByMovie } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          fetchMovieById(id),
          fetchShowsByMovie(id),
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch {
        setError('Movie not found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBookShow = (showId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/book/${showId}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400 text-center">
        <p className="text-4xl mb-3 animate-spin">⏳</p>
        <p>Loading movie details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-400">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Movie Hero */}
      <div className="relative">
        {/* Blurred bg */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20"
          style={{ backgroundImage: `url(${movie.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 to-dark" />

        <div className="relative max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-48 md:w-64 rounded-xl shadow-2xl mx-auto border border-border"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/300x450/12121A/E50914?text=${encodeURIComponent(movie.title)}`;
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide mb-3">
              {movie.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full">
                {movie.genre}
              </span>
              <span className="text-xs bg-card text-gray-300 border border-border px-3 py-1 rounded-full">
                {movie.language}
              </span>
              <span className="text-xs bg-card text-gray-300 border border-border px-3 py-1 rounded-full">
                ⏱ {movie.duration} min
              </span>
              {movie.rating > 0 && (
                <span className="text-xs bg-yellow-900/40 text-yellow-400 border border-yellow-700/40 px-3 py-1 rounded-full">
                  ⭐ {movie.rating}/10
                </span>
              )}
            </div>
            {movie.releaseDate && (
              <p className="text-gray-500 text-sm mb-3">📅 Release: {movie.releaseDate}</p>
            )}
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          🎭 Available Shows ({shows.length})
        </h2>

        {shows.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">
            <p className="text-4xl mb-3">😕</p>
            <p>No shows available for this movie yet.</p>
            <p className="text-sm mt-1">Check back later or ask the admin to add shows.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shows.map((show) => {
              const availableSeats = show.totalSeats - show.bookedSeats.length;
              return (
                <div key={show._id} className="card p-5 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">{show.theater}</p>
                      <p className="text-sm text-gray-400 mt-0.5">📅 {show.showDate}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      availableSeats > 10 ? 'bg-green-900/40 text-green-400' :
                      availableSeats > 0 ? 'bg-yellow-900/40 text-yellow-400' :
                      'bg-red-900/40 text-red-400'
                    }`}>
                      {availableSeats > 0 ? `${availableSeats} seats left` : 'Housefull'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary font-bold text-lg">🕐 {show.showTime}</span>
                    <span className="text-white font-semibold">₹{show.ticketPrice}</span>
                  </div>

                  <button
                    onClick={() => handleBookShow(show._id)}
                    disabled={availableSeats === 0}
                    className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {availableSeats === 0 ? 'Housefull' : 'Book Tickets'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
