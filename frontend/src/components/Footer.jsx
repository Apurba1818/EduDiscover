import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <GraduationCap size={28} className="text-indigo-400" />
            <span className="text-xl font-extrabold text-white">EduDiscover</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your trusted platform for discovering and comparing the best educational institutions. Make data-driven decisions for your future.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/predict" className="hover:text-indigo-400 transition-colors">College Predictor</Link></li>
            <li><Link to="/qa" className="hover:text-indigo-400 transition-colors">Q&A Forum</Link></li>
            <li><Link to="/compare" className="hover:text-indigo-400 transition-colors">Compare Colleges</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Email: apurba2003sarkar2003@gmail.com</li>
            <li>Phone: +91 7478098533</li>
            <li>Address: Tech Hub, Bangalore, India</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} EduDiscover. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;