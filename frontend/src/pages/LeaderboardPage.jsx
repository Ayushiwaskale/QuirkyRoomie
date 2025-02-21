import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/LeaderboardPage.css';

const LeaderboardPage = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [mostComplainedUsers, setMostComplainedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [highUpvoteComplaints, setHighUpvoteComplaints] = useState([]); // New state
  const punishments = [
    "Didn’t clean the dishes? You’re making chai for everyone for a week.",
    "Blasted loud music at 2 AM? You owe everyone samosas.",
  ];

  useEffect(() => {
    fetchLeaderboardData();
    fetchHighUpvoteComplaints(); // Call new function here
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const categoryResponse = await axios.get('http://localhost:5000/api/complaints/top-categories');
      const userResponse = await axios.get('http://localhost:5000/api/complaints/most-complained-users');
      setTopCategories(categoryResponse.data);
      setMostComplainedUsers(userResponse.data);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Error fetching leaderboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch complaints with high upvotes
  const fetchHighUpvoteComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints/high-upvotes');
      setHighUpvoteComplaints(response.data);
    } catch (err) {
      console.error('Error fetching high-upvote complaints:', err);
    }
  };

  const renderPunishment = (upvotes) => {
    if (upvotes > 10) {
      return punishments[Math.floor(Math.random() * punishments.length)];
    }
    return null;
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <>
          <div className="leaderboard-section">
            <h3>Top Complaint Categories</h3>
            {topCategories.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              <ul>
                {topCategories.map((category) => (
                  <li key={category._id}>
                    {category._id} - {category.count} complaints
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="leaderboard-section">
            <h3>Most Complained Users</h3>
            {mostComplainedUsers.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <ul>
                {mostComplainedUsers.map((user) => (
                  <li key={user._id}>
                    User ID: {user._id} - {user.count} complaints
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Punishment Generator Section */}
          <div className="leaderboard-section">
            <h3>Punishment Generator</h3>
            {highUpvoteComplaints.length === 0 ? (
              <p>No complaints with high upvotes found.</p>
            ) : (
              <ul>
                {highUpvoteComplaints.map((complaint) => (
                  <li key={complaint._id}>
                    <p>
                      Complaint: {complaint.title} (Upvotes: {complaint.upvotes})
                    </p>
                    <label>Select punishment:</label>
                    <select>
                      {punishments.map((punishment, index) => (
                        <option key={index} value={punishment}>
                          {punishment}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;