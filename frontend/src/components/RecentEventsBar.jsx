import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

export default function RecentEventsBar({ events, onViewAll }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 hover:shadow-md">
      {/* Title */}
      <div className="flex items-center gap-2 shrink-0">
        <Clock className="w-4 h-4 text-slate-500" />
        <span className="font-bold text-slate-800 text-sm tracking-tight">
          Recent Events
        </span>
      </div>

      {/* Horizontal Event Chips matching photo */}
      <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none flex-1">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs shrink-0 hover:bg-slate-100/80 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${evt.color} shrink-0`}></span>
            <span className="font-mono font-semibold text-slate-700">{evt.time}</span>
            <span className="text-slate-600 font-medium">{evt.text}</span>
          </div>
        ))}
      </div>

      {/* View All Link matching photo */}
      <button
        onClick={onViewAll}
        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 self-end sm:self-center transition-colors"
      >
        <span>View All</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
