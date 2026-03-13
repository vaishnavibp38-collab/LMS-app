import React from 'react';
import { Play, CheckCircle, Lock } from 'lucide-react';

const LessonSidebar = ({ lessons, currentLessonId, onLessonSelect, progress = [] }) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-80 shrink-0">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900">Course Content</h2>
        <p className="text-sm text-slate-500 mt-1">{lessons.length} lessons available</p>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {lessons.map((lesson, index) => {
          const isCompleted = progress.some(p => p.lesson_id === lesson.lesson_id && p.status === 'completed');
          const isActive = currentLessonId === lesson.lesson_id;
          
          return (
            <button
              key={lesson.lesson_id}
              onClick={() => onLessonSelect(lesson)}
              className={`w-full flex items-start p-5 border-b border-slate-50 transition-all text-left ${
                isActive ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'hover:bg-slate-50'
              }`}
            >
              <div className="mr-4 mt-0.5">
                {isCompleted ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 ${isActive ? 'border-primary-600' : 'border-slate-300'} flex items-center justify-center`}>
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <span className={`block text-sm font-semibold truncate ${isActive ? 'text-primary-700' : 'text-slate-700'}`}>
                  {lesson.title}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {lesson.duration || '5:00'}
                </span>
              </div>
              {isActive && (
                <div className="ml-2">
                  <Play size={16} className="text-primary-600 animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LessonSidebar;
