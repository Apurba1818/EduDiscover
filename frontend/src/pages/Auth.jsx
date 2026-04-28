import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Auth = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md mt-6 sm:mt-10 border border-slate-100">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center border border-red-100">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-700 font-medium mb-1">Email</label>
          <input type="email" required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1">Password</label>
          <input type="password" required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors mt-2">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <div className="text-center mt-6 text-slate-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link to={isLogin ? '/register' : '/login'} className="text-indigo-600 font-bold hover:underline block sm:inline mt-2 sm:mt-0">
          {isLogin ? 'Sign Up' : 'Login'}
        </Link>
      </div>
    </div>
  );
};

export default Auth;