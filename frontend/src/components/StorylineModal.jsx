import React, { useState } from 'react';
import { 
  X, Compass, MapPin, Clock, ArrowRight, ShieldCheck, 
  Activity, CheckCircle, AlertTriangle, Eye, Sparkles, Layers,
  FileCheck, ShieldAlert, XCircle, AlertOctagon, Sliders, Info
} from 'lucide-react';

export default function StorylineModal({
  isOpen,
  onClose,
  situation,
  onFocusCamera,
  onVerify,
  onDismiss,
  onEscalate
}) {
  const [selectedChainStep, setSelectedChainStep] = useState(1);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!isOpen) return null;

  const chain = situation.trajectoryChain || [
    {
      step: 1,
      camCode: 'CAM-01',
      cameraName: 'Camera 1 — North Border',
      location: 'North Border',
      timestamp: '08:41:12',
      confidence: '91%',
      detectionLabel: 'Person P-12',
      quality: 'NORMAL',
      story: 'A person was detected near the North Border outer fence.',
      techDetails: {
        model: 'YOLOv8n (Ultralytics)',
        conf: '0.91',
        bbox: '[x: 420, y: 180, w: 64, h: 142]',
        frame: '842',
        fps: '59.9'
      }
    },
    {
      step: 2,
      camCode: 'CAM-03',
      cameraName: 'Camera 3 — River Side',
      location: 'River Side',
      timestamp: '08:42:08',
      confidence: '88%',
      detectionLabel: 'Related Movement',
      quality: 'ENHANCED (CLAHE)',
      story: 'A related movement was detected near the river.',
      techDetails: {
        model: 'YOLOv8n + OpenCV CLAHE',
        conf: '0.88',
        bbox: '[x: 210, y: 310, w: 58, h: 130]',
        frame: '1,420',
        fps: '59.9',
        clahe: 'ClipLimit: 2.0, TileGrid: 8x8 (+38% Dynamic Range)'
      }
    },
    {
      step: 3,
      camCode: 'CAM-05',
      cameraName: 'Camera 5 — Eastern Fence',
      location: 'Eastern Fence',
      timestamp: '08:43:17',
      confidence: '84%',
      detectionLabel: 'Continuing Traversal',
      quality: 'NORMAL',
      story: 'The movement continued toward the Eastern Fence.',
      techDetails: {
        model: 'YOLOv8n (Ultralytics)',
        conf: '0.84',
        bbox: '[x: 580, y: 220, w: 62, h: 138]',
        frame: '2,110',
        fps: '59.9'
      }
    }
  ];

  const activeItem = chain.find(c => c.step === selectedChainStep) || chain[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {situation.situationCode || 'SITUATION #024'} — Visual Operational Story
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
                  HIGH ATTENTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-slate-500 italic mt-0.5">
                "SEEMA DRISHTI turns separate CCTV detections into one understandable border situation."
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 font-sans">

          {/* Answering Questions 1 & 2: WHAT DID THE CAMERAS SEE? */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px]">
                  QUESTIONS 1 & 2
                </span>
                <span>WHAT DID THE CAMERAS SEE? (CROSS-CAMERA STORYLINE)</span>
              </div>
              <span className="text-[11px] font-mono text-blue-700 font-bold">
                CAM-01 → CAM-03 → CAM-05 (2 min 05 sec)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {chain.map((c) => {
                const isSelected = c.step === selectedChainStep;
                return (
                  <button
                    key={c.step}
                    onClick={() => setSelectedChainStep(c.step)}
                    className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                        {c.camCode}
                      </span>
                      <span className="font-mono font-bold text-slate-700">{c.timestamp}</span>
                    </div>

                    <div className="font-bold text-slate-800 text-xs mt-1">
                      {c.cameraName}
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
                      {c.story}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/70 text-[10.5px]">
                      <span className="font-semibold text-blue-800">
                        {c.step === 1 ? 'Initial Detection' : 'Related Movement'}
                      </span>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                        {c.quality}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Sighting Evidence View with Expandable Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            {/* Visual Snapshot */}
            <div className="space-y-2">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 bg-slate-900 shadow-sm">
                <img
                  src={activeItem.step === 1 ? '/cctv/cam1.jpg' : activeItem.step === 2 ? '/cctv/cam3.jpg' : '/cctv/cam5.jpg'}
                  alt={activeItem.cameraName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono">
                  {activeItem.camCode} | {activeItem.location}
                </div>

                {/* Bounding box */}
                <div className="absolute inset-x-[38%] inset-y-[24%] border-2 border-red-500 rounded-xs">
                  <div className="absolute -top-5 left-0 px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold shadow-xs whitespace-nowrap">
                    {activeItem.step === 1 ? 'Person Detected' : 'Possible Same Subject'}
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono">
                  {activeItem.timestamp}
                </div>
              </div>

              {/* Jump to live camera button */}
              <button
                onClick={() => {
                  const cid = activeItem.camCode.toLowerCase().replace('-', '_');
                  onFocusCamera(cid);
                  onClose();
                }}
                className="w-full py-1.5 px-3 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Jump to {activeItem.cameraName} Live Feed</span>
              </button>
            </div>

            {/* Sighting Explanation & Expandable Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10.5px] font-bold">
                  Sighting #{activeItem.step} of 3
                </span>
                
                {/* Expandable Technical Details Button */}
                <button
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{showTechnicalDetails ? 'Hide Technical Details' : 'View Detection Details'}</span>
                </button>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {activeItem.cameraName}
                </h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {activeItem.story}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Non-biometric spatial-temporal correlation indicates this movement is continuous with previous sector sightings.
                </p>
              </div>

              {/* Expandable Technical Details Drawer */}
              {showTechnicalDetails && activeItem.techDetails && (
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[10.5px] font-mono space-y-1 border border-slate-800 shadow-inner animate-in fade-in duration-150">
                  <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1">
                    Technical Telemetry ({activeItem.camCode})
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model:</span>
                    <span>{activeItem.techDetails.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-emerald-400">{activeItem.techDetails.conf}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bounding Box:</span>
                    <span>{activeItem.techDetails.bbox}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Frame / FPS:</span>
                    <span>{activeItem.techDetails.frame} ({activeItem.techDetails.fps} FPS)</span>
                  </div>
                  {activeItem.techDetails.clahe && (
                    <div className="pt-1 border-t border-slate-800 text-amber-400 text-[9.5px]">
                      CLAHE: {activeItem.techDetails.clahe}
                    </div>
                  )}
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Status Note:</span>
                <span className="text-slate-700">
                  {activeItem.step === 1
                    ? 'Initial sighting near fence line; correlation engine initiated trajectory tracking.'
                    : activeItem.step === 2
                    ? 'Transit time from CAM-01 matches normal walking pace (~1.2 m/s). Low-light CLAHE active.'
                    : 'Traversed 770m across 3 sectors; flagged as high-attention situation.'}
                </span>
              </div>
            </div>
          </div>

          {/* Answering Question 3: WHY DID THE SYSTEM CONNECT THESE EVENTS? */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/90 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px] font-bold">
                QUESTION 3
              </span>
              <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                WHY DID THE SYSTEM CONNECT THESE EVENTS?
              </span>
            </div>

            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              "Three camera observations were linked because they occurred within a short time window and followed a consistent movement direction along the monitored border perimeter."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded-xl bg-white border border-blue-200/70">
                <span className="text-slate-400 block text-[9.5px]">1. TIME WINDOW</span>
                <strong className="text-emerald-700">2 min 05 sec (&lt; 3m threshold)</strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-blue-200/70">
                <span className="text-slate-400 block text-[9.5px]">2. CORRIDOR PATH</span>
                <strong className="text-blue-800">Alpha → Charlie → Echo</strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-blue-200/70">
                <span className="text-slate-400 block text-[9.5px]">3. SPEED & DIRECTION</span>
                <strong className="text-blue-800">~1.2 m/s (South-East)</strong>
              </div>
            </div>
          </div>

          {/* Answering Question 4: WHAT SHOULD THE OPERATOR REVIEW / DECIDE? */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-mono text-[10px] font-bold">
                    QUESTION 4
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    WHAT SHOULD THE OPERATOR REVIEW / DECIDE?
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  High attention required (Risk Score 82/100). You remain the final authority on this incident.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onVerify();
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Verify as legitimate border intrusion"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>VERIFY INTRUSION</span>
                </button>

                <button
                  onClick={() => {
                    onDismiss();
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Dismiss as benign / false alarm"
                >
                  <XCircle className="w-4 h-4" />
                  <span>DISMISS</span>
                </button>

                <button
                  onClick={() => {
                    onEscalate();
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Escalate to Command and dispatch QRT Patrol"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>ESCALATE TO QRT</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 text-xs">
          <div className="text-slate-500 font-medium">
            Heuristic Risk Score: <strong className="text-slate-800 font-mono">Score 82/100 (HIGH RISK)</strong> &bull; Non-biometric Correlation
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Situation
          </button>
        </div>

      </div>
    </div>
  );
}
