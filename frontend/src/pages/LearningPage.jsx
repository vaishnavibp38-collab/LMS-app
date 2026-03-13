import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LessonSidebar from '../components/LessonSidebar';
import ProgressBar from '../components/ProgressBar';
import { ChevronLeft, ChevronRight, CheckCircle, Play, Loader2 } from 'lucide-react';

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          navigate('/login');
          return;
        }
        const user = JSON.parse(storedUser);
        
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/lessons/course/${id}`),
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data);
        
        // Fetch progress safely
        try {
          const { data: progressList } = await api.get(`/progress/${id}/${user.id}`);
          setProgress(progressList);
        } catch (e) {
          console.warn('Progress fetch failed', e);
        }

        if (lessonsRes.data.length > 0) {
          try {
            const lastRes = await api.get(`/progress/last/${id}`);
            const lastLesson = lessonsRes.data.find(l => l.lesson_id === lastRes.data?.lesson_id);
            setCurrentLesson(lastLesson || lessonsRes.data[0]);
          } catch (e) {
            setCurrentLesson(lessonsRes.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching learning data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // Better YouTube ID extraction
  const getYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handleMarkComplete = async () => {
    if (!currentLesson || updatingProgress) return;
    setUpdatingProgress(true);
    try {
      await api.post('/progress/update', {
        course_id: id,
        lesson_id: currentLesson.lesson_id,
        status: 'completed'
      });
      // Refresh progress
      const { data } = await api.get(`/progress/${id}/${JSON.parse(localStorage.getItem('user')).id}`);
      setProgress(data);
      
      // Auto move to next lesson
      const currentIndex = lessons.findIndex(l => l.lesson_id === currentLesson.lesson_id);
      if (currentIndex < lessons.length - 1) {
        setCurrentLesson(lessons[currentIndex + 1]);
      }
    } catch (err) {
      console.error('Failed to update progress', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const goToNext = () => {
    const idx = lessons.findIndex(l => l.lesson_id === currentLesson.lesson_id);
    if (idx < lessons.length - 1) setCurrentLesson(lessons[idx + 1]);
  };

  const goToPrev = () => {
    const idx = lessons.findIndex(l => l.lesson_id === currentLesson.lesson_id);
    if (idx > 0) setCurrentLesson(lessons[idx - 1]);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[80vh] text-primary-600">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );

  const progressPercentage = lessons.length > 0 ? (progress.completed / lessons.length) * 100 : 0;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
      <div className="flex-grow flex flex-col min-w-0">
        <div className="flex-grow p-8 flex flex-col">
          <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl relative group">
            {currentLesson ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYoutubeId(currentLesson.youtube_url)}`}
                title={currentLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 bg-slate-900">
                <Play size={64} className="opacity-20" />
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {currentLesson?.title || 'Loading lesson...'}
              </h1>
              <p className="text-slate-500 font-medium">Course: {course?.title}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={goToPrev}
                disabled={lessons.findIndex(l => l.lesson_id === currentLesson?.lesson_id) === 0}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronLeft size={24} className="text-slate-700" />
              </button>
              
              <button
                onClick={handleMarkComplete}
                disabled={updatingProgress}
                className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl disabled:opacity-70"
              >
                {updatingProgress ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} className="text-green-400" />}
                <span>Mark as Completed</span>
              </button>

              <button 
                onClick={goToNext}
                disabled={lessons.findIndex(l => l.lesson_id === currentLesson?.lesson_id) === lessons.length - 1}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronRight size={24} className="text-slate-700" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-8 border-t border-slate-200 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <div className="max-w-2xl">
            <ProgressBar percentage={progressPercentage} />
          </div>
        </div>
      </div>

      <LessonSidebar 
        lessons={lessons} 
        currentLessonId={currentLesson?.lesson_id}
        onLessonSelect={handleLessonSelect}
        progress={progress.details || []} // Note: need detailed progress for checks
      />
    </div>
  );
};

export default LearningPage;
