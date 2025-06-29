import axios from 'axios';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export default function Listing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { isAuthenticated } = useAuth();

  // Get currency symbol function
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD': return '$';
      case 'INR': return '₹';
      default: return '$';
    }
  };

  // Get image URL function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x200?text=Hotel+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_ENDPOINTS.UPLOADS}/${imagePath.replace(/^uploads\//, '')}`;
  };

  // Get the lowest price room for display
  const lowestPriceRoom = listing?.roomTypes && listing.roomTypes.length > 0 
    ? listing.roomTypes.reduce((lowest, room) => 
        (room.price || 0) < (lowest.price || 0) ? room : lowest
      )
    : { price: 0, currency: 'USD' };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_LISTING(id));
        setListing(res.data);
      } catch (err) {
        setError('Failed to fetch listing');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      alert('Please login to book');
      return;
    }
    if (!startDate || !endDate) {
      alert('Please select check-in and check-out dates');
      return;
    }
    if (!selectedRoomType) {
      alert('Please select a room type');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      
      const bookingData = {
        listingId: id,
        roomType: selectedRoomType,
        checkIn: startDate,
        checkOut: endDate,
        guests,
      };
      
      await axios.post(API_ENDPOINTS.CREATE_BOOKING, bookingData, {
        headers: { 'x-auth-token': token },
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error('Booking error:', err);
      alert(err.response?.data?.msg || 'Booking failed');
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  };

  const gridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  };

  const mediaQuery = window.matchMedia('(min-width: 768px)');
  if (mediaQuery.matches) {
    gridStyle.flexDirection = 'row';
  }

  const leftColStyle = {
    flex: 2,
  };

  const rightColStyle = {
    flex: 1,
  };

  const imagesGridStyle = {
    display: 'grid',
    gridTemplateColumns: mediaQuery.matches ? '1fr 1fr' : '1fr',
    gap: '1rem',
    marginBottom: '1.5rem',
  };

  const imgStyle = {
    width: '100%',
    height: '16rem',
    objectFit: 'cover',
    borderRadius: '0.5rem',
  };

  const headingStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  };

  const textStyle = {
    color: '#4B5563',
    marginBottom: '1.5rem',
  };

  const badgeStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    color: '#374151',
    fontSize: '0.95rem',
  };

  const sectionHeading = {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  };

  const amenitiesGrid = {
    display: 'grid',
    gridTemplateColumns: mediaQuery.matches ? '1fr 1fr' : '1fr',
    gap: '0.5rem',
  };

  const bookingBox = {
    background: '#FFFFFF',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const priceContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const priceStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
  };

  const successStyle = {
    backgroundColor: '#D1FAE5',
    border: '1px solid #34D399',
    color: '#065F46',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
  };

  const inputContainer = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
  };

  const fullWidthInputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
  };

  const labelStyle = {
    fontSize: '0.85rem',
    color: '#374151',
    marginBottom: '0.25rem',
    display: 'block',
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '0.75rem',
    fontWeight: 600,
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#1D4ED8',
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={containerStyle}>
      {listing && (
        <div style={gridStyle}>
          {/* Left column */}
          <div style={leftColStyle}>
            <div style={imagesGridStyle}>
              {listing.images && listing.images.length > 0 ? (
                listing.images.map((image, index) => (
                  <img key={index} src={getImageUrl(image)} alt={listing.title} style={imgStyle} />
                ))
              ) : (
                <img src="https://via.placeholder.com/400x200?text=No+Image" alt="No image" style={imgStyle} />
              )}
            </div>
            <h1 style={headingStyle}>{listing.title}</h1>
            <p style={textStyle}>
              {listing.address}, {listing.city}, {listing.country}
            </p>

            <div style={badgeStyle}>
              {/* Room types details removed as requested */}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={sectionHeading}>About this place</h2>
              <p style={{ color: '#374151' }}>{listing.description}</p>
            </div>

            <div>
              <h2 style={sectionHeading}>Amenities</h2>
              <ul style={amenitiesGrid}>
                {listing.amenities.map((amenity, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', color: '#374151' }}>
                    <span style={{ marginRight: '0.5rem' }}>✓</span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div style={rightColStyle}>
            <div style={bookingBox}>
              <div style={priceContainer}>
                <span style={priceStyle}>{getCurrencySymbol(lowestPriceRoom.currency)}{lowestPriceRoom.price}</span>
                <span style={{ color: '#6B7280' }}>per night</span>
              </div>

              {bookingSuccess ? (
                <div style={successStyle}>Booking successful!</div>
              ) : (
                <>
                  <div style={inputContainer}>
                    <div>
                      <label style={labelStyle}>Check-in</label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        placeholderText="Select date"
                        className="datepicker" // Allow DatePicker CSS
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Check-out</label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || new Date()}
                        placeholderText="Select date"
                        className="datepicker"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Room Type</label>
                    <select
                      value={selectedRoomType}
                      onChange={e => setSelectedRoomType(e.target.value)}
                      style={fullWidthInputStyle}
                    >
                      <option value="">Select room type</option>
                      {listing.roomTypes && listing.roomTypes.map((room, idx) => (
                        <option key={idx} value={room.type} disabled={room.available <= 0}>
                          {room.type} - {getCurrencySymbol(room.currency)}{room.price} ({room.available} available)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Guests</label>
                    <input
                      type="number"
                      min="1"
                      max={listing.guests}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      style={fullWidthInputStyle}
                    />
                  </div>

                  <button
                    onClick={handleBooking}
                    style={buttonStyle}
                    onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                  >
                    Book Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
