import React from 'react';
import { X, ShieldCheck, Check, Cpu, EyeOff, Layers, Activity } from 'lucide-react';

export default function ByteTrackInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                ByteTrack Multi-Camera Target Association
              </h2>
              <p className="text-xs text-slate-500">
                Non-biometric, privacy-preserving tracking architecture (No facial recognition)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-sm mb-1">
              <EyeOff className="w-4 h-4 text-amber-700" />
              <span>Why Face Recognition Fails in Border Surveillance:</span>
            </div>
            Border surveillance cameras operate at <strong>50 to 300 meters distance</strong>. At this range, human faces occupy fewer than 10x10 pixels, completely breaking facial recognition models. Furthermore, bad weather (fog, dust, rain), infrared night vision, and subjects wearing hoods, helmets, or facing backward render facial biometrics useless.
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>How DRISHTI Uses ByteTrack:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">1. Two-Stage Bounding Box Association</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Unlike traditional trackers that discard low-confidence detections, ByteTrack associates both high-score and low-score boxes using spatial IoU, keeping targets tracked even behind trees or fences.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">2. Kalman Filter Velocity Predictor</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Maintains continuous spatial motion vectors (position, velocity, aspect ratio) so when a subject moves out of frame, their expected trajectory is projected seamlessly.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">3. Deep Appearance Re-ID Embeddings</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Extracts 512-dimensional color, clothing, silhouette, and backpack vectors. Calculates Cosine Similarity between cameras to recognize <strong>Person ID 12</strong> across Cam 1 → Cam 2 → Cam 3.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800">4. Zero Biometric Storage</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  No facial photographs or personal biometric records are stored. Strictly complies with Indian defense data privacy and surveillance legal standards.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end bg-slate-50/70">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
}
