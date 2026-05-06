const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
  savedComparisons: [{
    colleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
    savedAt: { type: Date, default: Date.now }
  }]
  
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
