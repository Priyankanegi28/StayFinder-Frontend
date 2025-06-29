import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export default function HostBookings() {
  const [bookingsByListing, setBookingsByListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchHostBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('=== HOST BOOKINGS DEBUG ===');
        console.log('Current user ID:', user.id);
        
        // Get all listings for this host
        const listingsRes = await axios.get(API_ENDPOINTS.GET_LISTINGS, {
          params: { host: user.id },
        });
        const listings = listingsRes.data;
        console.log('All listings from API:', listings);
        
        // Filter to only include listings owned by this host
        const ownListings = listings.filter(listing => {
          const listingHostId = typeof listing.host === 'object' ? listing.host._id : listing.host;
          const isOwner = listingHostId === user.id;
          console.log(`Listing ${listing.hotelName}: host=${listingHostId}, user=${user.id}, isOwner=${isOwner}`);
          return isOwner;
        });
        console.log('Own listings after filter:', ownListings);
        
        // For each listing, get bookings
        const bookingsData = await Promise.all(
          ownListings.map(async (listing) => {
            console.log(`Fetching bookings for listing: ${listing.hotelName} (ID: ${listing._id})`);
            try {
              const res = await axios.get(API_ENDPOINTS.GET_LISTING_BOOKINGS(listing._id), {
                headers: { 'x-auth-token': token },
              });
              console.log(`Bookings for ${listing.hotelName}:`, res.data);
              return { listing, bookings: res.data };
            } catch (error) {
              console.error(`Error fetching bookings for ${listing.hotelName}:`, error.response?.data);
              return { listing, bookings: [] };
            }
          })
        );
        console.log('Final bookings data:', bookingsData);
        setBookingsByListing(bookingsData);
      } catch (err) {
        console.error('Error fetching host bookings:', err);
        setBookingsByListing([]);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && user?.isHost) fetchHostBookings();
  }, [isAuthenticated, user]);

  const handleStatusUpdate = async (bookingId, newStatus, listingId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('=== STATUS UPDATE DEBUG ===');
      console.log('Booking ID:', bookingId);
      console.log('New Status:', newStatus);
      console.log('Listing ID:', listingId);
      console.log('Current user ID:', user.id);
      console.log('Token exists:', !!token);
      
      // Find the listing to check ownership
      const listing = bookingsByListing.find(data => data.listing._id === listingId)?.listing;
      if (!listing) {
        alert('Listing not found');
        return;
      }
      
      // Client-side check: ensure this host owns the listing
      const listingHostId = typeof listing.host === 'object' ? listing.host._id : listing.host;
      if (listingHostId !== user.id) {
        console.log('Client-side authorization failed:', {
          listingHostId,
          userId: user.id,
          listingHost: listing.host
        });
        alert('You are not authorized to update bookings for this hotel');
        return;
      }
      
      const url = API_ENDPOINTS.UPDATE_BOOKING_STATUS(bookingId);
      console.log('Request URL:', url);
      console.log('Request payload:', { status: newStatus });
      
      const response = await axios.put(url, 
        { status: newStatus },
        { 
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Update the local state
      setBookingsByListing(prev => 
        prev.map(listingData => ({
          ...listingData,
          bookings: listingData.bookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: newStatus }
              : booking
          )
        }))
      );
      
      alert(`Booking status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert(err.response?.data?.msg || 'Failed to update booking status');
    }
  };

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
  const listingSectionStyle = {
    background: '#FFFFFF',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #E5E7EB',
  };
  const listingTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };
  const listingLocationStyle = {
    color: '#6B7280',
    fontSize: '1rem',
    marginBottom: '1.5rem',
  };
  const noBookingsStyle = {
    textAlign: 'center',
    padding: '2rem',
    color: '#6B7280',
    fontSize: '1rem',
    background: '#F9FAFB',
    borderRadius: '0.5rem',
  };
  const bookingsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  };
  const bookingCardStyle = {
    background: '#F9FAFB',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid #E5E7EB',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };
  const bookingCardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };
  const guestInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  };
  const guestNameStyle = {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#111827',
  };
  const guestEmailStyle = {
    fontSize: '0.9rem',
    color: '#6B7280',
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
  const statusStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: '1rem',
  };
  const priceStyle = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#2563EB',
    textAlign: 'center',
    padding: '0.75rem',
    background: '#F0F9FF',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  };
  const cancellationAlertStyle = {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    marginBottom: '1rem',
    color: '#DC2626',
    fontSize: '0.85rem',
    fontWeight: 500,
  };
  const specialRequestStyle = {
    background: '#F0F9FF',
    border: '1px solid #BAE6FD',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    marginBottom: '1rem',
    fontSize: '0.85rem',
    color: '#0369A1',
  };
  const actionsStyle = {
    display: 'flex',
    gap: '0.5rem',
  };
  const buttonStyle = {
    flex: 1,
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  };
  const confirmButtonStyle = {
    ...buttonStyle,
    background: '#059669',
    color: '#FFFFFF',
  };
  const cancelButtonStyle = {
    ...buttonStyle,
    background: '#DC2626',
    color: '#FFFFFF',
  };
  const pendingButtonStyle = {
    ...buttonStyle,
    background: '#D97706',
    color: '#FFFFFF',
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
    return <div style={loadingStyle}>Loading bookings...</div>;
  }

  // Debug: Log the current state
  console.log('=== RENDER DEBUG ===');
  console.log('bookingsByListing:', bookingsByListing);
  console.log('bookingsByListing.length:', bookingsByListing.length);
  console.log('Total bookings across all listings:', bookingsByListing.reduce((total, item) => total + item.bookings.length, 0));

  // Check if there are any listings at all
  if (!bookingsByListing.length) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Host Bookings</h1>
          <p style={subtitleStyle}>Manage bookings for your properties</p>
        </div>
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>🏠</div>
          <h2 style={emptyTitleStyle}>No properties yet</h2>
          <p style={emptyTextStyle}>Add some listings to start receiving bookings!</p>
        </div>
      </div>
    );
  }

  // Check if there are any bookings across all listings
  const totalBookings = bookingsByListing.reduce((total, item) => total + item.bookings.length, 0);
  if (totalBookings === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Host Bookings</h1>
          <p style={subtitleStyle}>Manage bookings for your properties</p>
        </div>
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>📅</div>
          <h2 style={emptyTitleStyle}>No bookings yet</h2>
          <p style={emptyTextStyle}>You have {bookingsByListing.length} propert{bookingsByListing.length === 1 ? 'y' : 'ies'}, but no bookings yet. They will appear here when guests make reservations!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Host Bookings</h1>
        <p style={subtitleStyle}>Manage bookings for your properties</p>
      </div>

      {bookingsByListing.map(({ listing, bookings }) => (
        <div key={listing._id} style={listingSectionStyle}>
          <h2 style={listingTitleStyle}>
            🏠 {listing.title}
          </h2>
          <div style={listingLocationStyle}>
            📍 {listing.address}, {listing.city}, {listing.country}
          </div>
          
          {bookings.length === 0 ? (
            <div style={noBookingsStyle}>
              No bookings for this property yet
            </div>
          ) : (
            <div style={bookingsGridStyle}>
              {bookings.map((booking) => (
                <div 
                  key={booking._id} 
                  style={bookingCardStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = bookingCardHoverStyle.transform;
                    e.target.style.boxShadow = bookingCardHoverStyle.boxShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = bookingCardStyle.boxShadow;
                  }}
                >
                  <div style={guestInfoStyle}>
                    <div>
                      <div style={guestNameStyle}>👤 {booking.user?.name || 'Guest'}</div>
                      <div style={guestEmailStyle}>{booking.user?.email || 'No email'}</div>
                    </div>
                  </div>

                  <div style={{
                    ...statusStyle,
                    background: booking.status === 'confirmed' ? '#D1FAE5' : 
                               booking.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7',
                    color: booking.status === 'confirmed' ? '#065F46' : 
                           booking.status === 'cancelled' ? '#991B1B' : '#92400E',
                  }}>
                    {booking.status === 'confirmed' ? '✅ Confirmed' : 
                     booking.status === 'cancelled' ? '❌ Cancelled' : '⏳ Pending'}
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
                      <span style={detailLabelStyle}>Nights</span>
                      <span style={detailValueStyle}>
                        {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}
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
                      ⚠️ <strong>Hotel Removed:</strong> This booking was automatically cancelled because the hotel has been removed by the host.
                    </div>
                  )}
                  
                  {/* Show special requests if any */}
                  {booking.specialRequests && 
                   !booking.specialRequests.includes('[SYSTEM MESSAGE]') && (
                    <div style={specialRequestStyle}>
                      <strong>Special Requests:</strong> {booking.specialRequests}
                    </div>
                  )}

                  {booking.status === 'pending' && (
                    <div style={actionsStyle}>
                      <button
                        style={confirmButtonStyle}
                        onClick={() => handleStatusUpdate(booking._id, 'confirmed', listing._id)}
                      >
                        ✅ Confirm
                      </button>
                      <button
                        style={cancelButtonStyle}
                        onClick={() => handleStatusUpdate(booking._id, 'cancelled', listing._id)}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 