import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ComplaintsPage from './pages/ComplaintsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';

// Authenticated Route Component
const PrivateRoute = ({ element }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authToken');
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return element;
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation(); // Use inside the Router

  // Conditionally render the Navbar only if not on login or signup pages
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/complaints" element={<PrivateRoute element={<ComplaintsPage />} />} />
        <Route path="/leaderboard" element={<PrivateRoute element={<LeaderboardPage />} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default App;
