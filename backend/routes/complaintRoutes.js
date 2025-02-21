const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint'); // Import Complaint model
const User = require('../models/User'); // Import User model

// Submit a complaint
router.post('/', async (req, res) => {
  const { title, description, complaintType, severityLevel } = req.body;

  if (!title || !description || !complaintType || !severityLevel) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newComplaint = new Complaint({
      title,
      description,
      complaintType,
      severityLevel,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error creating complaint', error });
  }
});

// PUT route to resolve a complaint
router.put('/:id/resolve', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.error('Error: User ID not provided');
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    console.log(`Attempting to resolve complaint with ID: ${req.params.id}`);

    // Find the complaint by ID
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      console.error('Error: Complaint not found');
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if the complaint is already resolved
    if (complaint.resolved) {
      console.warn('Warning: Complaint already resolved');
      return res.status(400).json({ message: 'Complaint is already resolved' });
    }

    // Mark the complaint as resolved
    complaint.resolved = true;
    complaint.resolvedBy = userId;
    await complaint.save();
    console.log('Complaint marked as resolved.');

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.error('Error: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment karma points
    user.karmaPoints = (user.karmaPoints || 0) + 10;
    await user.save();
    console.log(`User karma points updated to: ${user.karmaPoints}`);

    res.status(200).json({
      message: 'Complaint resolved successfully',
      complaint,
    });
  } catch (error) {
    console.error('Error resolving complaint:', error.message);
    res.status(500).json({
      message: 'Error resolving complaint',
      error: error.message,
    });
  }
});


// Route to fetch all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error });
  }
});

// Route to fetch the "Problem of the Week"
router.get('/problem-of-the-week', async (req, res) => {
  try {
    const mostUpvotedComplaint = await Complaint.findOne().sort({ upvotes: -1 });
    res.json(mostUpvotedComplaint || null);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching problem of the week', error });
  }
});

// Route to upvote a complaint
router.put('/:id/upvote', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.upvotes += 1;
    await complaint.save();
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error upvoting complaint', error });
  }
});

// Route to downvote a complaint
router.put('/:id/downvote', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.downvotes += 1;
    await complaint.save();
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error downvoting complaint', error });
  }
});

// Route to edit a complaint
router.put('/:id', async (req, res) => {
  const { title, description, complaintType, severityLevel } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;
    complaint.complaintType = complaintType || complaint.complaintType;
    complaint.severityLevel = severityLevel || complaint.severityLevel;

    await complaint.save();
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error });
  }
});

// Route to delete a complaint
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.remove();
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting complaint', error });
  }
});

// Route to fetch top complaint categories
router.get('/top-categories', async (req, res) => {
  try {
    const topCategories = await Complaint.aggregate([
      { $group: { _id: "$complaintType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(topCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top complaint categories', error });
  }
});

// Route to fetch most complained users
router.get('/most-complained-users', async (req, res) => {
  try {
    const mostComplainedUsers = await Complaint.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } },  // Replace "userId" with the actual field representing the user
      { $sort: { count: -1 } }
    ]);
    res.json(mostComplainedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching most complained users', error });
  }
});

// Route to fetch complaints with 10+ upvotes
router.get('/high-upvotes', async (req, res) => {
  try {
    const highUpvoteComplaints = await Complaint.find({ upvotes: { $gte: 10 } });
    res.json(highUpvoteComplaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching high-upvote complaints', error });
  }
});

// Route to get "Best Flatmate" based on karma
router.get('/best-flatmate', async (req, res) => {
  try {
    const bestFlatmate = await User.find().sort({ karmaPoints: -1 }).limit(1);
    res.json(bestFlatmate[0] || null);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching best flatmate', error });
  }
});

// Route to mark a complaint as resolved
router.put('/:id/resolve', async (req, res) => {
  const { userId } = req.body;  // Ensure userId is passed in the request body

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.resolved) {
      return res.status(400).json({ message: 'Complaint is already resolved' });
    }

    // Update complaint as resolved
    complaint.resolved = true;
    complaint.resolvedBy = userId;
    await complaint.save();

    // Update user's karma points
    const user = await User.findById(userId);
    if (user) {
      user.karmaPoints = (user.karmaPoints || 0) + 10;
      await user.save();
    }

    res.status(200).json({ message: 'Complaint resolved successfully', complaint });
  } catch (error) {
    console.error('Error resolving complaint:', error.message, error.stack);  // Log full error
    res.status(500).json({ message: 'Error resolving complaint', error: error.message });
  }
});

// In authRoutes.js or userRoutes.js
router.put('/:id/resolve', async (req, res) => {
  const { userId } = req.body;

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.resolved) {
      return res.status(400).json({ message: 'Complaint is already resolved' });
    }

    // Update complaint as resolved
    complaint.resolved = true;
    complaint.resolvedBy = userId;
    await complaint.save();

    // Update user's karma points
    const user = await User.findById(userId);
    if (user) {
      user.karmaPoints = (user.karmaPoints || 0) + 10;
      await user.save();
    }

    res.status(200).json({ message: 'Complaint resolved successfully', complaint });
  } catch (error) {
    console.error('Error resolving complaint:', error.message);
    res.status(500).json({ message: 'Error resolving complaint', error: error.message });
  }
});



// Export the router
module.exports = router;