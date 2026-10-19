import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { fetchAllMovies } from '../utils/api';

const genres = ['All', 'Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const { data } = await fetchAllMovies();
        setMovies(data);
        setFiltered(data);
      } catch (err) {
        setError('Failed to load movies. Make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  // Filter by genre and search
  useEffect(() => {
    let result = movies;
    if (activeGenre !== 'All') {
      result = result.filter((m) => m.genre === activeGenre);
    }
    if (search.trim()) {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [activeGenre, search, movies]);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-b from-primary/20 via-dark to-dark py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-2xl mx-auto">
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-widest mb-3">
            CINEBOOK
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Book your favourite movies with ease
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11 text-center"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Genre Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeGenre === g
                  ? 'bg-primary border-primary text-white'
                  : 'border-border text-gray-400 hover:border-primary hover:text-primary'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-16 text-red-400">
            <p className="text-4xl mb-3">⚠️</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[2/3] bg-gray-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-gray-500 text-sm mb-4">{filtered.length} movie{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filtered.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </>
        ) : !error ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-xl font-semibold mb-1">No movies found</p>
            <p className="text-sm">Try a different genre or search term</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HomePage;
