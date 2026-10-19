import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShowById, bookTickets } from '../utils/api';
import Toast from '../components/Toast';

// Generate seat labels: A1-E10 (5 rows × 10 cols = 50 seats)
const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return rows.flatMap((row) => cols.map((col) => `${row}${col}`));
};

const ALL_SEATS = generateSeats();

const SeatBookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadShow = async () => {
      try {
        const { data } = await fetchShowById(showId);
        setShow(data);
      } catch {
        setToast({ message: 'Show not found', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadShow();
  }, [showId]);

  const isBooked = (seat) => show?.bookedSeats?.includes(seat);
  const isSelected = (seat) => selectedSeats.includes(seat);

  const toggleSeat = (seat) => {
    if (isBooked(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) {
      setToast({ message: 'Please select at least one seat', type: 'error' });
      return;
    }
    setBooking(true);
    try {
      await bookTickets({ showId, seats: selectedSeats });
      setToast({ message: '🎉 Booking confirmed!', type: 'success' });
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Booking failed', type: 'error' });
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Loading show details...
    </div>
  );

  const rows = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Show Info */}
      {show && (
        <div className="card p-5 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl text-white tracking-wide">
                {show.movie?.title}
              </h1>
              <p className="text-gray-400 mt-1">
                📍 {show.theater} &nbsp;|&nbsp; 📅 {show.showDate} &nbsp;|&nbsp; 🕐 {show.showTime}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Price per seat</p>
              <p className="text-2xl font-bold text-primary">₹{show.ticketPrice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Screen */}
      <div className="relative mb-8">
        <div className="h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-70" />
        <p className="text-center text-gray-500 text-xs mt-2 tracking-widest uppercase">Screen</p>
      </div>

      {/* Seat Grid */}
      <div className="card p-6 mb-6">
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-5 text-gray-500 text-xs font-bold text-center">{row}</span>
              <div className="flex gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => {
                  const seat = `${row}${col}`;
                  const booked = isBooked(seat);
                  const selected = isSelected(seat);
                  return (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={booked}
                      title={seat}
                      className={`w-8 h-8 rounded text-xs font-semibold border transition-all ${
                        booked
                          ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                          : selected
                          ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/50'
                          : 'bg-card border-border text-gray-400 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-5 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-border bg-card" />
            <span className="text-xs text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-primary bg-primary" />
            <span className="text-xs text-gray-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border border-gray-600 bg-gray-700" />
            <span className="text-xs text-gray-400">Booked</span>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 text-sm">Selected Seats</p>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedSeats.sort().map((s) => (
                  <span key={s} className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full border border-primary/30">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm mt-1">None selected</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Total Amount</p>
            <p className="text-3xl font-bold text-white">
              ₹{selectedSeats.length * (show?.ticketPrice || 0)}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline flex-1"
          >
            ← Back
          </button>
          <button
            onClick={handleBook}
            disabled={selectedSeats.length === 0 || booking}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {booking ? 'Booking...' : `Confirm ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatBookingPage;
