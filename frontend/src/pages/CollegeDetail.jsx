import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom'; // IMPORT LINK
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { 
  MapPin, IndianRupee, Star, Briefcase, 
  ThumbsUp, CheckCircle2, ThumbsDown, AlertCircle, Home, Award, Sparkles 
} from 'lucide-react';

const CollegeDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [college, setCollege] = useState(null);
  const [similarColleges, setSimilarColleges] = useState([]); // NEW STATE
  const [error, setError] = useState(null);

  // 1. Fetch College Details & Similar Colleges
  useEffect(() => {
    // Scroll to the top immediately when the ID changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchCollegeData = async () => {
      try {
        // Fetch Main College
        const { data } = await api.get(`/colleges/${id}`);
        setCollege(data);

        // Fetch Similar Colleges
        const { data: similarData } = await api.get(`/colleges/${id}/similar`);
        setSimilarColleges(similarData);
      } catch (err) { 
        setError('College not found.'); 
      }
    };
    fetchCollegeData();
  }, [id]); // Re-runs every time the URL ID changes

  // 2. Track Recently Viewed 
  useEffect(() => {
    const trackView = async () => {
      if (user && id) {
        try {
          await api.post('/user/track-view', { collegeId: id });
        } catch (error) {
          console.error("Failed to track view", error);
        }
      }
    };
    trackView();
  }, [id, user]);

  if (error) return <div className="text-center text-rose-500 py-10 font-medium">{error}</div>;
  if (!college) return <div className="text-center py-10 text-slate-500 font-medium">Loading details...</div>;

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      
      {/* --- 1. HEADER & QUICK STATS --- */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-6">{college.name}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2.5 rounded-lg mr-3"><MapPin size={20} className="text-indigo-600" /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Location</p>
              <p className="font-bold text-slate-800">{college.location}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-amber-100 p-2.5 rounded-lg mr-3"><Star size={20} className="text-amber-600" /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Rating</p>
              <p className="font-bold text-slate-800">{college.rating} / 5.0</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-emerald-100 p-2.5 rounded-lg mr-3"><IndianRupee size={20} className="text-emerald-600" /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Annual Fees</p>
              <p className="font-bold text-slate-800">₹{college.fees?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. DECISION-FOCUSED PROS & CONS --- */}
      {(college.pros?.length > 0 || college.cons?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {college.pros?.length > 0 && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-emerald-800 font-bold mb-4 flex items-center text-lg">
                <ThumbsUp size={20} className="mr-2"/> Reasons to Join
              </h3>
              <ul className="space-y-3">
                {college.pros.map((pro, i) => (
                  <li key={i} className="flex text-sm text-emerald-900 font-medium leading-relaxed">
                    <CheckCircle2 size={18} className="mr-2 shrink-0 text-emerald-500 mt-0.5"/> {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {college.cons?.length > 0 && (
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-rose-800 font-bold mb-4 flex items-center text-lg">
                <ThumbsDown size={20} className="mr-2"/> Considerations
              </h3>
              <ul className="space-y-3">
                {college.cons.map((con, i) => (
                  <li key={i} className="flex text-sm text-rose-900 font-medium leading-relaxed">
                    <AlertCircle size={18} className="mr-2 shrink-0 text-rose-500 mt-0.5"/> {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* --- 3. ACADEMICS & PLACEMENTS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold border-b border-slate-100 pb-3 mb-5 flex items-center">
            <Award size={20} className="mr-2 text-indigo-500"/> Academics & Courses
          </h2>
          <div className="flex flex-wrap gap-2">
            {college.courses?.map((course, idx) => (
              <span key={idx} className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
                {course}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold border-b border-slate-100 pb-3 mb-5 flex items-center">
            <Briefcase size={20} className="mr-2 text-blue-500"/> Placement Records
          </h2>
          <div className="flex items-center p-4 bg-blue-50 border border-blue-100 rounded-xl mb-5">
            <div>
              <p className="text-3xl font-extrabold text-blue-700">{college.placementPercentage}%</p>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mt-1">Placed Successfully</p>
            </div>
            {college.averagePackage && (
              <div className="ml-auto text-right pl-4 border-l border-blue-200">
                <p className="text-xl font-bold text-slate-800">{college.averagePackage}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Avg Package</p>
              </div>
            )}
          </div>
          
          {college.topRecruiters?.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-2">Top Recruiters</p>
              <div className="flex flex-wrap gap-2">
                {college.topRecruiters.map((recruiter, idx) => (
                  <span key={idx} className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                    {recruiter}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* --- 4. CAMPUS LIVING & HOSTEL --- */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold border-b border-slate-100 pb-3 mb-5 flex items-center">
          <Home size={20} className="mr-2 text-teal-500"/> Campus Living & Hostel
        </h2>
        {college.hostel?.available ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Annual Fee</p>
              <p className="font-bold text-slate-800 text-lg">₹{college.hostel.fees?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Room Type</p>
              <p className="font-bold text-slate-800 text-lg">{college.hostel.roomType}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-2">Facilities</p>
              <div className="flex gap-2 flex-wrap">
                 {college.hostel.facilities?.map((f, idx) => (
                   <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                     {f}
                   </span>
                 ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-slate-500 font-medium">No on-campus hostel facilities officially listed for this institution.</p>
          </div>
        )}
      </section>

      {/* --- 5. SIMILAR COLLEGES (NEW) --- */}
      {similarColleges.length > 0 && (
        <section className="pt-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center">
            <Sparkles className="mr-2 text-indigo-500" size={22} /> Similar Colleges You Might Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarColleges.map(c => (
              <Link 
                to={`/college/${c._id}`} 
                key={`similar-${c._id}`} 
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all group block"
              >
                <h3 className="font-bold text-lg truncate group-hover:text-indigo-700 transition-colors">{c.name}</h3>
                <p className="text-sm text-slate-500 mb-3 flex items-center"><MapPin size={14} className="mr-1"/>{c.location}</p>
                <div className="flex justify-between items-center text-sm font-semibold mt-4">
                  <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">₹{c.fees?.toLocaleString()} / yr</span>
                  <span className="text-amber-600 flex items-center"><Star size={14} className="mr-1 fill-amber-500"/> {c.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default CollegeDetail;
