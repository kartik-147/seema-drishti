import React from 'react';
import { X, Bell, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function NotificationModal({ isOpen, onClose, events, onOpenStory }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Surveillance System Notifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${evt.color} shrink-0 mt-1`}></span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{evt.text}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{evt.time}</span>
                </div>
                {evt.id === 1 && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenStory();
                    }}
                    className="mt-1 text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View Multi-Camera Narrative Storyline &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 flex justify-end bg-slate-50/70">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
