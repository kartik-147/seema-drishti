import React, { useState } from 'react';
import CCTVFeedCard from './CCTVFeedCard';
import { LayoutGrid, Grid2X2, Plus, Bug, Sparkles, Sliders, Share2 } from 'lucide-react';

export default function CCTVGrid({
  cameras,
  telemetryMap = {},
  currentTimeStr,
  onSelectCamera,
  onOpenEnhance,
  onOpenConnect,
  onOpenDebug,
  onOpenNetworkMap,
  focusedCamId,
  situation
}) {
  const [viewMode, setViewMode] = useState('all6'); // 'all6' or 'top3'

  const displayedCameras = viewMode === 'top3' ? cameras.slice(0, 3) : cameras;
  const linkedCamIds = ['cam_1', 'cam_3', 'cam_5'];

  // Aggregate real detection totals across displayed feeds
  let totalPersons = 0;
  let totalVehicles = 0;
  Object.values(telemetryMap).forEach((t) => {
    if (t?.counts) {
      totalPersons += t.counts.persons || 0;
      totalVehicles += t.counts.vehicles || 0;
    }
  });

  return (
    <div className="space-y-3">
      {/* Grid Sub-header with quick layout switcher & debug tools */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Live Surveillance Grid
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full font-mono">
            {cameras.length} Active Feeds
          </span>

          {/* Real-time Grid Detection Counts */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-slate-600">Persons: <span className="text-blue-600">{totalPersons}</span></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">Vehicles: <span className="text-blue-600">{totalVehicles}</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Cross-Camera Network Dedicated Module Button */}
          <button
            onClick={onOpenNetworkMap}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Open Cross-Camera Situational Awareness Network Map"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Cross-Camera Network</span>
          </button>

          {/* REQUIREMENT 7: [Detection Debug] Developer Proof Button */}
          <button
            onClick={() => onOpenDebug && onOpenDebug(cameras[0])}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 shadow-2xs transition-colors cursor-pointer"
            title="Inspect Original Frame vs Enhanced Frame vs YOLO Result"
          >
            <Bug className="w-3.5 h-3.5 text-blue-600" />
            <span>[Detection Debug]</span>
          </button>

          {/* Quick toggle between 6 screens and 3 screens */}
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg border border-slate-300/60">
            <button
              onClick={() => setViewMode('all6')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'all6'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>6 Screens</span>
            </button>

            <button
              onClick={() => setViewMode('top3')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'top3'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>Primary 3</span>
            </button>
          </div>

          {/* Connect External Camera Button */}
          <button
            onClick={() => onOpenConnect(cameras[0])}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Connect CCTV</span>
          </button>
        </div>
      </div>

      {/* 3-column Grid matching the 6-camera surveillance grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedCameras.map((cam) => {
          const isLinked = linkedCamIds.includes(cam.id);
          const isHighlighted = focusedCamId === cam.id || isLinked;

          return (
            <CCTVFeedCard
              key={cam.id}
              camera={cam}
              telemetry={telemetryMap[cam.id]}
              currentTimeStr={currentTimeStr}
              onSelectCamera={onSelectCamera}
              onOpenEnhance={onOpenEnhance}
              onOpenConnect={onOpenConnect}
              onOpenDebug={onOpenDebug}
              isHighlighted={isHighlighted}
            />
          );
        })}
      </div>
    </div>
  );
}
