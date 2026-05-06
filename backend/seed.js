require('dotenv').config();
const mongoose = require('mongoose');
const College = require('./models/College');

const sampleColleges = [
  { name: "IIT Bombay", location: "Mumbai", fees: 1200000, rating: 4.9, courses: ["B.Tech", "M.Tech", "Ph.D"], placementPercentage: 98 },
  { name: "IIT Delhi", location: "New Delhi", fees: 1100000, rating: 4.8, courses: ["B.Tech", "M.Tech"], placementPercentage: 97 },
  { name: "BITS Pilani", location: "Pilani", fees: 1900000, rating: 4.7, courses: ["B.E.", "M.E.", "B.Pharm"], placementPercentage: 95 },
  { name: "NIT Trichy", location: "Tiruchirappalli", fees: 800000, rating: 4.6, courses: ["B.Tech", "M.Tech", "MBA"], placementPercentage: 92 },
  { name: "VIT Vellore", location: "Vellore", fees: 1500000, rating: 4.3, courses: ["B.Tech", "M.Tech", "BCA"], placementPercentage: 88 },
  { name: "SRM Institute", location: "Chennai", fees: 1400000, rating: 4.1, courses: ["B.Tech", "MBA", "B.Sc"], placementPercentage: 85 },
  { name: "Manipal Institute", location: "Manipal", fees: 1700000, rating: 4.4, courses: ["B.Tech", "MBBS", "BDS"], placementPercentage: 89 },
  { name: "Delhi Technological Univ", location: "New Delhi", fees: 900000, rating: 4.5, courses: ["B.Tech", "M.Tech", "MBA"], placementPercentage: 90 },
  { name: "Jadavpur University", location: "Kolkata", fees: 150000, rating: 4.6, courses: ["B.Tech", "B.A.", "M.Sc"], placementPercentage: 94 },
  { name: "Anna University", location: "Chennai", fees: 200000, rating: 4.2, courses: ["B.E.", "B.Tech", "M.E."], placementPercentage: 82 },
  { name: "IIIT Hyderabad", location: "Hyderabad", fees: 1400000, rating: 4.8, courses: ["B.Tech", "M.Tech", "MS"], placementPercentage: 99 },
  { name: "College of Engineering", location: "Pune", fees: 400000, rating: 4.4, courses: ["B.Tech", "M.Tech", "B.Plan"], placementPercentage: 87 },
  { name: "RV College of Engineering", location: "Bangalore", fees: 1000000, rating: 4.3, courses: ["B.E.", "M.Tech", "MCA"], placementPercentage: 86 },
  { name: "Thapar Institute", location: "Patiala", fees: 1600000, rating: 4.2, courses: ["B.E.", "M.E.", "MBA"], placementPercentage: 84 },
  { name: "Amity University", location: "Noida", fees: 1800000, rating: 3.9, courses: ["B.Tech", "MBA", "BBA", "BCA"], placementPercentage: 78 },
  { name: "IIT Kanpur", location: "Kanpur", fees: 1150000, rating: 4.8, courses: ["B.Tech", "M.Tech", "Ph.D"], placementPercentage: 96 },
  { name: "IIT Kharagpur", location: "Kharagpur", fees: 1200000, rating: 4.7, courses: ["B.Tech", "M.Tech", "B.Arch"], placementPercentage: 95 },
  { name: "IIT Madras", location: "Chennai", fees: 1100000, rating: 4.9, courses: ["B.Tech", "M.Tech", "MBA"], placementPercentage: 97 },
  { name: "IIT Roorkee", location: "Roorkee", fees: 1150000, rating: 4.6, courses: ["B.Tech", "M.Tech", "B.Arch"], placementPercentage: 94 },
  { name: "IIT Guwahati", location: "Guwahati", fees: 1100000, rating: 4.5, courses: ["B.Tech", "M.Tech", "B.Des"], placementPercentage: 93 },
  { name: "NIT Surathkal", location: "Mangalore", fees: 850000, rating: 4.5, courses: ["B.Tech", "M.Tech", "MCA"], placementPercentage: 91 },
  { name: "NIT Warangal", location: "Warangal", fees: 800000, rating: 4.4, courses: ["B.Tech", "M.Tech", "MBA"], placementPercentage: 90 },
  { name: "IIIT Allahabad", location: "Prayagraj", fees: 950000, rating: 4.5, courses: ["B.Tech", "M.Tech", "MBA"], placementPercentage: 95 },
  { name: "IIIT Bangalore", location: "Bangalore", fees: 1800000, rating: 4.6, courses: ["iM.Tech", "M.Tech", "MS"], placementPercentage: 98 },
  { name: "IIIT Delhi", location: "New Delhi", fees: 1600000, rating: 4.6, courses: ["B.Tech", "M.Tech", "Ph.D"], placementPercentage: 97 },
  { name: "NSUT", location: "New Delhi", fees: 850000, rating: 4.4, courses: ["B.Tech", "M.Tech", "BBA"], placementPercentage: 89 },
  { name: "VJTI", location: "Mumbai", fees: 350000, rating: 4.3, courses: ["B.Tech", "M.Tech", "MCA"], placementPercentage: 88 },
  { name: "SPIT", location: "Mumbai", fees: 600000, rating: 4.2, courses: ["B.Tech", "M.Tech", "MCA"], placementPercentage: 87 },
  { name: "PICT", location: "Pune", fees: 500000, rating: 4.1, courses: ["B.E.", "M.E."], placementPercentage: 86 },
  { name: "BMS College of Engineering", location: "Bangalore", fees: 900000, rating: 4.2, courses: ["B.E.", "M.Tech", "MBA"], placementPercentage: 85 },
  { name: "MSRIT", location: "Bangalore", fees: 950000, rating: 4.1, courses: ["B.E.", "M.Tech", "B.Arch"], placementPercentage: 84 },
  { name: "PES University", location: "Bangalore", fees: 1500000, rating: 4.3, courses: ["B.Tech", "M.Tech", "BBA"], placementPercentage: 88 },
  { name: "PSG College of Technology", location: "Coimbatore", fees: 400000, rating: 4.4, courses: ["B.E.", "B.Tech", "M.E."], placementPercentage: 89 },
  { name: "SSN College of Engineering", location: "Chennai", fees: 600000, rating: 4.3, courses: ["B.E.", "B.Tech", "M.E."], placementPercentage: 88 },
  { name: "Kalinga Institute of Industrial Tech", location: "Bhubaneswar", fees: 1600000, rating: 4.0, courses: ["B.Tech", "M.Tech", "MBA"], placementPercentage: 82 },
  { name: "Siksha 'O' Anusandhan", location: "Bhubaneswar", fees: 1400000, rating: 3.9, courses: ["B.Tech", "MBBS", "MBA"], placementPercentage: 80 },
  { name: "Lovely Professional University", location: "Phagwara", fees: 1200000, rating: 3.8, courses: ["B.Tech", "MBA", "B.Sc"], placementPercentage: 75 },
  { name: "Chandigarh University", location: "Mohali", fees: 1100000, rating: 3.9, courses: ["B.Tech", "MBA", "B.Sc"], placementPercentage: 77 },
  { name: "UPES", location: "Dehradun", fees: 1800000, rating: 4.0, courses: ["B.Tech", "MBA", "B.Des"], placementPercentage: 81 },
  { name: "Nirma University", location: "Ahmedabad", fees: 1000000, rating: 4.1, courses: ["B.Tech", "MBA", "B.Pharm"], placementPercentage: 85 },
  { name: "DA-IICT", location: "Gandhinagar", fees: 1200000, rating: 4.5, courses: ["B.Tech", "M.Tech", "M.Sc"], placementPercentage: 95 },
  { name: "LNMIIT", location: "Jaipur", fees: 1400000, rating: 4.3, courses: ["B.Tech", "M.Tech", "MS"], placementPercentage: 92 },
  { name: "MNIT", location: "Jaipur", fees: 800000, rating: 4.2, courses: ["B.Tech", "M.Tech", "B.Arch"], placementPercentage: 88 },
  { name: "MNNIT", location: "Allahabad", fees: 850000, rating: 4.3, courses: ["B.Tech", "M.Tech", "MCA"], placementPercentage: 89 },
  { name: "NIT Calicut", location: "Calicut", fees: 800000, rating: 4.3, courses: ["B.Tech", "M.Tech", "B.Arch"], placementPercentage: 87 },
  { name: "NIT Rourkela", location: "Rourkela", fees: 850000, rating: 4.4, courses: ["B.Tech", "M.Tech", "Ph.D"], placementPercentage: 89 },
  { name: "NIT Kurukshetra", location: "Kurukshetra", fees: 800000, rating: 4.1, courses: ["B.Tech", "M.Tech", "MBA"], placementPercentage: 85 },
  { name: "PEC University of Technology", location: "Chandigarh", fees: 750000, rating: 4.2, courses: ["B.E.", "M.E.", "Ph.D"], placementPercentage: 86 },
  { name: "BIT Mesra", location: "Ranchi", fees: 1300000, rating: 4.1, courses: ["B.Tech", "M.Tech", "B.Arch"], placementPercentage: 84 },
  { name: "Symbiosis Institute of Technology", location: "Pune", fees: 1500000, rating: 4.0, courses: ["B.Tech", "M.Tech", "Ph.D"], placementPercentage: 82 }
];

