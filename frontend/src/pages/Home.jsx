import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, IndianRupee, Star, CheckSquare, Square, BookmarkPlus, BookmarkCheck, ArrowDown } from 'lucide-react';

const Home = () => {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [compareList, setCompareList] = useState([]);
  
  const { user } = useContext(AuthContext);
  const [savedColleges, setSavedColleges] = useState([]);
  const navigate = useNavigate();

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/colleges', { params: { search, location, maxFees, page, limit: 9 } });
      setColleges(data.colleges);
      setTotalPages(data.totalPages);
    } catch (error) { console.error("Error fetching", error); }
    setLoading(false);
  };

  const fetchUserSaved = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/user/saved');
      setSavedColleges(data.savedColleges.map(c => c._id));
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchColleges();
    fetchUserSaved(); 
  }, [page, location, maxFees, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchColleges();
  };

  const toggleCompare = (college) => {
    if (compareList.some(c => c._id === college._id)) {
      setCompareList(compareList.filter(c => c._id !== college._id));
    } else {
      if (compareList.length >= 3) return alert('You can compare up to 3 colleges');
      setCompareList([...compareList, college]);
    }
  };

  const toggleSaveCollege = async (collegeId) => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post('/user/save-college', { collegeId });
      setSavedColleges(data);
    } catch (error) { console.error("Failed to save"); }
  };

  const scrollToDiscover = (e) => {
    e.preventDefault();
    document.getElementById('discover').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 md:p-16 text-center mb-8 md:mb-12 shadow-lg">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Discover Your Dream College
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6 md:mb-8 px-2">
          Explore top institutes across the country. Compare fees, placements, and ratings to make an informed decision for your future.
        </p>
        <a 
          href="#discover" 
          onClick={scrollToDiscover}
          className="inline-flex items-center bg-white text-blue-700 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition shadow-md text-sm sm:text-base"
        >
          Start Exploring <ArrowDown size={20} className="ml-2" />
        </a>
      </div>

      <div id="discover" className="mb-4 pt-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Discover & Compare Colleges</h2>
        <p className="text-gray-600 mb-6">Filter by location, budget, or search directly for your preferred institutions.</p>
      </div>

      {/* Fully Responsive Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full md:flex-1 gap-2">
          <input type="text" placeholder="Search colleges..." className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center justify-center sm:justify-start w-full sm:w-auto font-medium">
            <Search size={18} className="mr-2" /> Search
          </button>
        </form>
        <div className="flex flex-col w-full sm:flex-row md:w-auto gap-4">
          <select className="w-full sm:w-auto border p-2.5 rounded-lg outline-none bg-white" value={location} onChange={(e) => {setLocation(e.target.value); setPage(1);}}>
            <option value="">All Locations</option>
            <option value="Mumbai">Mumbai</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>
          <select className="w-full sm:w-auto border p-2.5 rounded-lg outline-none bg-white" value={maxFees} onChange={(e) => {setMaxFees(e.target.value); setPage(1);}}>
            <option value="">Any Fees</option>
            <option value="500000">Under ₹5L</option>
            <option value="1000000">Under ₹10L</option>
            <option value="1500000">Under ₹15L</option>
          </select>
        </div>
      </div>

      {loading ? ( <div className="text-center py-10 text-gray-500">Loading colleges...</div> ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => {
            const isComparing = compareList.some(c => c._id === college._id);
            const isSaved = savedColleges.includes(college._id);

            return (
              <div key={college._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition flex flex-col relative">
                <button 
                  onClick={() => toggleSaveCollege(college._id)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition"
                  title={isSaved ? "Unsave" : "Save College"}
                >
                  {isSaved ? <BookmarkCheck size={24} className="text-blue-600 fill-blue-100" /> : <BookmarkPlus size={24} />}
                </button>

                <div className="p-5 flex-1 pr-12">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{college.name}</h3>
                  </div>
                  <div className="inline-flex items-center bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold mb-2">
                      <Star size={14} className="mr-1 fill-green-700" /> {college.rating}
                  </div>
                  <div className="text-gray-600 flex items-center"><MapPin size={16} className="mr-2 flex-shrink-0" /> {college.location}</div>
                  <div className="text-gray-600 flex items-center mt-2 font-medium"><IndianRupee size={16} className="mr-2 flex-shrink-0" /> ₹{college.fees.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-2">
                  <Link to={`/college/${college._id}`} className="w-full text-center bg-blue-50 text-blue-600 font-semibold py-2.5 rounded hover:bg-blue-100 transition">View Details</Link>
                  <button onClick={() => toggleCompare(college)} className={`w-full sm:w-auto px-4 py-2.5 rounded flex items-center justify-center transition ${isComparing ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} title="Add to compare">
                    {isComparing ? <><CheckSquare size={18} className="sm:mr-0 mr-2" /><span className="sm:hidden">Added</span></> : <><Square size={18} className="sm:mr-0 mr-2" /><span className="sm:hidden">Compare</span></>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center mt-8 gap-2 flex-wrap">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-white border rounded disabled:opacity-50 text-sm sm:text-base">Previous</button>
        <span className="px-4 py-2 text-sm sm:text-base">Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-white border rounded disabled:opacity-50 text-sm sm:text-base">Next</button>
      </div>

      {/* Floating Compare Button - Positioned responsively */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white shadow-2xl rounded-lg border border-blue-100 p-4 w-[calc(100vw-2rem)] sm:w-72 z-50">
          <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Compare ({compareList.length}/3)</h4>
          <ul className="text-sm text-gray-600 mb-4 space-y-1">
            {compareList.map(c => <li key={c._id} className="truncate">• {c.name}</li>)}
          </ul>
          <button onClick={() => navigate(`/compare?ids=${compareList.map(c => c._id).join(',')}`)} disabled={compareList.length < 2} className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:bg-gray-400">
            {compareList.length < 2 ? 'Select one more' : 'Compare Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;