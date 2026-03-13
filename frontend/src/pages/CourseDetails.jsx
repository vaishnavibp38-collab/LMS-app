import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Play, CheckCircle, Info, Calendar, User, Clock, Loader2 } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data: courseData } = await api.get(`/courses/${id}`);
        setCourse(courseData);
        
        const token = localStorage.getItem('token');
        if (token) {
          const { data: enrollments } = await api.get('/enroll/me');
          setIsEnrolled(enrollments.some(e => e.course_id === parseInt(id)));
        }
      } catch (err) {
        console.error('Error fetching course details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    setEnrolling(true);
    try {
      await api.post('/enroll', { course_id: id });
      setIsEnrolled(true);
    } catch (err) {
      console.error('Enrollment failed', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-primary-600">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );

  if (!course) return <div className="text-center py-20 text-slate-500">Course not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-amber-500/10">
              {course.category}
            </span>
            <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
              {course.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-8 py-8 border-y border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Instructor</p>
                <p className="font-bold text-slate-800">{course.instructor_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Duration</p>
                <p className="font-bold text-slate-800">12h 45m</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Last Updated</p>
                <p className="font-bold text-slate-800">March 2024</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Mastering professional industry tools', 'Complete end-to-end projects', 'Modern best practices', 'Certification of completion'].map((item, i) => (
                <div key={i} className="flex items-start space-x-3 p-4 bg-white border border-slate-100 rounded-2xl">
                  <CheckCircle size={20} className="text-green-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
            <div className="relative h-56 rounded-2xl overflow-hidden mb-8 shadow-inner">
              <img 
                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="p-4 bg-white/30 backdrop-blur-md rounded-full text-white shadow-xl hover:scale-110 transition-transform cursor-pointer">
                  <Play size={32} fill="white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-extrabold text-slate-900">Free</span>
                <span className="text-slate-400 line-through text-lg">$99.00</span>
              </div>
              
              {isEnrolled ? (
                <button 
                  onClick={() => navigate(`/learn/${id}`)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-2xl hover:bg-slate-800 transition-all hover:-translate-y-1"
                >
                  <Play size={20} fill="currentColor" />
                  <span>Start Learning</span>
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1 disabled:opacity-70"
                >
                  {enrolling ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  <span>Enroll Now</span>
                </button>
              )}
              
              <p className="text-center text-xs text-slate-400 font-medium">30-Day Money-Back Guarantee • Lifetime Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
