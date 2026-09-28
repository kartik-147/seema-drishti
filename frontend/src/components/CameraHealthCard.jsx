import React from 'react';
import { Video, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CameraHealthCard({ cameras, onSelectCamera }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3 transition-all duration-200 hover:shadow-md">
      {/* Header matching photo */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
        <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Video className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm tracking-tight">
          Camera Health
        </h3>
      </div>

      {/* List of Cameras matching photo */}
      <div className="space-y-2 text-xs">
        {cameras.map((cam) => {
          const isHealthy = cam.health === 'Healthy';
          const isDegraded = cam.health === 'Degraded';

          return (
            <div
              key={cam.id}
              onClick={() => onSelectCamera(cam)}
              className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="font-semibold text-slate-800">{cam.name.split('–')[0]?.trim()}</span>
                <span className="text-[11px] text-slate-500">
                  ({cam.name.split('–')[1]?.trim() || cam.location})
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isHealthy
                      ? 'bg-emerald-500'
                      : isDegraded
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                ></span>
                <span
                  className={
                    isHealthy
                      ? 'text-emerald-700'
                      : isDegraded
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }
                >
                  {cam.health}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
