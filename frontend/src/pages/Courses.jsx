import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import { Search, Loader2, Sparkles } from 'lucide-react';

const Hero = () => (
  <div className="bg-[#0a0a0a] text-white py-24 px-8 relative overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
      <div className="animate-in fade-in slide-in-from-left duration-700">
        <div className="inline-flex items-center space-x-2 bg-white/5 px-4 py-1.5 rounded-full mb-8 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Learn at your own pace</span>
        </div>
        <h1 className="text-5xl md:text-[5.5rem] font-extrabold mb-8 leading-[1] tracking-tight">
          Skills for your present <br /> <span className="text-slate-500 font-normal">and your future.</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-12 leading-relaxed font-medium">
          World-class courses taught by expert instructors. Start learning today and unlock your potential.
        </p>
        <div className="flex flex-wrap gap-5">
          <button className="bg-white text-black px-10 py-4.5 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all shadow-2xl active:scale-95">
            Browse courses ;
          </button>
          <button className="bg-[#1a1a1a] text-white border border-white/10 px-10 py-4.5 rounded-xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
            Sign up free
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right duration-700 delay-200">
        {[
          { label: 'Expert Courses', value: '5+' },
          { label: 'Students Enrolled', value: '500K+' },
          { label: 'Average Rating', value: '4.7★' },
          { label: 'Free to Try', value: '100%' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1a1a1a]/40 border border-white/5 p-10 rounded-2xl backdrop-blur-xl hover:bg-white/5 transition-all group flex flex-col items-center justify-center text-center">
            <div className="text-3xl md:text-4xl font-extrabold mb-2 text-white">
              {stat.value}
            </div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>
  </div>
);

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">All courses</h2>
            <p className="text-slate-500 font-medium italic">10 courses — new content added every month</p>
          </div>
          
          <div className="relative w-full md:w-[400px]">
            <input
              type="text"
              placeholder="Search courses or categories..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-5 top-4.5 text-slate-400" size={22} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-900">
            <Loader2 className="animate-spin mb-6 text-slate-400" size={56} strokeWidth={1.5} />
            <span className="font-bold tracking-widest uppercase text-xs text-slate-500">Updating library...</span>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredCourses.map(course => (
              <CourseCard key={course.course_id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-xl font-medium">No courses found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
