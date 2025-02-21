import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Home.css';

const HomePage = () => {
  const [problemOfTheWeek, setProblemOfTheWeek] = useState(null);
  const [bestFlatmate, setBestFlatmate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      // Fetch problem of the week
      const problemResponse = await axios.get('http://localhost:5000/api/complaints/problem-of-the-week');
      setProblemOfTheWeek(problemResponse.data);

      // Fetch best flatmate
      const flatmateResponse = await axios.get('http://localhost:5000/api/complaints/best-flatmate');
      setBestFlatmate(flatmateResponse.data);
    } catch (err) {
      console.error('Error fetching home page data:', err);
      setError('Error fetching data. Please try again.');
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to QuirkyRoomie</h1>
      <p>Flatmate Conflict Management System</p>

      {error && <p className="error">{error}</p>}

      {/* Problem of the Week Section */}
<div className="home-section">
  <h2>Flatmate Problem of the Week</h2>
  {problemOfTheWeek ? (
    <div>
      <h3>{problemOfTheWeek.title}</h3>
      <p>{problemOfTheWeek.description}</p>
      <p>Upvotes: {problemOfTheWeek.upvotes}</p>
    </div>
  ) : (
    <p>No problem of the week selected yet.</p>
  )}
</div>

{/* Spacer to ensure no overlap */}
<div style={{ height: '20px' }}></div>

{/* Best Flatmate Section */}
<div className="home-section">
  <h2>Monthly “Best Flatmate” Badge</h2>
  {bestFlatmate ? (
    <div>
      <h3>{bestFlatmate.name}</h3>
      <p>Karma Points: {bestFlatmate.karmaPoints}</p>
    </div>
  ) : (
    <p>No best flatmate awarded yet.</p>
  )}
</div>

    </div>
  );
};

export default HomePage;
