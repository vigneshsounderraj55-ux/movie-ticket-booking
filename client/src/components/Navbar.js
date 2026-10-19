import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-dark/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-primary text-2xl">🎬</span>
            <span className="font-display text-2xl text-white tracking-widest group-hover:text-primary transition-colors">
              CINEBOOK
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-gray-300 hover:text-white'
              }`}
            >
              Movies
            </Link>
            {user && (
              <Link
                to="/my-bookings"
                className={`text-sm font-medium transition-colors ${
                  isActive('/my-bookings') ? 'text-primary' : 'text-gray-300 hover:text-white'
                }`}
              >
                My Bookings
              </Link>
            )}
            {user?.isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin') ? 'text-primary' : 'text-gray-300 hover:text-white'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 text-sm">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-outline text-sm py-2 px-4">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">
            Movies
          </Link>
          {user && (
            <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">
              My Bookings
            </Link>
          )}
          {user?.isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="btn-outline w-full text-sm">
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-center text-sm">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
