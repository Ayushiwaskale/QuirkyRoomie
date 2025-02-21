import React, { useState } from 'react';

const ComplaintForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [severityLevel, setSeverityLevel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newComplaint = { title, description, complaintType, severityLevel };

    try {
      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComplaint),
      });

      if (response.ok) {
        setSuccess('Complaint submitted successfully.');
        setError('');
        setTitle('');
        setDescription('');
        setComplaintType('');
        setSeverityLevel('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error submitting complaint. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Submit a Complaint</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <br />
        <label>
          Complaint Type:
          <input type="text" value={complaintType} onChange={(e) => setComplaintType(e.target.value)} required />
        </label>
        <br />
        <label>
          Severity Level:
          <select value={severityLevel} onChange={(e) => setSeverityLevel(e.target.value)} required>
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <br />
        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
