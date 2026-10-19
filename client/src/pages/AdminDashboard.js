import React, { useEffect, useState } from 'react';
import {
  fetchAllMovies, createMovie, deleteMovie,
  fetchAllBookings, createShow, deleteShow, fetchShowsByMovie
} from '../utils/api';
import Toast from '../components/Toast';

const emptyMovie = {
  title: '', image: '', genre: '', language: 'English',
  duration: '', description: '', rating: '', releaseDate: ''
};

const emptyShow = { movie: '', theater: '', showTime: '', showDate: '', totalSeats: 50, ticketPrice: 250 };

const AdminDashboard = () => {
  const [tab, setTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [shows, setShows] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovie);
  const [showForm, setShowForm] = useState(emptyShow);
  const [editMovie, setEditMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => { loadMovies(); loadBookings(); }, []);

  const loadMovies = async () => {
    try { const { data } = await fetchAllMovies(); setMovies(data); } catch {}
  };

  const loadBookings = async () => {
    try { const { data } = await fetchAllBookings(); setBookings(data); } catch {}
  };

  const loadShowsForMovie = async (movieId) => {
    try { const { data } = await fetchShowsByMovie(movieId); setShows(data); } catch {}
  };

  // ─── Movie Handlers ──────────────────────────────
  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { createMovie: create, updateMovie: update } = await import('../utils/api');
      if (editMovie) {
        await update(editMovie._id, movieForm);
        showToast('Movie updated successfully!');
        setEditMovie(null);
      } else {
        await create(movieForm);
        showToast('Movie added successfully!');
      }
      setMovieForm(emptyMovie);
      loadMovies();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save movie', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id);
      showToast('Movie deleted');
      loadMovies();
    } catch { showToast('Failed to delete', 'error'); }
  };

  const startEdit = (movie) => {
    setEditMovie(movie);
    setMovieForm({
      title: movie.title, image: movie.image, genre: movie.genre,
      language: movie.language, duration: movie.duration,
      description: movie.description, rating: movie.rating || '',
      releaseDate: movie.releaseDate || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Show Handlers ───────────────────────────────
  const handleShowSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createShow(showForm);
      showToast('Show added!');
      setShowForm(emptyShow);
      if (showForm.movie) loadShowsForMovie(showForm.movie);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add show', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Delete this show?')) return;
    try {
      await deleteShow(id);
      showToast('Show deleted');
      setShows(shows.filter((s) => s._id !== id));
    } catch { showToast('Failed to delete show', 'error'); }
  };

  const tabs = [
    { key: 'movies', label: '🎬 Movies' },
    { key: 'shows', label: '🎭 Shows' },
    { key: 'bookings', label: '🎟️ Bookings' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="font-display text-4xl text-white tracking-wide mb-2">ADMIN DASHBOARD</h1>
      <p className="text-gray-400 mb-6">Manage movies, shows, and bookings</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Movies', value: movies.length, icon: '🎬' },
          { label: 'Total Bookings', value: bookings.length, icon: '🎟️' },
          { label: 'Revenue', icon: '💰', value: `₹${bookings.reduce((s, b) => s + (b.totalAmount || 0), 0).toLocaleString()}` },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 text-center">
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* MOVIES TAB */}
      {tab === 'movies' && (
        <div className="space-y-8">
          {/* Add/Edit Form */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editMovie ? '✏️ Edit Movie' : '➕ Add New Movie'}
            </h2>
            <form onSubmit={handleMovieSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Movie Title *</label>
                <input className="input-field" placeholder="e.g. Avengers" value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Poster URL *</label>
                <input className="input-field" placeholder="https://..." value={movieForm.image}
                  onChange={(e) => setMovieForm({ ...movieForm, image: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Genre *</label>
                <select className="input-field" value={movieForm.genre}
                  onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })} required>
                  <option value="">Select genre</option>
                  {['Action','Drama','Comedy','Horror','Sci-Fi','Romance','Thriller','Animation'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Language *</label>
                <input className="input-field" placeholder="English" value={movieForm.language}
                  onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Duration (minutes) *</label>
                <input type="number" className="input-field" placeholder="120" value={movieForm.duration}
                  onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Rating (0-10)</label>
                <input type="number" step="0.1" min="0" max="10" className="input-field" placeholder="8.5" value={movieForm.rating}
                  onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Release Date</label>
                <input type="date" className="input-field" value={movieForm.releaseDate}
                  onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Description *</label>
                <textarea rows={3} className="input-field resize-none" placeholder="Movie description..." value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })} required />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                  {loading ? 'Saving...' : editMovie ? 'Update Movie' : 'Add Movie'}
                </button>
                {editMovie && (
                  <button type="button" onClick={() => { setEditMovie(null); setMovieForm(emptyMovie); }} className="btn-outline">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Movies List */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">All Movies ({movies.length})</h2>
            {movies.length === 0 ? (
              <div className="card p-10 text-center text-gray-500">No movies added yet.</div>
            ) : (
              <div className="space-y-3">
                {movies.map((movie) => (
                  <div key={movie._id} className="card p-4 flex items-center gap-4">
                    <img src={movie.image} alt={movie.title}
                      className="w-14 h-20 object-cover rounded-lg border border-border flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/56x80/12121A/E50914?text=🎬'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{movie.title}</p>
                      <p className="text-sm text-gray-400">{movie.genre} · {movie.language} · {movie.duration} min</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(movie)} className="btn-outline text-xs py-1.5 px-3">Edit</button>
                      <button onClick={() => handleDeleteMovie(movie._id)} className="bg-red-800 hover:bg-red-700 text-white text-xs py-1.5 px-3 rounded-lg">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SHOWS TAB */}
      {tab === 'shows' && (
        <div className="space-y-8">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">➕ Add New Show</h2>
            <form onSubmit={handleShowSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Select Movie *</label>
                <select className="input-field" value={showForm.movie}
                  onChange={(e) => { setShowForm({ ...showForm, movie: e.target.value }); if (e.target.value) loadShowsForMovie(e.target.value); }}
                  required>
                  <option value="">Select a movie</option>
                  {movies.map((m) => <option key={m._id} value={m._id}>{m.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Theater Name *</label>
                <input className="input-field" placeholder="e.g. PVR Cinemas" value={showForm.theater}
                  onChange={(e) => setShowForm({ ...showForm, theater: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Show Date *</label>
                <input type="date" className="input-field" value={showForm.showDate}
                  onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Show Time *</label>
                <input type="time" className="input-field" value={showForm.showTime}
                  onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Ticket Price (₹) *</label>
                <input type="number" className="input-field" placeholder="250" value={showForm.ticketPrice}
                  onChange={(e) => setShowForm({ ...showForm, ticketPrice: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Total Seats</label>
                <input type="number" className="input-field" value={showForm.totalSeats}
                  onChange={(e) => setShowForm({ ...showForm, totalSeats: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                  {loading ? 'Adding...' : 'Add Show'}
                </button>
              </div>
            </form>
          </div>

          {/* Shows for selected movie */}
          {shows.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Shows for Selected Movie</h2>
              <div className="space-y-3">
                {shows.map((show) => (
                  <div key={show._id} className="card p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{show.theater}</p>
                      <p className="text-sm text-gray-400">{show.showDate} at {show.showTime} · ₹{show.ticketPrice}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {show.bookedSeats?.length || 0}/{show.totalSeats} seats booked
                      </p>
                    </div>
                    <button onClick={() => handleDeleteShow(show._id)} className="bg-red-800 hover:bg-red-700 text-white text-xs py-1.5 px-3 rounded-lg">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BOOKINGS TAB */}
      {tab === 'bookings' && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">All Bookings ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <div className="card p-10 text-center text-gray-500">No bookings yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    {['User','Movie','Theater','Date','Time','Seats','Amount','Status'].map(h => (
                      <th key={h} className="pb-3 text-xs text-gray-500 uppercase tracking-wide pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b border-border/50 hover:bg-card transition-colors">
                      <td className="py-3 pr-4 text-gray-300">{b.user?.name}<br/><span className="text-xs text-gray-500">{b.user?.email}</span></td>
                      <td className="py-3 pr-4 text-white font-medium">{b.movie?.title}</td>
                      <td className="py-3 pr-4 text-gray-300">{b.show?.theater}</td>
                      <td className="py-3 pr-4 text-gray-300">{b.show?.showDate}</td>
                      <td className="py-3 pr-4 text-gray-300">{b.show?.showTime}</td>
                      <td className="py-3 pr-4"><div className="flex flex-wrap gap-1">{b.seats?.map(s => <span key={s} className="bg-primary/10 text-primary text-xs px-1.5 rounded">{s}</span>)}</div></td>
                      <td className="py-3 pr-4 text-primary font-bold">₹{b.totalAmount}</td>
                      <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
