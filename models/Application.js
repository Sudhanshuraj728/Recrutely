const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-site', 'Not specified'], default: 'Not specified' },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Other'], default: 'Full-time' },
  compensation: { type: String, trim: true },
  status: { type: String, enum: ['Saved', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'], default: 'Saved', index: true },
  appliedAt: { type: Date },
  applicationDeadline: { type: Date },
  followUpAt: { type: Date },
  source: { type: String, trim: true },
  jobUrl: { type: String, trim: true },
  nextAction: { type: String, trim: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

applicationSchema.index({ userId: 1, company: 1, role: 1 });
applicationSchema.index({ userId: 1, followUpAt: 1 });

module.exports = mongoose.model('Application', applicationSchema);
