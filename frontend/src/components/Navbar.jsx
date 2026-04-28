import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, User, Bookmark, LogOut, ArrowLeft, MessageSquare, Compass } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-3 sm:px-4 py-3 flex justify-between items-center gap-2">
        
        {/* Logo & Back Button Section */}
        <div className="flex items-center">
          {location.pathname !== '/' && (
            <button 
              onClick={() => navigate(-1)}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-300 mr-1 sm:mr-2 flex-shrink-0"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="bg-indigo-600 p-1.5 sm:p-2.5 rounded-xl shadow-md group-hover:bg-indigo-700 transition-colors duration-300">
              <GraduationCap size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            {/* Show "ED" on ultra-small screens (<380px) and full "EduDiscover" on larger screens */}
            <span className="text-lg sm:text-2xl font-extrabold text-slate-800 tracking-tight block min-[380px]:hidden">
              E<span className="text-indigo-600">D</span>
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-slate-800 tracking-tight hidden min-[380px]:block">
              Edu<span className="text-indigo-600">Discover</span>
            </span>
          </Link>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link to="/predict" className="flex items-center text-slate-600 hover:text-indigo-600 font-medium transition-colors duration-300 p-1 sm:p-0">
            <Compass size={20} className="sm:mr-1.5 flex-shrink-0" /> 
            <span className="hidden md:inline">Predictor</span>
          </Link>

          <Link to="/qa" className="flex items-center text-slate-600 hover:text-indigo-600 font-medium transition-colors duration-300 p-1 sm:p-0">
            <MessageSquare size={20} className="sm:mr-1.5 flex-shrink-0" /> 
            <span className="hidden md:inline">Q&A</span>
          </Link>

          {user ? (
            <>
              <Link to="/saved" className="flex items-center text-slate-600 hover:text-indigo-600 font-medium transition-colors duration-300 p-1 sm:p-0">
                <Bookmark size={20} className="sm:mr-1.5 flex-shrink-0" /> 
                <span className="hidden sm:inline">Saved</span>
              </Link>
              <div className="h-5 sm:h-6 w-px bg-gray-300"></div>
              <button onClick={handleLogout} className="flex items-center text-slate-600 hover:text-red-500 font-medium transition-colors duration-300 p-1 sm:p-0">
                <LogOut size={20} className="sm:mr-1.5 flex-shrink-0" /> 
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="group flex items-center bg-slate-900 text-white px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full font-medium shadow-md hover:shadow-lg hover:bg-indigo-600 transform hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base flex-shrink-0">
              <User size={16} className="sm:mr-2 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0" /> 
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
