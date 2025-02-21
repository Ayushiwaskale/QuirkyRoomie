const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  complaintType: String,
  severityLevel: String,
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }, // Add resolved status
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user who resolved it
});

module.exports = mongoose.model('Complaint', complaintSchema);