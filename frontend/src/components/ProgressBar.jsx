import React from 'react';

const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-700">Course Progress</span>
        <span className="text-sm font-bold text-primary-600">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-primary-600 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(14,165,233,0.5)]"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
