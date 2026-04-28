import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, IndianRupee, Star, Briefcase } from 'lucide-react';

const CollegeDetail = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const { data } = await api.get(`/colleges/${id}`);
        setCollege(data);
      } catch (err) { setError('College not found.'); }
    };
    fetchCollege();
  }, [id]);

  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!college) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-white rounded-t-lg p-6 sm:p-8 shadow-sm border-b">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{college.name}</h1>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 text-gray-600">
          <span className="flex items-center"><MapPin size={18} className="mr-2 text-blue-600 flex-shrink-0" /> {college.location}</span>
          <span className="flex items-center"><Star size={18} className="mr-2 text-yellow-500 fill-yellow-500 flex-shrink-0" /> {college.rating} Rating</span>
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-sm p-6 sm:p-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Fee Structure</h2>
          <div className="flex items-center text-lg text-gray-800 break-words">
            <IndianRupee size={20} className="mr-2 flex-shrink-0" /> 
            <span className="font-semibold">₹{college.fees.toLocaleString()}</span>&nbsp;/ year
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Courses Offered</h2>
          <div className="flex flex-wrap gap-2">
            {college.courses.map((course, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                {course}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Placements</h2>
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <Briefcase size={32} className="text-green-600 mr-4 flex-shrink-0" />
            <div>
              <p className="text-xl sm:text-2xl font-bold text-green-700">{college.placementPercentage}%</p>
              <p className="text-sm text-green-800">Placement Record</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CollegeDetail;