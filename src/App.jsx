import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import Home from './pages/Home';
import HostDashboard from './pages/HostDashboard';
import Listing from './pages/Listing';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import HostBookings from './pages/HostBookings';
import NewListing from './pages/NewListing';
import EditListing from './pages/EditListing';

function App() {
  return (
    <AuthProvider>
      
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings/:id" element={<Listing />} />
          <Route path="/host/dashboard" element={<PrivateRoute><HostDashboard /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
          <Route path="/host/bookings" element={<PrivateRoute><HostBookings /></PrivateRoute>} />
          <Route path="/host/listings/new" element={<PrivateRoute><NewListing /></PrivateRoute>} />
          <Route path="/host/listings/:id/edit" element={<PrivateRoute><EditListing /></PrivateRoute>} />
        </Routes>
      
    </AuthProvider>
  );
}

export default App;