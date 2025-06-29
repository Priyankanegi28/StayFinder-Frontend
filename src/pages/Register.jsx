import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isHost: false,
  });
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.msg || 'Registration failed');
    }
  };

  // Styles
  const card = {
    background: '#fff',
    borderRadius: '1.25rem',
    boxShadow: '0 4px 24px rgba(37,99,235,0.08)',
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
  const logo = {
    fontWeight: 800,
    fontSize: '2rem',
    color: '#2563EB',
    marginBottom: '1.5rem',
    letterSpacing: '-1px',
  };
  const heading = {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#222',
    textAlign: 'center',
  };
  const subheading = {
    color: '#6B7280',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
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
  const inputFocus = {
    border: '1.5px solid #2563EB',
  };
  const checkboxContainer = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    width: '100%',
  };
  const checkbox = {
    marginRight: '0.5rem',
    width: '1.1rem',
    height: '1.1rem',
    borderRadius: '0.25rem',
  };
  const checkboxLabel = {
    fontSize: '1rem',
    color: '#111827',
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
  const buttonHover = {
    backgroundColor: '#1D4ED8',
  };
  const link = {
    color: '#2563EB',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.2s',
  };
  const linkHover = {
    color: '#1E40AF',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', padding: '2rem 0' }}>
      <form style={card} onSubmit={handleSubmit} autoComplete="off">
        <div style={logo}>StayFinder</div>
        <div style={heading}>Create your account</div>
        <div style={subheading}>Sign up to book unique stays or become a host!</div>
        {error && <div style={errorStyle}>{error}</div>}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
          style={input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleChange}
          style={input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            required
            value={formData.password}
            onChange={handleChange}
          style={input}
          />
        <div style={checkboxContainer}>
            <input
              type="checkbox"
              id="isHost"
              name="isHost"
              checked={formData.isHost}
              onChange={handleChange}
            style={checkbox}
            />
          <label htmlFor="isHost" style={checkboxLabel}>
              Register as a host
            </label>
          </div>
          <button
            type="submit"
          style={button}
          onMouseOver={e => (e.target.style.backgroundColor = buttonHover.backgroundColor)}
          onMouseOut={e => (e.target.style.backgroundColor = button.backgroundColor)}
          >
            Register
          </button>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.98rem', color: '#6B7280' }}>
            Already have an account?{' '}
            <Link
              to="/login"
            style={link}
            onMouseOver={e => (e.target.style.color = linkHover.color)}
            onMouseOut={e => (e.target.style.color = link.color)}
            >
              Sign in
            </Link>
        </div>
      </form>
    </div>
  );
}
