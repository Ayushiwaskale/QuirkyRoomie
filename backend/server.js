const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins for development
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes); // Use the auth routes

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
