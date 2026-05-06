const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  fees: { type: Number, required: true },
  rating: { type: Number, required: true },
  courses: [{ type: String }],
  // --- NEW PLACEMENT FIELDS ---
  placementPercentage: { type: Number, required: true },
  averagePackage: { type: String }, 
  topRecruiters: [{ type: String }],
  // --- NEW HOSTEL FIELDS ---
  hostel: {
    available: { type: Boolean, default: false },
    fees: { type: Number },
    roomType: { type: String, enum: ['Single', 'Shared', 'Both'] },
    facilities: [{ type: String }] 
  },
  
  // --- NEW DECISION FIELDS ---
  pros: [{ type: String }],
  cons: [{ type: String }]
}, { timestamps: true });


module.exports = mongoose.models.College || mongoose.model('College', collegeSchema);
