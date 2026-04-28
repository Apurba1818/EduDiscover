import { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Check, BookmarkPlus } from 'lucide-react';

const Compare = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComparison = async () => {
      const searchParams = new URLSearchParams(location.search);
      const idsParam = searchParams.get('ids');
      if (!idsParam) return setLoading(false);
      
      try {
        const { data } = await api.post('/compare', { collegeIds: idsParam.split(',') });
        setColleges(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchComparison();
  }, [location.search]);

  const handleSaveComparison = async () => {
    if (!user) return navigate('/login');
    try {
      const ids = colleges.map(c => c._id);
      await api.post('/user/save-comparison', { collegeIds: ids });
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) { setSaveStatus('Failed to save.'); }
  };

  if (loading) return <div className="text-center py-10">Preparing comparison...</div>;
  if (colleges.length < 2) return <div className="text-center py-10 text-red-500 px-4">Please select at least 2 colleges to compare. <br/><Link to="/" className="text-blue-500 underline mt-2 inline-block">Go back to home</Link></div>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Compare Colleges</h1>
        <button onClick={handleSaveComparison} className="w-full sm:w-auto flex items-center justify-center bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-200 transition-colors">
          <BookmarkPlus size={18} className="mr-2" /> Save Comparison
        </button>
      </div>
      {saveStatus && <div className="bg-green-50 text-green-700 border-b border-green-100 text-center py-3 text-sm font-bold">{saveStatus}</div>}
      
      {/* Table handles mobile by allowing horizontal scrolling */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="p-4 border-b border-r bg-slate-50 w-1/4 text-slate-600 uppercase text-xs tracking-wider font-semibold">Features</th>
              {colleges.map(c => <th key={c._id} className="p-4 border-b border-r text-lg sm:text-xl font-bold text-indigo-700 bg-white min-w-[200px] sm:min-w-[250px]">{c.name}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-r font-semibold bg-slate-50 text-slate-700 text-sm sm:text-base">Location</td>
              {colleges.map(c => <td key={c._id} className="p-4 border-b border-r text-slate-800 text-sm sm:text-base">{c.location}</td>)}
            </tr>
            <tr>
              <td className="p-4 border-b border-r font-semibold bg-slate-50 text-slate-700 text-sm sm:text-base">Annual Fees</td>
              {colleges.map(c => <td key={c._id} className="p-4 border-b border-r font-medium text-slate-800 text-sm sm:text-base">₹{c.fees.toLocaleString()}</td>)}
            </tr>
            <tr>
              <td className="p-4 border-b border-r font-semibold bg-slate-50 text-slate-700 text-sm sm:text-base">Placement %</td>
              {colleges.map(c => <td key={c._id} className="p-4 border-b border-r text-green-600 font-bold text-sm sm:text-base">{c.placementPercentage}%</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;