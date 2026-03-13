import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData.email);
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/courses');
    } catch (err) {
      console.error('Login Error:', err);
      const message = err.response?.data?.message || 'Login failed. Please check your connection.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-white relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-100 rounded-full blur-[120px] -ml-64 -mb-64 opacity-50"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200">
          <div className="text-center mb-12">
            <h1 className="text-[2.75rem] font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">Welcome Back</h1>
            <p className="text-slate-500 text-lg font-medium">Enter your credentials to access your courses</p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50/50 border border-red-100 text-red-600 rounded-2xl flex items-center space-x-4 text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-red-100 p-2 rounded-xl">
                <AlertCircle size={20} />
              </div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-800 ml-1 uppercase tracking-widest leading-none">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:bg-white transition-all text-lg font-medium shadow-inner group-hover:bg-slate-100/50"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Mail className="absolute left-5 top-4.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={22} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-800 ml-1 uppercase tracking-widest leading-none">Password</label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:bg-white transition-all text-lg font-medium shadow-inner group-hover:bg-slate-100/50 tracking-widest"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Lock className="absolute left-5 top-4.5 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={22} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-extrabold text-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-70 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-bold mb-4">Don't have an account?</p>
            <Link to="/signup" className="inline-flex items-center space-x-2 text-slate-900 font-extrabold text-lg hover:underline decoration-2 underline-offset-8">
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
