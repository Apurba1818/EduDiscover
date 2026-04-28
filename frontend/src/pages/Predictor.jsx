import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Compass, MapPin, IndianRupee, Star } from 'lucide-react';

const Predictor = () => {
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!rank) return;
    
    setLoading(true);
    setHasSearched(true);
    try {
      const { data } = await api.post('/predict', { exam, rank });
      setResults(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 px-2">
        <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-4">
          <Compass size={40} className="text-indigo-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">College Predictor</h1>
        <p className="text-slate-600 text-base sm:text-lg">Enter your competitive exam rank to see data-driven predictions of colleges you have a strong chance of securing admission to.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 max-w-3xl mx-auto w-full">
        <form onSubmit={handlePredict} className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Exam</label>
            <select 
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
            >
              <option value="JEE Main">JEE Main</option>
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="State CET">State CET / Others</option>
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">Enter Your Rank</label>
            <input 
              type="number" 
              min="1"
              required
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. 15000"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            />
          </div>
          <div className="flex items-end w-full md:w-auto">
            <button 
              type="submit" 
              className="w-full md:w-auto justify-center bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition h-[50px] flex items-center"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Predict Now'}
            </button>
          </div>
        </form>
      </div>

      {hasSearched && (
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 border-b pb-2">
            Your Predicted Colleges
          </h2>
          
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-lg">Analyzing data...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-600">No accurate predictions found for this rank in our current database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((college) => (
                <Link to={`/college/${college._id}`} key={college._id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-400 transition flex flex-col relative group">
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors truncate">{college.name}</h3>
                    
                    <div className="inline-flex items-center bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-sm font-bold mb-3 border border-green-100">
                        <Star size={14} className="mr-1.5 fill-green-700" /> {college.rating} Rating
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-slate-600 flex items-center text-sm">
                        <MapPin size={16} className="mr-2 text-slate-400 flex-shrink-0" /> <span className="truncate">{college.location}</span>
                      </div>
                      <div className="text-slate-600 flex items-center text-sm font-medium">
                        <IndianRupee size={16} className="mr-2 text-slate-400 flex-shrink-0" /> ₹{college.fees.toLocaleString()} / year
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-50/50 border-t border-indigo-50 text-center text-sm font-semibold text-indigo-700">
                    Strong Chance of Admission
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Predictor;