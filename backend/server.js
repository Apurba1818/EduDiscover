require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const College = require('./models/College');
const User = require('./models/User');
const Question = require('./models/Question');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// ================= PUBLIC COLLEGE APIs =================

app.get('/api/colleges', async (req, res) => {
  try {
    // FIX: Added 'course' to the destructured query variables
    const { search, location, course, minFees, maxFees, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (search) query.name = { $regex: search, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (course) query.courses = course; // Now this works perfectly
    
    if (minFees || maxFees) {
      query.fees = {};
      if (minFees) query.fees.$gte = Number(minFees);
      if (maxFees) query.fees.$lte = Number(maxFees);
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const colleges = await College.find(query).skip(skip).limit(Number(limit));
    const total = await College.countDocuments(query);
    
    res.json({ colleges, totalPages: Math.ceil(total / Number(limit)), currentPage: Number(page) });
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

// ✅ SPECIFIC ROUTES GO HERE (Before /:id wildcard)
app.get('/api/colleges/locations', async (req, res) => {
  try {
    const locations = await College.distinct('location');
    res.json(locations.sort());
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

app.get('/api/colleges/courses', async (req, res) => {
  try {
    const courses = await College.distinct('courses');
    res.json(courses.sort());
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

app.get('/api/colleges/max-fee', async (req, res) => {
  try {
    const highestCollege = await College.findOne().sort({ fees: -1 }).select('fees');
    const maxFee = highestCollege ? highestCollege.fees : 2000000; 
    res.json({ maxFee });
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

app.post('/api/compare', async (req, res) => {
  try {
    const { collegeIds } = req.body;
    const colleges = await College.find({ _id: { $in: collegeIds } });
    res.json(colleges);
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

// ⚠️ WILDCARD ROUTES GO LAST
app.get('/api/colleges/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ error: 'College not found' });
    res.json(college);
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

app.get('/api/colleges/:id/similar', async (req, res) => {
  try {
    const currentCollege = await College.findById(req.params.id);
    if (!currentCollege) return res.status(404).json({ error: 'College not found' });

    const similarColleges = await College.find({
      _id: { $ne: currentCollege._id },
      $or: [
        { location: currentCollege.location },
        { rating: { $gte: currentCollege.rating - 0.2, $lte: currentCollege.rating + 0.2 } }
      ]
    })
    .sort({ rating: -1 })
    .limit(3); 

    res.json(similarColleges);
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

// ================= PREDICTOR API =================

app.post('/api/predict', async (req, res) => {
  try {
    const { exam, rank } = req.body;
    const rankNum = Number(rank);
    let minRating = 0;
    let maxRating = 5;

    if (rankNum <= 5000) { minRating = 4.6; maxRating = 5.0; } 
    else if (rankNum <= 20000) { minRating = 4.3; maxRating = 4.6; } 
    else if (rankNum <= 50000) { minRating = 4.0; maxRating = 4.3; } 
    else { minRating = 0; maxRating = 4.0; }

    const colleges = await College.find({
      rating: { $gte: minRating, $lt: maxRating }
    }).sort({ rating: -1 }).limit(6); 

    res.json(colleges);
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

// ================= AUTH APIs =================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, email: user.email } });
    });
  } catch (err) { res.status(500).send('Server error'); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, email: user.email } });
    });
  } catch (err) { res.status(500).send('Server error'); }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).send('Server error'); }
});

// ================= PROTECTED USER APIs =================

app.get('/api/user/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedColleges')
      .populate('savedComparisons.colleges')
      .populate('recentlyViewed');
      
    res.json({ 
      savedColleges: user.savedColleges, 
      savedComparisons: user.savedComparisons,
      recentlyViewed: user.recentlyViewed 
    });
  } catch (err) { res.status(500).send('Server error'); }
});

app.post('/api/user/save-college', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { collegeId } = req.body;
    const index = user.savedColleges.indexOf(collegeId);
    
    if (index > -1) { user.savedColleges.splice(index, 1); } 
    else { user.savedColleges.push(collegeId); }
    
    await user.save();
    res.json(user.savedColleges);
  } catch (err) { res.status(500).send('Server error'); }
});

app.post('/api/user/save-comparison', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { collegeIds } = req.body;
    user.savedComparisons.push({ colleges: collegeIds });
    await user.save();
    res.json(user.savedComparisons);
  } catch (err) { res.status(500).send('Server error'); }
});

app.post('/api/user/track-view', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { collegeId } = req.body;

    user.recentlyViewed = user.recentlyViewed.filter(id => id.toString() !== collegeId);
    user.recentlyViewed.unshift(collegeId);

    if (user.recentlyViewed.length > 5) {
      user.recentlyViewed.pop(); 
    }

    await user.save();
    res.json(user.recentlyViewed);
  } catch (err) { res.status(500).send('Server error'); }
});

// ================= Q&A APIs =================

app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

app.post('/api/questions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newQuestion = new Question({
      text: req.body.text,
      author: req.user.id,
      authorName: user.email.split('@')[0]
    });
    await newQuestion.save();
    res.json(newQuestion);
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

app.post('/api/questions/:id/answers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const newAnswer = {
      text: req.body.text,
      author: req.user.id,
      authorName: user.email.split('@')[0]
    };

    question.answers.push(newAnswer);
    await question.save();
    res.json(question);
  } catch (error) { res.status(500).json({ error: 'Server Error' }); }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
