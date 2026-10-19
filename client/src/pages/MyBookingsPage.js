import React, { useEffect, useState } from 'react';
import { fetchMyBookings } from '../utils/api';
import { Link } from 'react-router-dom';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchMyBookings();
        setBookings(data);
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Loading your bookings...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl text-white tracking-wide mb-2">MY BOOKINGS</h1>
      <p className="text-gray-400 mb-8">Your ticket booking history</p>

      {bookings.length === 0 ? (
        <div className="card p-16 text-center text-gray-500">
          <p className="text-5xl mb-4">🎟️</p>
          <p className="text-xl font-semibold mb-2">No bookings yet</p>
          <p className="text-sm mb-6">Book your first movie ticket to get started!</p>
          <Link to="/" className="btn-primary">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card p-5 flex flex-col sm:flex-row gap-5">
              {/* Movie Poster */}
              <img
                src={booking.movie?.image}
                alt={booking.movie?.title}
                className="w-full sm:w-24 h-36 sm:h-32 object-cover rounded-lg border border-border flex-shrink-0"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/96x128/12121A/E50914?text=🎬`;
                }}
              />

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold text-white">{booking.movie?.title}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {booking.movie?.genre} &nbsp;·&nbsp; {booking.movie?.duration} min
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border ${
                    booking.status === 'confirmed'
                      ? 'bg-green-900/30 text-green-400 border-green-700/50'
                      : 'bg-red-900/30 text-red-400 border-red-700/50'
                  }`}>
                    {booking.status === 'confirmed' ? '✓ Confirmed' : '✕ Cancelled'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Theater</p>
                    <p className="text-sm text-gray-200 mt-0.5">{booking.show?.theater}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                    <p className="text-sm text-gray-200 mt-0.5">{booking.show?.showDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                    <p className="text-sm text-gray-200 mt-0.5">{booking.show?.showTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Paid</p>
                    <p className="text-sm text-primary font-bold mt-0.5">₹{booking.totalAmount}</p>
                  </div>
                </div>

                {/* Seats */}
                <div className="mt-3 flex flex-wrap gap-1 items-center">
                  <span className="text-xs text-gray-500 mr-1">Seats:</span>
                  {booking.seats?.map((seat) => (
                    <span key={seat} className="bg-primary/10 border border-primary/30 text-primary text-xs px-2 py-0.5 rounded-full">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
