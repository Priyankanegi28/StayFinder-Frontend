import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const defaultRoomType = () => ({
  type: 'Standard',
  price: 1,
  currency: 'USD',
  capacity: 1,
  available: 1,
  description: ''
});

const defaultForm = {
  'contactInfo[phone]': '',
  'contactInfo[email]': '',
  'contactInfo[website]': '',
  hotelName: '',
  description: '',
  address: '',
  city: '',
  country: '',
  starRating: 3,
  amenities: '',
  images: [],
  roomTypes: [defaultRoomType()],
  policies: {
    checkIn: '15:00',
    checkOut: '11:00',
    cancellation: 'Standard cancellation policy',
    petPolicy: 'No pets allowed',
    smokingPolicy: 'No smoking'
  }
};

export default function NewListing() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // --- Handlers ---
  const handleInput = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, images: Array.from(files) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };
  const handlePolicy = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, policies: { ...f.policies, [name]: value } }));
  };
  const handleRoomType = (idx, field, value) => {
    setForm(f => {
      const roomTypes = f.roomTypes.map((rt, i) =>
        i === idx ? { ...rt, [field]: ['price','capacity','available'].includes(field) ? Number(value) : value } : rt
      );
      return { ...f, roomTypes };
    });
  };
  const addRoomType = () => setForm(f => ({ ...f, roomTypes: [...f.roomTypes, defaultRoomType()] }));
  const removeRoomType = idx => setForm(f => ({ ...f, roomTypes: f.roomTypes.filter((_, i) => i !== idx) }));

  // --- Validation ---
  const validate = () => {
    if (!form.hotelName.trim()) return 'Hotel name is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.address.trim()) return 'Address is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.country.trim()) return 'Country is required';
    if (!form['contactInfo[phone]'].trim()) return 'Phone is required';
    if (!form['contactInfo[email]'].trim()) return 'Email is required';
    if (!form.images.length) return 'At least one image is required';
    for (let i = 0; i < form.roomTypes.length; i++) {
      const r = form.roomTypes[i];
      if (!r.type) return `Room type ${i+1}: Type is required`;
      if (!r.price || r.price <= 0) return `Room type ${i+1}: Valid price is required`;
      if (!r.capacity || r.capacity <= 0) return `Room type ${i+1}: Valid capacity is required`;
      if (r.available < 0) return `Room type ${i+1}: Available rooms cannot be negative`;
    }
    return null;
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validation
    if (!form.hotelName.trim() || !form.description.trim() || !form.address.trim() || !form.city.trim() || !form.country.trim() || !form['contactInfo[phone]'].trim() || !form['contactInfo[email]'].trim() || !form.images.length) {
      alert('Please fill in all required fields and upload at least one image.');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please log in again.');
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'images') v.forEach(img => data.append('images', img));
        else if (k === 'roomTypes' || k === 'policies') return; // handled below
        else data.append(k, v);
      });
      form.roomTypes.forEach((rt, idx) => {
        data.append(`roomTypes[${idx}][type]`, rt.type);
        data.append(`roomTypes[${idx}][price]`, String(rt.price));
        data.append(`roomTypes[${idx}][currency]`, rt.currency);
        data.append(`roomTypes[${idx}][capacity]`, String(rt.capacity));
        data.append(`roomTypes[${idx}][available]`, String(rt.available));
        data.append(`roomTypes[${idx}][description]`, rt.description);
      });
      Object.entries(form.policies).forEach(([k, v]) => data.append(`policies[${k}]`, v));
      // Failsafe: always append contactInfo[phone] and contactInfo[email] if present in form
      if (!data.has('contactInfo[phone]') && form['contactInfo[phone]']) {
        data.append('contactInfo[phone]', form['contactInfo[phone]']);
      }
      if (!data.has('contactInfo[email]') && form['contactInfo[email]']) {
        data.append('contactInfo[email]', form['contactInfo[email]']);
      }
      // Extra: log all required fields before submit
      console.log('hotelName:', form.hotelName);
      console.log('description:', form.description);
      console.log('address:', form.address);
      console.log('city:', form.city);
      console.log('country:', form.country);
      console.log('contactInfo[phone]:', form['contactInfo[phone]']);
      console.log('contactInfo[email]:', form['contactInfo[email]']);
      console.log('images:', form.images);
      await axios.post(API_ENDPOINTS.CREATE_LISTING, data, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Hotel created successfully!');
      setTimeout(() => navigate('/host/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to create hotel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
  // Modern, beautiful styles
  const bgGradient = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
    padding: '3rem 0',
  };
  const card = {
    maxWidth: 750,
    margin: '2rem auto',
    background: '#fff',
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(37,99,235,0.10)',
    padding: 40,
    border: '1.5px solid #e0e7ff',
  };
  const section = {
    marginBottom: 36,
    paddingBottom: 24,
    borderBottom: '1.5px solid #f1f5f9',
  };
  const sectionLast = {
    marginBottom: 36,
    paddingBottom: 0,
    borderBottom: 'none',
  };
  const label = {
    fontWeight: 600,
    color: '#334155',
    marginBottom: 6,
    display: 'block',
    fontSize: '1.05rem',
  };
  const input = {
    width: '100%',
    padding: '0.85rem 1.1rem',
    marginBottom: 18,
    borderRadius: 10,
    border: '1.5px solid #cbd5e1',
    fontSize: '1.05rem',
    background: '#f8fafc',
    color: '#222',
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
  };
  const inputFocus = {
    border: '1.5px solid #2563EB',
  };
  const textarea = {
    ...input,
    minHeight: 80,
    resize: 'vertical',
  };
  const select = {
    ...input,
    background: '#f8fafc',
  };
  const h2 = {
    textAlign: 'center',
    color: '#2563EB',
    fontWeight: 800,
    fontSize: '2.3rem',
    marginBottom: 30,
    letterSpacing: '-1px',
  };
  const h4 = {
    color: '#0f172a',
    fontWeight: 700,
    fontSize: '1.25rem',
    marginBottom: 18,
    letterSpacing: '-0.5px',
  };
  const addBtn = {
    background: 'linear-gradient(90deg, #2563EB 60%, #059669 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 22px',
    fontWeight: 600,
    fontSize: '1.05rem',
    cursor: 'pointer',
    marginTop: 8,
    marginBottom: 0,
    boxShadow: '0 2px 8px #2563eb22',
    transition: 'background 0.2s',
  };
  const removeBtn = {
    background: '#DC2626',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '5px 16px',
    fontWeight: 500,
    fontSize: '0.98rem',
    cursor: 'pointer',
    marginLeft: 8,
    marginTop: 8,
    boxShadow: '0 2px 8px #dc262622',
    transition: 'background 0.2s',
  };
  const submitBtn = {
    width: '100%',
    background: 'linear-gradient(90deg, #2563EB 60%, #059669 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '1.1rem',
    fontWeight: 700,
    fontSize: '1.15rem',
    cursor: 'pointer',
    marginTop: 10,
    boxShadow: '0 4px 16px #2563eb22',
    transition: 'background 0.2s',
  };
  const errorBox = {
    background: '#fee2e2',
    color: '#b91c1c',
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
    fontWeight: 600,
    fontSize: '1.05rem',
    border: '1.5px solid #fecaca',
    textAlign: 'center',
  };
  const successBox = {
    background: '#d1fae5',
    color: '#065f46',
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
    fontWeight: 600,
    fontSize: '1.05rem',
    border: '1.5px solid #6ee7b7',
    textAlign: 'center',
  };
  const roomTypeCard = {
    border: '1.5px solid #e0e7ff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    background: '#f8fafc',
    boxShadow: '0 2px 8px #2563eb0a',
  };
  // Responsive tweaks
  const formGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 18,
    marginBottom: 0,
  };
  const formGridFull = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 18,
    marginBottom: 0,
  };
  // ---
  return (
    <div style={bgGradient}>
      <form onSubmit={handleSubmit} style={card}>
        <h2 style={h2}>Add New Hotel</h2>
        {error && <div style={errorBox}>{error}</div>}
        {success && <div style={successBox}>{success}</div>}
        {/* Hotel Info */}
        <div style={section}>
          <div style={formGrid}>
            <div>
              <label style={label}>Hotel Name</label>
              <input name="hotelName" value={form.hotelName} onChange={handleInput} required style={input} />
            </div>
            <div>
              <label style={label}>Star Rating</label>
              <select name="starRating" value={form.starRating} onChange={handleInput} required style={select}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
              </select>
            </div>
          </div>
          <label style={label}>Description</label>
          <textarea name="description" value={form.description} onChange={handleInput} required style={textarea} />
          <div style={formGrid}>
            <div>
              <label style={label}>Address</label>
              <input name="address" value={form.address} onChange={handleInput} required style={input} />
            </div>
            <div>
              <label style={label}>City</label>
              <input name="city" value={form.city} onChange={handleInput} required style={input} />
            </div>
          </div>
          <div style={formGrid}>
            <div>
              <label style={label}>Country</label>
              <input name="country" value={form.country} onChange={handleInput} required style={input} />
            </div>
            <div>
              <label style={label}>Amenities (comma separated)</label>
              <input name="amenities" value={form.amenities} onChange={handleInput} required style={input} />
            </div>
          </div>
        </div>
        {/* Room Types */}
        <div style={section}>
          <h4 style={h4}>Room Types</h4>
          {form.roomTypes.map((rt, idx) => (
            <div key={idx} style={roomTypeCard}>
              <div style={formGrid}>
                <div>
                  <label style={label}>Type</label>
                  <select value={rt.type} onChange={e => handleRoomType(idx, 'type', e.target.value)} required style={select}>
                    {['Standard','Deluxe','Suite','Executive','Presidential','Family','Business'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>Price</label>
                  <input type="number" min={1} value={rt.price} onChange={e => handleRoomType(idx, 'price', e.target.value)} required style={input} />
                </div>
                <div>
                  <label style={label}>Currency</label>
                  <select value={rt.currency} onChange={e => handleRoomType(idx, 'currency', e.target.value)} required style={select}>
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={label}>Capacity</label>
                  <input type="number" min={1} value={rt.capacity} onChange={e => handleRoomType(idx, 'capacity', e.target.value)} required style={input} />
                </div>
                <div>
                  <label style={label}>Available</label>
                  <input type="number" min={0} value={rt.available} onChange={e => handleRoomType(idx, 'available', e.target.value)} required style={input} />
                </div>
              </div>
              <label style={label}>Description</label>
              <textarea value={rt.description} onChange={e => handleRoomType(idx, 'description', e.target.value)} style={textarea} />
              {form.roomTypes.length > 1 && (
                <button type="button" onClick={() => removeRoomType(idx)} style={removeBtn}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addRoomType} style={addBtn}>+ Add Room Type</button>
        </div>
        {/* Contact Info */}
        <div style={section}>
          <h4 style={h4}>Contact Information</h4>
          <div style={formGrid}>
            <div>
              <label style={label}>Phone</label>
              <input name="contactInfo[phone]" value={form['contactInfo[phone]']} onChange={handleInput} required style={input} />
            </div>
            <div>
              <label style={label}>Email</label>
              <input name="contactInfo[email]" value={form['contactInfo[email]']} onChange={handleInput} required style={input} />
            </div>
          </div>
          <label style={label}>Website</label>
          <input name="contactInfo[website]" value={form['contactInfo[website]']} onChange={handleInput} style={input} />
        </div>
        {/* Policies */}
        <div style={section}>
          <h4 style={h4}>Policies</h4>
          <div style={formGrid}>
            <div>
              <label style={label}>Check-In</label>
              <input name="checkIn" value={form.policies.checkIn} onChange={handlePolicy} required style={input} />
            </div>
            <div>
              <label style={label}>Check-Out</label>
              <input name="checkOut" value={form.policies.checkOut} onChange={handlePolicy} required style={input} />
            </div>
          </div>
          <div style={formGrid}>
            <div>
              <label style={label}>Cancellation</label>
              <input name="cancellation" value={form.policies.cancellation} onChange={handlePolicy} required style={input} />
            </div>
            <div>
              <label style={label}>Pet Policy</label>
              <input name="petPolicy" value={form.policies.petPolicy} onChange={handlePolicy} required style={input} />
            </div>
          </div>
          <label style={label}>Smoking Policy</label>
          <input name="smokingPolicy" value={form.policies.smokingPolicy} onChange={handlePolicy} required style={input} />
        </div>
        {/* Images */}
        <div style={sectionLast}>
          <h4 style={h4}>Hotel Images</h4>
          <input type="file" accept="image/*" multiple onChange={handleInput} name="images" required style={input} />
        </div>
        <button type="submit" disabled={loading} style={submitBtn}>
          {loading ? 'Creating Hotel...' : 'Create Hotel'}
        </button>
      </form>
    </div>
  );
} 