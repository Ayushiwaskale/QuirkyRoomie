import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ComplaintsPage.css';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [karmaPoints, setKarmaPoints] = useState(0); // State for user's karma points
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    complaintType: '',
    severityLevel: '',
  });

  useEffect(() => {
    fetchComplaints();
    fetchUserKarmaPoints(); // Fetch user's karma points
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(response.data);
    } catch (err) {
      setError('Error fetching complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserKarmaPoints = async () => {
    try {
      const userId = "60c72b2f9b1d8e001f8e4c3a"; // Replace with logic to get the logged-in user's ID
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setKarmaPoints(response.data.karmaPoints || 0);
    } catch (err) {
      setError('');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.complaintType || !formData.severityLevel) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/complaints', formData);
      setFormData({ title: '', description: '', complaintType: '', severityLevel: '' }); // Reset form
      fetchComplaints(); // Refresh list after adding
    } catch (err) {
      setError('Error submitting complaint. Please try again.');
    }
  };

  const handleVote = async (id, type) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}/${type}`);
      fetchComplaints();
    } catch (err) {
      setError('Error voting. Please try again.');
    }
  };

  const markAsResolved = async (complaintId) => {
    try {
      const userId = "60c72b2f9b1d8e001f8e4c3a"; // Example: Replace with the actual MongoDB ObjectId of the logged-in user
      const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to resolve complaint');
      }

      alert('Complaint resolved successfully');
      fetchComplaints(); // Refresh the complaint list
      fetchUserKarmaPoints(); // Refresh karma points
    } catch (error) {
      console.error('Error resolving complaint:', error);
      alert('Failed to resolve complaint');
    }
  };

  return (
    <div className="complaints-container">
      <h2 className="complaint-form-title">Submit a Complaint</h2>
      <p><strong>Your Karma Points:</strong> {karmaPoints}</p> {/* Display karma points */}
      <form className="complaint-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <select name="complaintType" value={formData.complaintType} onChange={handleChange} required>
          <option value="">Select Complaint Type</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Roommate Issue">Roommate Issue</option>
          <option value="Noise Complaint">Noise Complaint</option>
          <option value="Other">Other</option>
        </select>
        <select name="severityLevel" value={formData.severityLevel} onChange={handleChange} required>
          <option value="">Select Severity Level</option>
          <option value="Mild">Mild</option>
          <option value="Annoying">Annoying</option>
          <option value="Major">Major</option>
          <option value="Nuclear">Nuclear</option>
        </select>
        <button type="submit">Submit Complaint</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>All Complaints</h2>
      {loading ? (
        <p>Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        complaints.map((complaint) => (
          <div key={complaint._id} className="complaint-card">
            <h3>{complaint.title}</h3>
            <p><strong>Type:</strong> {complaint.complaintType}</p>
            <p><strong>Severity:</strong> {complaint.severityLevel}</p>
            <p>{complaint.description}</p>
            <p><strong>Timestamp:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
            <div className="votes">
              <button className="upvote" onClick={() => handleVote(complaint._id, 'upvote')}>
                👍 {complaint.upvotes}
              </button>
              <button className="downvote" onClick={() => handleVote(complaint._id, 'downvote')}>
                👎 {complaint.downvotes}
              </button>
              {!complaint.resolved && (
                <button onClick={() => markAsResolved(complaint._id)}>Mark as Resolved</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ComplaintsPage;
