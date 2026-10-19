import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SeatBookingPage from './pages/SeatBookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark font-body">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />

              {/* Protected User Routes */}
              <Route
                path="/book/:showId"
                element={
                  <ProtectedRoute>
                    <SeatBookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                    <p className="text-7xl mb-4">🎬</p>
                    <h1 className="font-display text-5xl text-white mb-2">404</h1>
                    <p className="text-gray-400 mb-6">Oops! This page doesn't exist.</p>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
