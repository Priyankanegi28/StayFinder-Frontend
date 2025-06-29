import axios from 'axios';
import { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard';
import DebugInfo from '../components/DebugInfo';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setError(null);
        console.log('Fetching from:', API_ENDPOINTS.GET_LISTINGS);
        const res = await axios.get(API_ENDPOINTS.GET_LISTINGS);
        console.log('Response:', res.data);
        // Ensure we have valid data
        const validListings = res.data.filter(listing => 
          listing && listing.hotelName && listing.city && listing.country
        );
        setListings(validListings);
      } catch (err) {
        console.error('Error fetching listings:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url
        });
        setError(`Failed to load hotels: ${err.message}`);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    if (!listing || !listing.hotelName || !listing.city || !listing.country) {
      return false;
    }
    
    const matchesSearch = listing.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || listing.city === selectedCity;
    const matchesRating = !selectedRating || (listing.starRating && listing.starRating >= parseInt(selectedRating));
    
    return matchesSearch && matchesCity && matchesRating;
  });

  const cities = [...new Set(listings.filter(listing => listing && listing.city).map(listing => listing.city))];

  // Styles
  const heroStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#FFFFFF',
    padding: '4rem 2rem',
    textAlign: 'center',
    marginBottom: '3rem',
  };
  const heroTitleStyle = {
    fontSize: '3rem',
    fontWeight: 800,
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };
  const heroSubtitleStyle = {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    opacity: 0.9,
  };
  const searchContainerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    background: '#FFFFFF',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  };
  const searchInputStyle = {
    width: '100%',
    padding: '1rem 1.5rem',
    fontSize: '1.1rem',
    border: '2px solid #E5E7EB',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };
  const filterContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  };
  const selectStyle = {
    flex: 1,
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '2px solid #E5E7EB',
    borderRadius: '0.5rem',
    outline: 'none',
    background: '#FFFFFF',
  };
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  };
  const sectionTitleStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1F2937',
    marginBottom: '1rem',
    textAlign: 'center',
  };
  const sectionSubtitleStyle = {
    fontSize: '1.1rem',
    color: '#6B7280',
    marginBottom: '3rem',
    textAlign: 'center',
  };
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  };
  const ctaSectionStyle = {
    background: '#F3F4F6',
    padding: '4rem 2rem',
    textAlign: 'center',
    marginTop: '3rem',
  };
  const ctaTitleStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1F2937',
    marginBottom: '1rem',
  };
  const ctaTextStyle = {
    fontSize: '1.1rem',
    color: '#6B7280',
    marginBottom: '2rem',
  };
  const ctaButtonStyle = {
    display: 'inline-block',
    padding: '1rem 2rem',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '0.75rem',
    fontWeight: 600,
    fontSize: '1.1rem',
    transition: 'background-color 0.2s',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '1.5rem', color: '#6B7280' }}>Loading amazing hotels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#DC2626', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ fontSize: '1.25rem', color: '#DC2626', marginBottom: '0.5rem' }}>Error Loading Hotels</div>
          <div style={{ color: '#6B7280', marginBottom: '2rem' }}>{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
        <DebugInfo />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={heroStyle}>
        <h1 style={heroTitleStyle}>Find Your Perfect Stay</h1>
        <p style={heroSubtitleStyle}>
          Discover amazing hotels and book your next adventure with StayFinder
        </p>
        
        {/* Search Section */}
        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Search hotels, cities, or countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <div style={filterContainerStyle}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Ratings</option>
              <option value="5">5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={containerStyle}>
        {/* Featured Hotels */}
        <div>
          <h2 style={sectionTitleStyle}>Featured Hotels</h2>
          <p style={sectionSubtitleStyle}>
            Handpicked accommodations for the best travel experience
          </p>
          
          {filteredListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🏨</div>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No hotels found</div>
              <div>Try adjusting your search criteria</div>
            </div>
          ) : (
            <div style={gridStyle}>
              {filteredListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div style={ctaSectionStyle}>
          <h3 style={ctaTitleStyle}>Ready to List Your Hotel?</h3>
          <p style={ctaTextStyle}>
            Join thousands of hotel owners who trust StayFinder to reach more guests
          </p>
          <Link to="/register" style={ctaButtonStyle}>
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
}
