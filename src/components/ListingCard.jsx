import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export default function ListingCard({ listing }) {
  // Add null checks
  if (!listing || !listing.hotelName) {
    return null;
  }

  // Get the lowest price from room types
  const lowestPrice = listing.roomTypes && listing.roomTypes.length > 0 
    ? Math.min(...listing.roomTypes.map(room => room.price || 0))
    : 0;

  // Get the currency for the lowest price room
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD': return '$';
      case 'INR': return '₹';
      default: return '$';
    }
  };

  const lowestPriceRoom = listing.roomTypes && listing.roomTypes.length > 0 
    ? listing.roomTypes.reduce((lowest, room) => 
        (room.price || 0) < (lowest.price || 0) ? room : lowest
      )
    : { currency: 'USD' };

  const currencySymbol = getCurrencySymbol(lowestPriceRoom.currency || 'USD');

  // Get available room count
  const totalAvailable = listing.roomTypes && listing.roomTypes.length > 0
    ? listing.roomTypes.reduce((sum, room) => sum + (room.available || 0), 0)
    : 0;

  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#F59E0B' : '#D1D5DB' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x200?text=Hotel+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_ENDPOINTS.UPLOADS}/${imagePath.replace(/^uploads\//, '')}`;
  };

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    border: '1px solid #E5E7EB',
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

  const contentStyle = {
    padding: '1.5rem',
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '0.5rem',
    lineHeight: '1.3',
  };

  const locationStyle = {
    fontSize: '0.95rem',
    color: '#6B7280',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  const ratingStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  };

  const starsStyle = {
    fontSize: '1rem',
  };

  const ratingTextStyle = {
    fontSize: '0.9rem',
    color: '#6B7280',
  };

  const amenitiesStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  };

  const amenityTagStyle = {
    background: '#F3F4F6',
    color: '#374151',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: 500,
  };

  const priceSectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const priceStyle = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#2563EB',
  };

  const priceLabelStyle = {
    fontSize: '0.875rem',
    color: '#6B7280',
  };

  const availabilityStyle = {
    fontSize: '0.875rem',
    color: totalAvailable > 0 ? '#059669' : '#DC2626',
    fontWeight: 500,
  };

  const roomTypesStyle = {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginBottom: '0.5rem',
  };

  return (
    <Link to={`/listings/${listing._id}`} style={{ textDecoration: 'none' }}>
      <div 
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
        {/* Hotel Image */}
        <img 
          src={getImageUrl(listing.images && listing.images.length > 0 ? listing.images[0] : null)}
          alt={listing.hotelName}
          style={imageStyle}
        />

        <div style={contentStyle}>
          {/* Hotel Name */}
          <h3 style={titleStyle}>{listing.hotelName}</h3>

          {/* Location */}
          <div style={locationStyle}>
            📍 {listing.city}, {listing.country}
          </div>

          {/* Star Rating */}
          <div style={ratingStyle}>
            <div style={starsStyle}>
              {renderStars(listing.starRating || 0)}
            </div>
            <span style={ratingTextStyle}>
              {listing.starRating || 0} Star Hotel
            </span>
          </div>

          {/* Room Types */}
          {listing.roomTypes && listing.roomTypes.length > 0 && (
            <div style={roomTypesStyle}>
              {listing.roomTypes.length} room type{listing.roomTypes.length > 1 ? 's' : ''} available
            </div>
          )}

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div style={amenitiesStyle}>
              {listing.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} style={amenityTagStyle}>
                  {amenity}
                </span>
              ))}
              {listing.amenities.length > 3 && (
                <span style={amenityTagStyle}>
                  +{listing.amenities.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Price and Availability */}
          <div style={priceSectionStyle}>
            <div>
              <div style={priceStyle}>
                {currencySymbol}{lowestPrice}
              </div>
              <div style={priceLabelStyle}>per night</div>
            </div>
            <div style={availabilityStyle}>
              {totalAvailable > 0 ? `${totalAvailable} rooms available` : 'No rooms available'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
