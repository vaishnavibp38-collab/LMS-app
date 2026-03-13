import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Users, Star } from 'lucide-react';

const CourseCard = ({ course }) => {
  return (
    <Link 
      to={`/courses/${course.course_id}`}
      className="group flex flex-col h-full active:scale-[0.98] transition-all"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden mb-5">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-widest">
            <Users size={14} className="mr-2" />
            <span>{course.instructor_name || "Expert Mentor"}</span>
          </div>
          <div className="flex items-center space-x-1 text-amber-500 font-bold text-sm">
            <Star size={14} fill="currentColor" />
            <span>4.8</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-slate-900 leading-tight tracking-tight group-hover:text-amber-600 transition-colors duration-300">
            {course.title}
          </h3>
          <div className="text-lg font-black text-slate-900 ml-4">
            {course.price > 0 ? `$${course.price}` : 'FREE'}
          </div>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium mb-4">
          {course.description || "Master the core concepts with this comprehensive guide designed for all skill levels."}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
