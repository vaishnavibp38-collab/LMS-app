import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User as UserIcon, ShoppingCart, Sparkles } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-8 py-4 flex items-center justify-between backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2 text-slate-900 font-extrabold text-2xl tracking-tight">
          <span>LMS Platform</span>
        </Link>
        <div 
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))}
          className="hidden md:flex items-center bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold space-x-1 shadow-sm transition-transform hover:scale-105 cursor-pointer"
        >
          <Sparkles size={12} className="text-amber-400 fill-amber-400" />
          <span>AI Assistant</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-8">
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/courses" className="text-slate-600 hover:text-slate-900 font-semibold transition-colors">Home</Link>
          <button className="text-slate-600 hover:text-slate-900 relative p-2 rounded-full hover:bg-slate-100 transition-all">
            <ShoppingCart size={22} strokeWidth={2.5} />
            <span className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border-2 border-white">0</span>
          </button>
        </div>

        {token ? (
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-3 bg-white/50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <UserIcon size={18} className="text-slate-500" />
              <span className="text-slate-700 font-bold">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="p-1 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link to="/login" className="px-5 py-2.5 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition-all">Log in</Link>
            <Link to="/signup" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
