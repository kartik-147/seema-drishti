import React, { useState } from 'react';
import { 
  AlertTriangle, 
  User, 
  MapPin, 
  Clock, 
  Target, 
  ArrowRight, 
  ShieldCheck, 
  FileSearch, 
  CheckCircle2, 
  GitFork,
  Sliders,
  ChevronDown,
  ChevronUp,
  Share2,
  Video,
  Info
} from 'lucide-react';

export default function HighRiskAlertCard({
  situation,
  onReviewSituation,
  onViewEvidence,
  onAcknowledge,
  isAcknowledged
}) {
  const [showDetectionDetails, setShowDetectionDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-red-200/90 shadow-2xs p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
      {/* 1. Clear Operational Header */}
      <div className="flex items-start justify-between pb-3 border-b border-red-100/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 text-red-600 shadow-2xs">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                {situation.situationCode || 'SITUATION #024'}
              </span>
              <span className="text-xs font-bold text-red-600 tracking-wide font-mono uppercase">
                HIGH ATTENTION REQUIRED
              </span>
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight mt-0.5 leading-snug">
              Connected Movement Across 3 Cameras
            </h2>
          </div>
        </div>

        {/* Severity Badge */}
        <div className="text-right">
          <span className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold font-mono">
            Risk: {situation.riskAssessment?.score || 82}/100
          </span>
          <div className="text-[9.5px] font-medium text-slate-400 mt-1">
            Operator action required
          </div>
        </div>
      </div>

      {/* 2. Questions 1 & 2: WHAT DID THE CAMERAS SEE? & DID ANOTHER CAMERA SEE RELATED MOVEMENT? */}
      <div className="py-3 space-y-3">
        {/* Simple Plain-English Story Statement */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-sans space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px] font-mono uppercase text-blue-700">
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Connected Sightings Summary</span>
          </div>
          <p>
            A person was detected at the <strong>North Border (CAM-01)</strong>. Related movement was then detected near the <strong>River Side (CAM-03)</strong>, and continued toward the <strong>Eastern Fence (CAM-05)</strong> within 3 minutes.
          </p>
        </div>

        {/* 3 Visual Camera Exhibits */}
        <div className="grid grid-cols-3 gap-2">
          {/* CAM-01 */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 p-1 text-center group cursor-pointer" onClick={onReviewSituation}>
            <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-900">
              <img src="/cctv/cam1.jpg" alt="CAM-01" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/75 text-white font-mono text-[8px] font-bold">
                CAM-01
              </div>
              <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-red-600 text-white font-mono text-[8px] font-bold">
                08:41
              </div>
            </div>
            <div className="mt-1 text-[10px] font-bold text-slate-800 leading-tight">North Border</div>
            <div className="text-[9px] text-slate-500">Person detected</div>
          </div>

          {/* CAM-03 */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 p-1 text-center group cursor-pointer" onClick={onReviewSituation}>
            <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-900">
              <img src="/cctv/cam3.jpg" alt="CAM-03" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/75 text-white font-mono text-[8px] font-bold">
                CAM-03
              </div>
              <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-amber-600 text-white font-mono text-[8px] font-bold">
                08:42
              </div>
            </div>
            <div className="mt-1 text-[10px] font-bold text-slate-800 leading-tight">River Side</div>
            <div className="text-[9px] text-slate-500">Related movement</div>
          </div>

          {/* CAM-05 */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 p-1 text-center group cursor-pointer" onClick={onReviewSituation}>
            <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-900">
              <img src="/cctv/cam5.jpg" alt="CAM-05" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/75 text-white font-mono text-[8px] font-bold">
                CAM-05
              </div>
              <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-blue-600 text-white font-mono text-[8px] font-bold">
                08:43
              </div>
            </div>
            <div className="mt-1 text-[10px] font-bold text-slate-800 leading-tight">Eastern Fence</div>
            <div className="text-[9px] text-slate-500">Movement continues</div>
          </div>
        </div>

        {/* Non-Biometric Reminder */}
        <div className="text-[10.5px] text-slate-500 flex items-center justify-between font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Non-biometric correlation &bull; Possible same subject</span>
          </span>
          <span className="font-mono text-slate-400">770m Corridor</span>
        </div>

        {/* 3. Expandable "View Detection Details" Button */}
        <div>
          <button
            onClick={() => setShowDetectionDetails(!showDetectionDetails)}
            className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-[11px] font-mono">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>{showDetectionDetails ? 'Hide Detection Details' : 'View Detection Details'}</span>
            </span>
            {showDetectionDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetectionDetails && (
            <div className="p-3 mt-1.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-1.5 border border-slate-800 animate-in fade-in duration-150">
              <div className="text-[10px] text-blue-400 font-bold border-b border-slate-800 pb-1">
                YOLOv8 & TRACKING SENSOR DATA
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                <div>
                  <span className="text-slate-400">CAM-01:</span> Person (Conf: 91%)
                </div>
                <div>
                  <span className="text-slate-400">CAM-03:</span> Person (Conf: 82%, CLAHE)
                </div>
                <div>
                  <span className="text-slate-400">CAM-05:</span> Person (Conf: 86%)
                </div>
                <div>
                  <span className="text-slate-400">Target ID:</span> ByteTrack #P-12
                </div>
              </div>
              <div className="text-[9.5px] text-slate-400 pt-1 border-t border-slate-800">
                Frame Rate: 30 FPS &bull; Inference: 14.2ms &bull; Zero facial scanning
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={onReviewSituation}
          className="flex-1 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <FileSearch className="w-3.5 h-3.5" />
          <span>View Incident Story</span>
        </button>

        <button
          onClick={onAcknowledge}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
            isAcknowledged
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAcknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
        </button>
      </div>
    </div>
  );
}
