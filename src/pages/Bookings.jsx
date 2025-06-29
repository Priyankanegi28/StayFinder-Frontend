import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Get image URL function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x200?text=Hotel+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_ENDPOINTS.UPLOADS}/${imagePath.replace(/^uploads\//, '')}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_ENDPOINTS.GET_BOOKINGS, {
          headers: { 'x-auth-token': token },
        });
        setBookings(res.data);
      } catch (err) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchBookings();
  }, [isAuthenticated]);

  // Styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2.5rem 1rem',
    background: '#F3F4F6',
    minHeight: '100vh',
  };
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
  };
  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#2563EB',
    marginBottom: '0.5rem',
  };
  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#6B7280',
    fontWeight: 400,
  };
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  };
  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #E5E7EB',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };
  const cardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  };
  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  };
  const cardContentStyle = {
    padding: '1.5rem',
  };
  const listingTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '0.5rem',
  };
  const locationStyle = {
    color: '#6B7280',
    fontSize: '0.95rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  };
  const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem',
  };
  const detailItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };
  const detailLabelStyle = {
    fontSize: '0.8rem',
    color: '#6B7280',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };
  const detailValueStyle = {
    fontSize: '0.95rem',
    color: '#111827',
    fontWeight: 600,
  };
  const priceStyle = {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#2563EB',
    textAlign: 'center',
    padding: '1rem',
    background: '#F0F9FF',
    borderRadius: '0.5rem',
    marginTop: '1rem',
  };
  const cancellationAlertStyle = {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginTop: '1rem',
    color: '#DC2626',
    fontSize: '0.9rem',
    fontWeight: 500,
  };
  const specialRequestStyle = {
    background: '#F0F9FF',
    border: '1px solid #BAE6FD',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#0369A1',
  };
  const emptyStateStyle = {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: '#FFFFFF',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  };
  const emptyIconStyle = {
    fontSize: '4rem',
    color: '#D1D5DB',
    marginBottom: '1rem',
  };
  const emptyTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.5rem',
  };
  const emptyTextStyle = {
    color: '#6B7280',
    fontSize: '1rem',
  };
  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    fontSize: '1.25rem',
    color: '#6B7280',
  };

  if (loading) {
    return <div style={loadingStyle}>Loading your bookings...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Bookings</h1>
        <p style={subtitleStyle}>Track all your hotel reservations</p>
      </div>

      {bookings.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>🏠</div>
          <h2 style={emptyTitleStyle}>No bookings yet</h2>
          <p style={emptyTextStyle}>Start exploring amazing places and book your next adventure!</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              style={cardStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = cardHoverStyle.transform;
                e.target.style.boxShadow = cardHoverStyle.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = cardStyle.boxShadow;
              }}
            >
              <img
                src={booking.listing && booking.listing.images && booking.listing.images.length > 0
                  ? getImageUrl(booking.listing.images[0])
                  : 'https://via.placeholder.com/400x200?text=Hotel+Image'
                }
                alt={booking.listing?.hotelName || 'Hotel'}
                style={imageStyle}
              />
              <div style={cardContentStyle}>
                <h2 style={listingTitleStyle}>{booking.listing?.title || 'Listing'}</h2>
                <div style={locationStyle}>
                  📍 {booking.listing?.address}, {booking.listing?.city}, {booking.listing?.country}
                </div>
                
                <div style={detailsGridStyle}>
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Check-in</span>
                    <span style={detailValueStyle}>
                      {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Check-out</span>
                    <span style={detailValueStyle}>
                      {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Guests</span>
                    <span style={detailValueStyle}>👥 {booking.guests}</span>
                  </div>
                  <div style={detailItemStyle}>
                    <span style={detailLabelStyle}>Status</span>
                    <span style={detailValueStyle}>
                      <span style={{ 
                        color: booking.status === 'confirmed' ? '#059669' : 
                               booking.status === 'cancelled' ? '#DC2626' : '#D97706',
                        fontWeight: 600
                      }}>
                        {booking.status === 'confirmed' ? '✅ Confirmed' : 
                         booking.status === 'cancelled' ? '❌ Cancelled' : '⏳ Pending'}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div style={priceStyle}>
                  Total: ${booking.totalPrice}
                </div>
                
                {/* Show cancellation alert if booking was cancelled due to hotel deletion */}
                {booking.status === 'cancelled' && 
                 booking.specialRequests && 
                 booking.specialRequests.includes('[SYSTEM MESSAGE] This booking was automatically cancelled because the hotel has been removed by the host.') && (
                  <div style={cancellationAlertStyle}>
                    ⚠️ <strong>Hotel Removed:</strong> This booking was automatically cancelled because the hotel has been removed by the host. Please book another hotel for your stay.
                  </div>
                )}
                
                {/* Show special requests if any */}
                {booking.specialRequests && 
                 !booking.specialRequests.includes('[SYSTEM MESSAGE]') && (
                  <div style={specialRequestStyle}>
                    <strong>Special Requests:</strong> {booking.specialRequests}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 