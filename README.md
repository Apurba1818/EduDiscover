🎓 EduDiscover - College Discovery & Prediction Platform

EduDiscover is a comprehensive, full-stack (MERN) web application meticulously designed to alleviate the stress of the college hunting process. Built to empower students and parents, the platform helps users discover, deeply compare, and analyze top educational institutions. Moving beyond simple directories, EduDiscover features an interactive UI, data-driven college admissions predictions, a collaborative community Q&A forum, and insightful ROI analytics to ensure every student makes a highly informed, data-backed decision for their future.

🌟 Key Features

🔍 Explore & Compare

Dynamic Search & Filtering: Quickly sift through the noise to find exactly what you need. Search specific colleges by name or utilize granular filters to narrow down institutions by geographic location and maximum annual budget.

Side-by-Side Comparison: The college selection process often involves tough trade-offs. Select up to 3 colleges simultaneously to generate an interactive comparison matrix. This allows users to weigh critical factors—such as tuition fees, location, and placement percentages—at a single glance without constantly switching between multiple browser tabs.

Detailed College Profiles: Dive deep into specific institutions. Each profile offers a clean, comprehensive view of essential details, including specific academic courses offered, historical placement records, and aggregated institutional ratings.

🧭 College Predictor Tool

Data-Driven Predictions: Take the guesswork out of the admissions process. By entering a specific competitive exam (e.g., JEE Main or State CET) alongside your rank, the tool executes a rule-based algorithm to calculate realistic rating tiers. It instantly returns a curated list of colleges where the student has a statistically strong chance of securing admission.

💬 Community Q&A Forum

Ask & Answer: Choosing a college is rarely a solo journey; insights from peers and alumni are invaluable. This interactive discussion board serves as a dedicated space where students can ask nuanced questions about campus life, specific courses, or hostel facilities, and receive authentic answers directly from the community.

Real-time Interaction: The forum is seamlessly integrated with the backend API to ensure that new questions and replies are updated instantly, fostering a highly engaging and responsive community environment.

🔐 User Authentication & Personalization

Secure JWT Auth: Security and privacy are paramount. The platform features a robust user registration and login system utilizing JSON Web Tokens (JWT) for secure session management and bcryptjs for cryptographic password hashing, ensuring that sensitive user data remains protected.

Saved Items Dashboard: EduDiscover acts as a personal college-hunting assistant. Logged-in users can bookmark specific colleges of interest and save entirely custom comparison matrices. These saved items are stored securely in the database and displayed on a personalized dashboard, allowing users to pick up their research right where they left off, across any device.

📊 Interactive Insight Report (Analytics)

ROI Analysis: Moving beyond raw numbers, EduDiscover provides actionable intelligence. A dedicated interactive dashboard utilizes Chart.js to visually map the correlation between annual tuition fees and placement percentages, helping families evaluate the true Return on Investment (ROI) of different institutions.

Regional Dominance: Graphical representations break down average institutional ratings across different geographic hubs, helping students identify which cities offer the highest-rated academic environments for their specific needs.

🛠️ Technology Stack

EduDiscover leverages the modern MERN stack alongside powerful frontend tooling to deliver a fast, scalable, and responsive experience.

Frontend:

React.js (via Vite): Chosen for lightning-fast Hot Module Replacement (HMR) and highly optimized production builds.

Tailwind CSS: Utilized for rapid UI development, ensuring the entire application is fully responsive and adheres to a mobile-first design philosophy.

React Router DOM: Enables smooth, client-side routing for a seamless Single Page Application (SPA) experience without page reloads.

Axios: A promise-based HTTP client used to reliably communicate with the backend REST APIs.

Lucide React: A beautiful, consistent icon library used throughout the interface.

Chart.js: Powers the dynamic and interactive data visualizations on the analytics dashboard.

Backend:

Node.js & Express.js: Provides a lightweight, unopinionated, and highly scalable server environment for handling API requests.

MongoDB & Mongoose: A flexible NoSQL database paired with an elegant Object Data Modeling (ODM) library to structure data for Users, Colleges, and Q&A interactions.

JSON Web Tokens (JWT): Facilitates secure, stateless user authentication.

bcryptjs: Secures user passwords before they are ever stored in the database.

dotenv: Manages sensitive environment variables securely.

Deployment:

Frontend: Vercel (Optimized for Vite and React applications, offering continuous deployment).

Backend: Render (Reliable cloud hosting for Node.js web services).

Database: MongoDB Atlas (Fully managed cloud database cluster).

🚀 Local Setup & Installation

Getting the EduDiscover project running locally on your machine is a straightforward process. Follow these exact steps to set up your development environment.

1. Prerequisites

Make sure you have Node.js and Git installed on your computer. You will also need a MongoDB Atlas account to host your data (or you can use a local MongoDB instance like MongoDB Compass).

2. Clone the Repository

Start by downloading the codebase to your local machine:

git clone [https://github.com/YourUsername/EduDiscover.git](https://github.com/YourUsername/EduDiscover.git)
cd EduDiscover


3. Backend Setup

The backend requires its own dependencies and environment configuration to connect to your database. Open a terminal and navigate to the backend folder:

cd backend
npm install


Create a .env file in the root of the backend folder and carefully add the following variables. Replace the placeholder strings with your actual database URI and a secure secret key:

PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_random_string_here


Start the backend development server (which utilizes nodemon for auto-restarts on file changes):

npm run dev
# The server should now be running and connected to MongoDB on http://localhost:5000


4. Frontend Setup

Open a second, separate terminal window and navigate to the frontend folder to install its dependencies:

cd frontend
npm install


Create a .env.local file in the root of the frontend folder. This tells the React app where to send API requests during local development:

VITE_API_URL=http://localhost:5000/api


Start the frontend Vite development server:

npm run dev
# The interactive application should now be live in your browser at http://localhost:5173




🌐 Deployment Details

This project is structured as a "monorepo," meaning both the frontend and backend applications live comfortably within a single GitHub repository. This makes version control and continuous deployment (CI/CD) pipelines highly efficient.

Backend (/backend): Deployed as a Web Service on Render. Render continuously monitors the repository and builds the backend upon pushes to the main branch.

Build command: npm install

Start command: node server.js

Frontend (/frontend): Deployed as a Vite project on Vercel. Vercel detects the frontend root directory and serves the static React build globally via its CDN.

Build command: npm run build

Environment Variables: The live frontend relies on the VITE_API_URL environment variable configured in the Vercel dashboard, which must point directly to the live Render backend URL (e.g., https://edudiscover-api.onrender.com/api).

🤝 Contributing

Contributions, issues, and feature requests are highly welcome! Whether it's adding new college data, refining the prediction algorithm, or enhancing the UI, feel free to check the issues page to get involved.

📝 License

This project is open-source and licensed under the MIT License. You are free to use, modify, and distribute this software as per the terms of the license.
