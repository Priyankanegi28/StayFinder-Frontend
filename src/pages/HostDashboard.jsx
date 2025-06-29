import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export default function HostDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Get image URL function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x200?text=Hotel+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_ENDPOINTS.UPLOADS}/${imagePath.replace(/^uploads\//, '')}`;
  };

  useEffect(() => {
    const fetchHostListings = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_LISTINGS, {
          params: { host: user.id },
        });
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.isHost) {
      fetchHostListings();
    }
  }, [user]);

  const handleDelete = async (id) => {
    // Add detailed confirmation dialog
    const isConfirmed = window.confirm(
      '⚠️ WARNING: Are you sure you want to delete this hotel?\n\n' +
      'This action will:\n' +
      '• Permanently remove the hotel from the platform\n' +
      '• Automatically cancel ALL existing bookings for this hotel\n' +
      '• Notify guests that their bookings have been cancelled\n\n' +
      'This action cannot be undone. Are you sure you want to continue?'
    );
    
    if (!isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Attempting to delete hotel:', id);
      console.log('Token exists:', !!token);
      
      const response = await axios.delete(API_ENDPOINTS.DELETE_LISTING(id), {
        headers: { 'x-auth-token': token },
      });
      
      console.log('Delete response:', response.data);
      
      // Remove from local state
      setListings((prev) => prev.filter((listing) => listing._id !== id));
      
      // Show success message with booking cancellation info
      const cancelledBookings = response.data.cancelledBookings || 0;
      const hotelName = response.data.hotelName || 'Hotel';
      
      if (cancelledBookings > 0) {
        alert(`✅ Hotel "${hotelName}" deleted successfully!\n\n${cancelledBookings} booking(s) were automatically cancelled and guests have been notified.`);
      } else {
        alert(`✅ Hotel "${hotelName}" deleted successfully!`);
      }
    } catch (err) {
      console.error('Error deleting hotel:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 401) {
        alert('Authentication failed. Please log in again.');
      } else if (err.response?.status === 404) {
        alert('Hotel not found. Please refresh the page.');
      } else if (err.response?.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert(err.response?.data?.msg || 'Failed to delete hotel. Please try again.');
      }
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2.5rem 1rem',
    background: '#F3F4F6',
    minHeight: '100vh',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
  };

  const headingStyle = {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#2563EB',
  };

  const buttonStyle = {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '0.7rem 1.5rem',
    borderRadius: '2rem',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    border: 'none',
    transition: 'background 0.2s',
    boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
  };

  const buttonHoverStyle = {
    backgroundColor: '#1D4ED8',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '1rem',
  };

  const cardStyle = {
    border: '1px solid #E5E7EB',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  };

  const imgStyle = {
    width: '100%',
    height: '14rem',
    objectFit: 'cover',
    borderTopLeftRadius: '1rem',
    borderTopRightRadius: '1rem',
  };

  const cardContentStyle = {
    padding: '1.25rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#222',
  };

  const textStyle = {
    color: '#4B5563',
    marginBottom: '0.5rem',
    fontSize: '1rem',
  };

  const priceStyle = {
    color: '#1F2937',
    fontWeight: 700,
    marginBottom: '1rem',
    fontSize: '1.1rem',
  };

  const actionsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  };

  const actionLinkStyle = {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'color 0.2s',
  };

  const actionLinkHover = {
    color: '#1E40AF',
  };

  const deleteButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#DC2626',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'color 0.2s',
  };

  const deleteHoverStyle = {
    color: '#991B1B',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '4rem 0',
    color: '#4B5563',
    background: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    marginTop: '2rem',
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 400,
    color: '#4B5563',
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.25rem' }}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Hotel Dashboard</h1>
        <p style={subtitleStyle}>Manage your hotels and view booking analytics</p>
        <Link
          to="/host/listings/new"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          + Add New Hotel
        </Link>
      </div>

      {/* Stats Section */}
      {listings.length > 0 && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #E5E7EB'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
            Hotel Overview
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#F0F9FF', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563EB' }}>{listings.length}</div>
              <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Total Hotels</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#F0FDF4', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>
                {listings.reduce((sum, listing) => sum + (listing.roomTypes?.length || 0), 0)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Room Types</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#FEF3C7', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#D97706' }}>
                {listings.reduce((sum, listing) => {
                  const roomTypes = listing.roomTypes || [];
                  return sum + roomTypes.reduce((roomSum, room) => roomSum + (room.available || 0), 0);
                }, 0)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Available Rooms</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#FEE2E2', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#DC2626' }}>
                {Math.round(listings.reduce((sum, listing) => sum + (listing.starRating || 0), 0) / listings.length * 10) / 10}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>Avg. Rating</div>
            </div>
          </div>
        </div>
      )}

      {listings.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>No hotels yet</h2>
          <p style={{ marginBottom: '1.5rem', color: '#6B7280' }}>Start by adding your first hotel to begin receiving bookings!</p>
          <Link
            to="/host/listings/new"
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Add Your First Hotel
          </Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {listings.map((listing) => (
            <div key={listing._id} style={cardStyle}>
              <img 
                src={listing.images && listing.images.length > 0
                  ? getImageUrl(listing.images[0])
                  : 'https://via.placeholder.com/400x200?text=Hotel+Image'
                } 
                alt={listing.hotelName} 
                style={imgStyle} 
              />
              <div style={cardContentStyle}>
                <h2 style={titleStyle}>{listing.hotelName}</h2>
                <p style={textStyle}>
                  📍 {listing.city}, {listing.country} • {'⭐'.repeat(listing.starRating || 0)}
                </p>
                <p style={priceStyle}>
                  {listing.roomTypes && listing.roomTypes.length > 0 
                    ? `From $${Math.min(...listing.roomTypes.map(room => room.price || 0))} per night`
                    : 'No room types available'
                  }
                </p>
                
                {/* Room Types Summary */}
                {listing.roomTypes && listing.roomTypes.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                      <strong>Room Types:</strong> {listing.roomTypes.length} available
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {listing.roomTypes.slice(0, 3).map((room, index) => (
                        <span key={index} style={{
                          background: '#F3F4F6',
                          color: '#374151',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          {room.type} (${room.price})
                        </span>
                      ))}
                      {listing.roomTypes.length > 3 && (
                        <span style={{
                          background: '#F3F4F6',
                          color: '#374151',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          +{listing.roomTypes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Amenities Preview */}
                {listing.amenities && listing.amenities.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                      <strong>Amenities:</strong>
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {listing.amenities.slice(0, 4).map((amenity, index) => (
                        <span key={index} style={{
                          background: '#E0F2FE',
                          color: '#0C4A6E',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          {amenity.trim()}
                        </span>
                      ))}
                      {listing.amenities.length > 4 && (
                        <span style={{
                          background: '#E0F2FE',
                          color: '#0C4A6E',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          +{listing.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div style={actionsStyle}>
                  {(() => {
                    const isOwner = listing.host === user.id || listing.host._id === user.id;
                    return isOwner ? (
                      <>
                        <Link
                          to={`/host/listings/${listing._id}/edit`}
                          style={actionLinkStyle}
                          onMouseOver={(e) => (e.target.style.color = actionLinkHover.color)}
                          onMouseOut={(e) => (e.target.style.color = actionLinkStyle.color)}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          style={deleteButtonStyle}
                          onMouseOver={(e) => (e.target.style.color = deleteHoverStyle.color)}
                          onMouseOut={(e) => (e.target.style.color = deleteButtonStyle.color)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                        Not your hotel
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