// --- DATA ENRICHMENT LOGIC ---
// This automatically injects realistic mock data for the new schema fields
const enrichedColleges = sampleColleges.map(college => {
  const isTopTier = college.rating >= 4.5;
  const isMidTier = college.rating >= 4.2 && college.rating < 4.5;

  let avgPkg = isTopTier ? "18 LPA" : isMidTier ? "10 LPA" : "6.5 LPA";
  let recruiters = isTopTier 
    ? ["Google", "Microsoft", "Amazon", "Atlassian", "Goldman Sachs"] 
    : isMidTier 
      ? ["TCS", "Infosys", "Deloitte", "Accenture", "Cognizant"]
      : ["Wipro", "Tech Mahindra", "Capgemini", "IBM"];
  
  // Calculate realistic hostel fees (roughly 10-15% of tuition, minimum 45k)
  let calculatedHostelFee = Math.max(Math.round(college.fees * 0.12), 45000);

  return {
    ...college,
    averagePackage: avgPkg,
    topRecruiters: recruiters,
    hostel: {
      available: true,
      fees: calculatedHostelFee,
      roomType: isTopTier ? "Single" : "Shared",
      facilities: ["High-Speed WiFi", "Mess & Cafeteria", "Laundry Service", "24/7 Security", "Gymnasium"]
    },
    pros: isTopTier 
      ? ["World-class faculty and research facilities", "Exceptional global alumni network", "Top-tier guaranteed placements"] 
      : ["Excellent campus infrastructure", "Highly active placement cell", "Strong industry connections"],
    cons: college.fees > 1200000 
      ? ["Very high tuition fees", "Highly competitive grading environment"]
      : ["Slightly remote campus location", "Hostel facilities require modernization"]
  };
});

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await College.deleteMany(); // Clear existing
    // Insert the newly enriched data
    await College.insertMany(enrichedColleges);
    console.log("Database Seeded Successfully with Enriched Data!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Database Seeding Failed:", err);
    process.exit(1);
  });
