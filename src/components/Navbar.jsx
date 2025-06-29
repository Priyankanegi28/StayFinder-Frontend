import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const navStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
    padding: '0.75rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1.5px solid #F3F4F6',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '64px',
  };

  const logoStyle = {
    fontWeight: 800,
    color: '#2563EB',
    fontSize: '1.5rem',
    textDecoration: 'none',
    letterSpacing: '-1px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const linkGroupStyle = {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'center',
  };

  const linkStyle = {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#374151',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    transition: 'background 0.2s, color 0.2s',
    background: 'none',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
  };

  const linkHoverStyle = {
    backgroundColor: '#F3F4F6',
    color: '#2563EB',
  };

  const buttonStyle = {
    ...linkStyle,
    background: '#2563EB',
    color: '#fff',
    fontWeight: 600,
    border: 'none',
    transition: 'background 0.2s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#1D4ED8',
    color: '#fff',
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          <span style={{fontWeight:800, letterSpacing:'-1px'}}>StayFinder</span>
        </Link>

        <div style={linkGroupStyle}>
          {isAuthenticated ? (
            <>
              {user?.isHost && (
                <>
                  <Link
                    to="/host/dashboard"
                    style={linkStyle}
                    onMouseOver={(e) => (e.target.style.backgroundColor = linkHoverStyle.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    Hotel Dashboard
                  </Link>
                  <Link
                    to="/host/bookings"
                    style={linkStyle}
                    onMouseOver={(e) => (e.target.style.backgroundColor = linkHoverStyle.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    Hotel Bookings
                  </Link>
                </>
              )}
              <Link
                to="/bookings"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = linkHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                My Bookings
              </Link>
              <button
                onClick={logout}
                style={buttonStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.background)}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = linkHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={linkStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = linkHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
