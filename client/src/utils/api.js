import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ───────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// ─── Movies ─────────────────────────────────────────
export const fetchAllMovies = () => API.get('/movies');
export const fetchMovieById = (id) => API.get(`/movies/${id}`);
export const createMovie = (data) => API.post('/movies', data);
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

// ─── Shows ──────────────────────────────────────────
export const fetchShowsByMovie = (movieId) => API.get(`/shows/movie/${movieId}`);
export const fetchShowById = (id) => API.get(`/shows/${id}`);
export const createShow = (data) => API.post('/shows', data);
export const deleteShow = (id) => API.delete(`/shows/${id}`);

// ─── Bookings ───────────────────────────────────────
export const bookTickets = (data) => API.post('/bookings', data);
export const fetchMyBookings = () => API.get('/bookings/my');
export const fetchAllBookings = () => API.get('/bookings');
