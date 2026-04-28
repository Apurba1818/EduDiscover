import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CollegeDetail from './pages/CollegeDetail';
import Compare from './pages/Compare';
import Auth from './pages/Auth';
import SavedItems from './pages/SavedItems';
import QA from './pages/QA';
import Predictor from './pages/Predictor';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          {/* Added full width overflow hidden on main wrapper to prevent horizontal scroll */}
          <main className="flex-grow container mx-auto px-4 py-8 overflow-hidden w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/college/:id" element={<CollegeDetail />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/login" element={<Auth isLogin={true} />} />
              <Route path="/register" element={<Auth isLogin={false} />} />
              <Route path="/saved" element={<SavedItems />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/predict" element={<Predictor />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
