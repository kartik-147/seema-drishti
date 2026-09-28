import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  TrendingUp, 
  BookOpen, 
  ShieldAlert, 
  Info, 
  Layers,
  HelpCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function AIExplanationCard({
  situation,
  onOpenStory,
  onOpenByteTrackInfo
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const risk = situation.riskAssessment || {
    level: 'HIGH',
    score: 82,
    typeLabel: 'HEURISTIC EVALUATION',
    reason: 'Sequential sightings detected across 3 monitored sectors within 3 minutes.'
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200/90 shadow-2xs p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
      {/* 1. Header: Question 3: WHY DID THE SYSTEM CONNECT THESE? */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600 shadow-2xs">
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                WHY CONNECTED?
              </span>
              <span className="text-xs font-bold text-slate-700">Explainable AI</span>
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight mt-0.5">
              Why The System Linked These
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono font-bold text-xs">
            Risk: {risk.score}/100
          </span>
          <div className="text-[9.5px] font-medium text-slate-400 mt-1">
            High attention
          </div>
        </div>
      </div>

      {/* 2. Core Plain-English Explanation First */}
      <div className="py-3 space-y-3">
        {/* Core Interpretation */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-sans">
          <p className="font-semibold text-slate-800">
            "Three camera observations were linked because they occurred within a short time window and followed a consistent movement direction."
          </p>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">
            The target in Camera 1 was observed heading south-east. Camera 3 picked up related movement 56 seconds later in the river depression, followed by Camera 5 along the outer fence.
          </p>
        </div>

        {/* 4 Simple Reason Blocks */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-0.5">
            <div className="text-[10.5px] font-bold text-blue-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Time Window
            </div>
            <div className="text-[11px] text-slate-600 leading-tight">
              All 3 sightings within 3 minutes (08:41 to 08:43)
            </div>
          </div>

          <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-0.5">
            <div className="text-[10.5px] font-bold text-blue-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Continuous Path
            </div>
            <div className="text-[11px] text-slate-600 leading-tight">
              Natural walking corridor North &rarr; River &rarr; Fence
            </div>
          </div>

          <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-0.5">
            <div className="text-[10.5px] font-bold text-blue-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Pace & Velocity
            </div>
            <div className="text-[11px] text-slate-600 leading-tight">
              Consistent pedestrian speed of ~1.2 m/s
            </div>
          </div>

          <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-0.5">
            <div className="text-[10.5px] font-bold text-blue-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Sensitive Zone
            </div>
            <div className="text-[11px] text-slate-600 leading-tight">
              Crossed into restricted boundary buffer
            </div>
          </div>
        </div>

        {/* Required Non-Biometric & Human Decision Notice */}
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[10.5px] text-amber-900 leading-tight flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>AI assistance only &bull; Operator verification required.</strong> The system does not claim facial identity. The human operator decides what actions to take.
          </span>
        </div>

        {/* 3. Expandable "Technical Details" Button */}
        <div>
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-[11px] font-mono">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>{showTechnicalDetails ? 'Hide Technical Calculation' : 'View Technical Calculation'}</span>
            </span>
            {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTechnicalDetails && (
            <div className="p-3 mt-1.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-1.5 border border-slate-800 animate-in fade-in duration-150">
              <div className="text-[10px] text-blue-400 font-bold border-b border-slate-800 pb-1">
                TRANSPARENT HEURISTIC RISK BREAKDOWN:
              </div>
              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cross-camera corridor movement:</span>
                  <strong className="text-blue-400">+30</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Restricted waterline presence:</span>
                  <strong className="text-blue-400">+25</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Night/low-light condition (CLAHE):</span>
                  <strong className="text-blue-400">+12</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Movement persistence (over 3 min):</span>
                  <strong className="text-blue-400">+10</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Optical detection confidence:</span>
                  <strong className="text-blue-400">+05</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-700 font-bold text-white">
                  <span>Total Calculated Risk Score:</span>
                  <span className="text-red-400">82 / 100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Action Links */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          onClick={onOpenStory}
          className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 hover:underline cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Inspect Storyline Re-ID</span>
        </button>

        <button
          onClick={onOpenByteTrackInfo}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
          <span>Tracking Engine</span>
        </button>
      </div>
    </div>
  );
}
