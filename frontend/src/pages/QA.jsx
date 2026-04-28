import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const QA = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerInputs, setAnswerInputs] = useState({});
  const { user } = useContext(AuthContext);

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get('/questions');
      setQuestions(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    try {
      await api.post('/questions', { text: newQuestion });
      setNewQuestion('');
      fetchQuestions();
    } catch (err) { console.error(err); }
  };

  const handleAnswer = async (e, questionId) => {
    e.preventDefault();
    const answerText = answerInputs[questionId];
    if (!answerText?.trim()) return;
    try {
      await api.post(`/questions/${questionId}/answers`, { text: answerText });
      setAnswerInputs({ ...answerInputs, [questionId]: '' });
      fetchQuestions();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Q&A Discussion</h1>
        <p className="text-sm sm:text-base text-slate-600">Ask questions and help others by sharing your knowledge.</p>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
        {user ? (
          <form onSubmit={handleAsk} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input 
              type="text" 
              className="w-full sm:flex-1 border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="What do you want to know about a college?" 
              value={newQuestion} 
              onChange={e => setNewQuestion(e.target.value)} 
            />
            <button type="submit" className="w-full sm:w-auto justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center">
              <Send size={18} className="mr-2" /> Ask
            </button>
          </form>
        ) : (
          <p className="text-slate-600">Please <Link to="/login" className="text-indigo-600 font-bold hover:underline">login</Link> to ask a question.</p>
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">
        {questions.length === 0 && <p className="text-slate-500">No questions asked yet. Be the first!</p>}
        {questions.map(q => (
          <div key={q._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-start mb-4">
              <div className="hidden sm:block bg-indigo-100 p-2 rounded-full mr-4 flex-shrink-0">
                <MessageSquare size={20} className="text-indigo-600" />
              </div>
              <div className="w-full">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 break-words">{q.text}</h3>
                <p className="text-xs text-slate-400 mt-1">Asked by {q.authorName} on {new Date(q.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="ml-0 sm:ml-12 space-y-3 mb-4">
              {q.answers.map(a => (
                <div key={a._id} className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-700 break-words">
                  <span className="font-bold text-indigo-700 mr-2">{a.authorName}:</span> {a.text}
                </div>
              ))}
            </div>

            <div className="ml-0 sm:ml-12">
              {user ? (
                <form onSubmit={(e) => handleAnswer(e, q._id)} className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    className="w-full sm:flex-1 border border-slate-300 p-2.5 sm:p-2 text-sm rounded-lg sm:rounded focus:ring-1 focus:ring-indigo-500 outline-none" 
                    placeholder="Write an answer..." 
                    value={answerInputs[q._id] || ''} 
                    onChange={e => setAnswerInputs({...answerInputs, [q._id]: e.target.value})} 
                  />
                  <button type="submit" className="w-full sm:w-auto bg-slate-800 text-white px-4 py-2.5 sm:py-2 text-sm rounded-lg sm:rounded font-bold hover:bg-slate-700 transition">Reply</button>
                </form>
              ) : (
                <p className="text-xs text-slate-400">Login to reply</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QA;
