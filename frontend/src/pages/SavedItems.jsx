import { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, IndianRupee, ArrowRight } from 'lucide-react';

const SavedItems = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [data, setData] = useState({ savedColleges: [], savedComparisons: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) return;
      try {
        const res = await api.get('/user/saved');
        setData(res.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchSaved();
  }, [user]);

  if (authLoading || loading) return <div className="text-center py-10">Loading profile...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
      <div className="px-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Saved Items</h1>
        <p className="text-gray-600 text-sm sm:text-base break-words">Welcome back, {user.email}</p>
      </div>

      <section>
        <h2 className="text-lg sm:text-xl font-bold border-b pb-2 mb-4 text-blue-800">Saved Colleges ({data.savedColleges.length})</h2>
        {data.savedColleges.length === 0 ? <p className="text-gray-500">No colleges saved yet.</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.savedColleges.map(college => (
              <Link to={`/college/${college._id}`} key={college._id} className="bg-white p-4 rounded-lg shadow border hover:border-blue-500 transition">
                <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">{college.name}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1"><MapPin size={14} className="mr-1 flex-shrink-0"/> <span className="truncate">{college.location}</span></p>
                <p className="text-sm font-semibold text-gray-700 mt-2 flex items-center"><IndianRupee size={14} className="mr-1 flex-shrink-0"/> ₹{college.fees.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg sm:text-xl font-bold border-b pb-2 mb-4 text-blue-800">Saved Comparisons ({data.savedComparisons.length})</h2>
        {data.savedComparisons.length === 0 ? <p className="text-gray-500">No comparisons saved yet.</p> : (
          <div className="space-y-4">
            {data.savedComparisons.map((comp, idx) => {
              const urlIds = comp.colleges.map(c => c._id).join(',');
              return (
                <div key={idx} className="bg-white p-4 rounded-lg shadow border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="w-full sm:w-auto">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                      Saved on {new Date(comp.savedAt).toLocaleDateString()}
                    </span>
                    <div className="font-medium text-gray-800 text-sm sm:text-base">
                      {comp.colleges.map(c => c.name).join(' vs ')}
                    </div>
                  </div>
                  <Link to={`/compare?ids=${urlIds}`} className="w-full sm:w-auto text-center justify-center bg-blue-50 text-blue-700 px-4 py-2.5 rounded-full font-bold flex items-center hover:bg-blue-100">
                    View <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default SavedItems;
