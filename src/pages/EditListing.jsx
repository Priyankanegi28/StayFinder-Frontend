import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

export default function EditListing() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    country: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    guests: '',
    amenities: '',
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const navigate = useNavigate();

  // Get image URL function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x200?text=Hotel+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_ENDPOINTS.UPLOADS}/${imagePath.replace(/^uploads\//, '')}`;
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_LISTING(id));
        const l = res.data;
        setForm({
          title: l.title || '',
          description: l.description || '',
          address: l.address || '',
          city: l.city || '',
          country: l.country || '',
          price: l.price || '',
          bedrooms: l.bedrooms || '',
          bathrooms: l.bathrooms || '',
          guests: l.guests || '',
          amenities: l.amenities ? l.amenities.join(', ') : '',
          images: [],
        });
        setExistingImages(l.images || []);
      } catch (err) {
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, images: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('=== EDIT LISTING DEBUG ===');
      console.log('Listing ID:', id);
      console.log('Token exists:', !!token);
      console.log('Form data:', form);
      
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') {
          if (value && value.length > 0) {
            for (let i = 0; i < value.length; i++) {
              data.append('images', value[i]);
              console.log('Adding image:', value[i].name);
            }
          }
        } else {
          data.append(key, value);
          console.log('Adding field:', key, value);
        }
      });
      
      console.log('Sending request to:', API_ENDPOINTS.UPDATE_LISTING(id));
      
      const response = await axios.put(API_ENDPOINTS.UPDATE_LISTING(id), data, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Update response:', response.data);
      setSuccess('Listing updated successfully!');
      setTimeout(() => navigate('/host/dashboard'), 1200);
    } catch (err) {
      console.error('Error updating listing:', err);
      setError(err.response?.data?.msg || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  // Styles (same as NewListing)
  const card = {
    background: '#fff',
    borderRadius: '1.25rem',
    boxShadow: '0 4px 24px rgba(37,99,235,0.08)',
    maxWidth: '500px',
    margin: '3rem auto',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  const heading = {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#2563EB',
    textAlign: 'center',
  };
  const input = {
    width: '100%',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #D1D5DB',
    fontSize: '1rem',
    color: '#111827',
    background: '#F9FAFB',
    outline: 'none',
    transition: 'border 0.2s',
  };
  const textarea = {
    ...input,
    minHeight: '80px',
    resize: 'vertical',
  };
  const label = {
    fontWeight: 500,
    marginBottom: '0.25rem',
    color: '#374151',
    display: 'block',
  };
  const button = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background 0.2s',
  };
  const errorStyle = {
    backgroundColor: '#FEE2E2',
    border: '1px solid #FCA5A5',
    color: '#B91C1C',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    width: '100%',
    textAlign: 'center',
    fontSize: '0.95rem',
  };
  const successStyle = {
    backgroundColor: '#D1FAE5',
    border: '1px solid #34D399',
    color: '#065F46',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    width: '100%',
    textAlign: 'center',
    fontSize: '0.95rem',
  };
  const imagePreview = {
    width: '100%',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    objectFit: 'cover',
    maxHeight: '180px',
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', padding: '2rem 0' }}>
      <form style={card} onSubmit={handleSubmit} autoComplete="off">
        <div style={heading}>Edit Listing</div>
        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}
        <div style={{ width: '100%' }}>
          <label style={label}>Title</label>
          <input style={input} name="title" value={form.title} onChange={handleChange} required />
          <label style={label}>Description</label>
          <textarea style={textarea} name="description" value={form.description} onChange={handleChange} required />
          <label style={label}>Address</label>
          <input style={input} name="address" value={form.address} onChange={handleChange} required />
          <label style={label}>City</label>
          <input style={input} name="city" value={form.city} onChange={handleChange} required />
          <label style={label}>Country</label>
          <input style={input} name="country" value={form.country} onChange={handleChange} required />
          <label style={label}>Price (per night)</label>
          <input style={input} name="price" type="number" min="1" value={form.price} onChange={handleChange} required />
          <label style={label}>Bedrooms</label>
          <input style={input} name="bedrooms" type="number" min="1" value={form.bedrooms} onChange={handleChange} required />
          <label style={label}>Bathrooms</label>
          <input style={input} name="bathrooms" type="number" min="1" value={form.bathrooms} onChange={handleChange} required />
          <label style={label}>Guests</label>
          <input style={input} name="guests" type="number" min="1" value={form.guests} onChange={handleChange} required />
          <label style={label}>Amenities (comma separated)</label>
          <input style={input} name="amenities" value={form.amenities} onChange={handleChange} placeholder="WiFi, Kitchen, Parking" required />
          <label style={label}>Images (upload to replace)</label>
          <input style={input} name="images" type="file" accept="image/*" multiple onChange={handleChange} />
          {existingImages.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#374151', fontWeight: 500, marginBottom: '0.5rem' }}>Current Images:</div>
              <div style={imageGridStyle}>
                {existingImages.map((img, idx) => (
                  <img key={idx} src={getImageUrl(img)} alt="Listing" style={imagePreview} />
                ))}
              </div>
            </div>
          )}
        </div>
        <button type="submit" style={button} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
} 