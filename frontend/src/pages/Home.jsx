import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, IndianRupee, Star, CheckSquare, Square, BookmarkPlus, BookmarkCheck, ArrowDown, X, Sparkles, History, RotateCcw } from 'lucide-react';

const Home = () => {
  const [colleges, setColleges] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]); // NEW
  const [feeOptions, setFeeOptions] = useState([]);
  
  // 1. SMART STATE PERSISTENCE
  const [search, setSearch] = useState(sessionStorage.getItem('eduSearch') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(sessionStorage.getItem('eduSearch') || '');
  const [location, setLocation] = useState(sessionStorage.getItem('eduLocation') || '');
  const [course, setCourse] = useState(sessionStorage.getItem('eduCourse') || ''); // NEW
  const [maxFees, setMaxFees] = useState(sessionStorage.getItem('eduMaxFees') || '');
  const [page, setPage] = useState(Number(sessionStorage.getItem('eduPage')) || 1);
  
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [compareList, setCompareList] = useState([]);
  
  const { user } = useContext(AuthContext);
  const [savedColleges, setSavedColleges] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();

  // 2. SAVE STATE TO STORAGE
  useEffect(() => {
    sessionStorage.setItem('eduSearch', search);
    sessionStorage.setItem('eduLocation', location);
    sessionStorage.setItem('eduCourse', course); // NEW
    sessionStorage.setItem('eduMaxFees', maxFees);
    sessionStorage.setItem('eduPage', page);
  }, [search, location, course, maxFees, page]);

  // Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // --- Single optimized fetch for Dynamic Filters ---
  useEffect(() => {
    const fetchDynamicFilters = async () => {
      try {
        // Fetch Location, Fees, AND Courses at the exact same time
        const [locRes, feeRes, courseRes] = await Promise.all([
          api.get('/colleges/locations'),
          api.get('/colleges/max-fee'),
          api.get('/colleges/courses') // NEW
        ]);
        
        setAvailableLocations(locRes.data);
        setAvailableCourses(courseRes.data); // Set dynamic courses

        // Generate dynamic fee brackets in increments of 5 Lakhs
        const max = feeRes.data.maxFee;
        const generatedOptions = [];
        for (let i = 500000; i <= max + 500000; i += 500000) {
          generatedOptions.push(i);
        }
        setFeeOptions(generatedOptions);

      } catch (error) {
        console.error("Error fetching filter data. Did you restart the backend?", error);
      }
    };
    fetchDynamicFilters();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      // Pass the course to the backend API
      const { data } = await api.get('/colleges', { 
        params: { search: debouncedSearch, location, course, maxFees, page, limit: 9 } 
      });
      setColleges(data.colleges);
      setTotalPages(data.totalPages);
    } catch (error) { 
      console.error("Error fetching colleges", error); 
    }
    setLoading(false);
  };

  const fetchUserSaved = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/user/saved');
      setSavedColleges(data.savedColleges.map(c => c._id));
      setRecentlyViewed(data.recentlyViewed || []); 
    } catch (error) { 
      console.error(error); 
    }
  };

  // Trigger fetches instantly when filters or page change
  useEffect(() => {
    fetchColleges();
    fetchUserSaved(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, location, course, maxFees, user]);

  // Reset page to 1 when any filter changes
  const handleLocationChange = (e) => { setLocation(e.target.value); setPage(1); };
  const handleCourseChange = (e) => { setCourse(e.target.value); setPage(1); }; // NEW
  const handleMaxFeesChange = (e) => { setMaxFees(e.target.value); setPage(1); };
  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };

  // 3. CLEAR FILTERS LOGIC
  const clearAllFilters = () => {
    setSearch('');
    setLocation('');
    setCourse(''); // NEW
    setMaxFees('');
    setPage(1);
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

  const topPicks = colleges.filter(c => c.rating >= 4.5 && c.hostel?.available !== false);

  return (
    <div>
      {/* Hero Section */}
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
        <p className="text-gray-600 mb-6">Filter instantly by location, course, budget, or search directly.</p>
      </div>

      {/* --- SMART FILTERING UX --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex flex-col sm:flex-row w-full lg:flex-1 gap-2">
          <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search colleges instantly..." 
            className="w-full border border-slate-200 p-2.5 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" 
            value={search} 
            onChange={handleSearchChange} 
          />
        </div>
        <div className="flex flex-wrap w-full sm:flex-row md:w-auto gap-3">
          <select 
            className="w-full sm:w-auto border border-slate-200 p-2.5 rounded-lg outline-none bg-white focus:ring-2 focus:ring-indigo-500" 
            value={location} 
            onChange={handleLocationChange}
          >
            <option value="">All Locations</option>
            {availableLocations.map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
          
          {/* NEW COURSE DROPDOWN */}
          <select 
            className="w-full sm:w-auto border border-slate-200 p-2.5 rounded-lg outline-none bg-white focus:ring-2 focus:ring-indigo-500 max-w-[200px] truncate" 
            value={course} 
            onChange={handleCourseChange}
          >
            <option value="">All Courses</option>
            {availableCourses.map((c, index) => (
              <option key={index} value={c}>{c}</option>
            ))}
          </select>

          <select 
            className="w-full sm:w-auto border border-slate-200 p-2.5 rounded-lg outline-none bg-white focus:ring-2 focus:ring-indigo-500" 
            value={maxFees} 
            onChange={handleMaxFeesChange}
          >
            <option value="">Any Fees</option>
            {feeOptions.map((fee, index) => (
              <option key={index} value={fee}>
                Under ₹{fee / 100000}L
              </option>
            ))}
          </select>
          
          {/* HIGHLY VISIBLE CLEAR FILTERS BUTTON */}
          {(search || location || course || maxFees) && (
            <button 
              onClick={clearAllFilters} 
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <RotateCcw size={16} className="mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      {(search || location || course || maxFees) && (
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          {search && (
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              "{search}"
              <button onClick={() => setSearch('')} className="ml-2 hover:text-indigo-900"><X size={14}/></button>
            </span>
          )}
          {location && (
            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              {location}
              <button onClick={() => setLocation('')} className="ml-2 hover:text-blue-900"><X size={14}/></button>
            </span>
          )}
          {course && (
            <span className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              {course}
              <button onClick={() => setCourse('')} className="ml-2 hover:text-purple-900"><X size={14}/></button>
            </span>
          )}
          {maxFees && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              Under ₹{(maxFees/100000)}L
              <button onClick={() => setMaxFees('')} className="ml-2 hover:text-emerald-900"><X size={14}/></button>
            </span>
          )}
        </div>
      )}

      {/* --- SMART RECOMMENDATIONS (TOP PICKS) --- */}
      {!loading && topPicks.length > 0 && page === 1 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Sparkles className="mr-2 text-amber-500" size={22} /> Top Picks for You
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
            {topPicks.map(college => (
              <Link to={`/college/${college._id}`} key={`top-${college._id}`} className="min-w-[280px] bg-white border border-slate-200 rounded-xl p-5 snap-start shrink-0 hover:border-indigo-400 hover:shadow-md transition-all group">
                 <h3 className="font-bold text-lg truncate group-hover:text-indigo-700 transition-colors">{college.name}</h3>
                 <p className="text-sm text-slate-500 mb-3 flex items-center"><MapPin size={14} className="mr-1"/>{college.location}</p>
                 <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{college.placementPercentage}% Placed</span>
                    <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center"><Star size={14} className="mr-1 fill-amber-500"/> {college.rating}</span>
                 </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* --- RECENTLY VIEWED (LOGGED IN USERS ONLY) --- */}
      {!loading && user && recentlyViewed.length > 0 && page === 1 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
             <History className="mr-2 text-indigo-500" size={22} />
             Recently Viewed
          </h2>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
            {recentlyViewed.map(college => (
              <Link to={`/college/${college._id}`} key={`recent-${college._id}`} className="min-w-[280px] bg-slate-50 border border-slate-200 rounded-xl p-5 snap-start shrink-0 hover:border-indigo-400 hover:shadow-md transition-all group">
                 <h3 className="font-bold text-lg truncate group-hover:text-indigo-700 transition-colors">{college.name}</h3>
                 <p className="text-sm text-slate-500 mb-3 flex items-center"><MapPin size={14} className="mr-1"/>{college.location}</p>
                 <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">₹{college.fees?.toLocaleString()} / yr</span>
                    <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center border border-amber-100"><Star size={14} className="mr-1 fill-amber-500"/> {college.rating}</span>
                 </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* --- MAIN GRID --- */}
      {loading ? ( 
        <div className="text-center py-20 text-slate-500 text-lg font-medium">Fetching best matches...</div> 
      ) : colleges.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl">
          <p className="text-slate-500 text-lg">No colleges found matching your criteria.</p>
          <button onClick={clearAllFilters} className="mt-4 text-indigo-600 font-bold hover:underline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => {
            const isComparing = compareList.some(c => c._id === college._id);
            const isSaved = savedColleges.includes(college._id);

            return (
              <div key={college._id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col relative">
                <button 
                  onClick={() => toggleSaveCollege(college._id)} 
                  className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition z-10"
                  title={isSaved ? "Unsave" : "Save College"}
                >
                  {isSaved ? <BookmarkCheck size={24} className="text-indigo-600 fill-indigo-100" /> : <BookmarkPlus size={24} />}
                </button>

                <div className="p-5 flex-1 pr-12">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-800">{college.name}</h3>
                  </div>
                  <div className="inline-flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded text-sm font-bold mb-3 border border-amber-100">
                      <Star size={14} className="mr-1 fill-amber-500" /> {college.rating} Rating
                  </div>
                  <div className="text-slate-600 flex items-center text-sm"><MapPin size={16} className="mr-2 flex-shrink-0 text-slate-400" /> {college.location}</div>
                  <div className="text-slate-600 flex items-center mt-2 font-medium text-sm"><IndianRupee size={16} className="mr-2 flex-shrink-0 text-slate-400" /> ₹{college.fees.toLocaleString()} / year</div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2 rounded-b-xl">
                  <Link to={`/college/${college._id}`} className="w-full text-center bg-white border border-indigo-200 text-indigo-700 font-semibold py-2.5 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition">View Details</Link>
                  <button onClick={() => toggleCompare(college)} className={`w-full sm:w-auto px-4 py-2.5 rounded-lg flex items-center justify-center transition font-medium ${isComparing ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`} title="Add to compare">
                    {isComparing ? <><CheckSquare size={18} className="sm:mr-0 mr-2" /><span className="sm:hidden">Added</span></> : <><Square size={18} className="sm:mr-0 mr-2" /><span className="sm:hidden">Compare</span></>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && colleges.length > 0 && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap items-center">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 font-medium text-slate-700 transition text-sm sm:text-base">Previous</button>
          <span className="px-4 py-2 text-sm sm:text-base font-semibold text-slate-600">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 font-medium text-slate-700 transition text-sm sm:text-base">Next</button>
        </div>
      )}

      {/* Floating Compare Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white shadow-2xl rounded-xl border border-indigo-100 p-4 w-[calc(100vw-2rem)] sm:w-80 z-50 animate-fade-in-up">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
            <h4 className="font-bold text-slate-800">Compare ({compareList.length}/3)</h4>
            <button onClick={() => setCompareList([])} className="text-slate-400 hover:text-rose-500"><X size={16}/></button>
          </div>
          <ul className="text-sm text-slate-600 mb-4 space-y-1.5 font-medium">
            {compareList.map(c => <li key={c._id} className="truncate flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 shrink-0"></div>{c.name}</li>)}
          </ul>
          <button onClick={() => navigate(`/compare?ids=${compareList.map(c => c._id).join(',')}`)} disabled={compareList.length < 2} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold disabled:bg-slate-300 hover:bg-indigo-700 transition shadow-sm">
            {compareList.length < 2 ? 'Select one more to compare' : 'Compare Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
