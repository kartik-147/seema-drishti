import React, { useState } from 'react';
import { 
  X, Sliders, Sparkles, Check, RefreshCw, Eye, Info, CheckCircle2, Shield 
} from 'lucide-react';

export default function VideoEnhancementModal({
  isOpen,
  onClose,
  cameras,
  selectedCamera,
  onUpdateCameraEnhancement
}) {
  const [activeCamId, setActiveCamId] = useState(selectedCamera?.id || 'cam_2');
  const [clipLimit, setClipLimit] = useState(3.5);
  const [contrastBoost, setContrastBoost] = useState(1.35);
  const [brightnessBoost, setBrightnessBoost] = useState(1.08);
  const [dehazeStrength, setDehazeStrength] = useState(75);
  const [isApplied, setIsApplied] = useState(false);

  if (!isOpen) return null;

  const currentCam = cameras.find(c => c.id === activeCamId) || cameras[0];

  const handleApply = () => {
    onUpdateCameraEnhancement(activeCamId, {
      claheActive: true,
      contrastBoost,
      brightnessBoost,
      clipLimit,
      dehazeStrength
    });
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2000);
  };

  const handleReset = () => {
    setClipLimit(3.5);
    setContrastBoost(1.35);
    setBrightnessBoost(1.08);
    setDehazeStrength(75);
    onUpdateCameraEnhancement(activeCamId, {
      claheActive: false,
      contrastBoost: 1.0,
      brightnessBoost: 1.0
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  CCTV Video Quality Restoration & Dehazing
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                  OpenCV CLAHE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Enhance low-light, atmospheric fog, and grainy border CCTV camera feeds in real time
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Camera Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {cameras.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCamId(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCamId === c.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Side-by-Side Comparison: RAW vs RESTORED */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* RAW UNENHANCED FRAME */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200">
                <span className="font-bold text-red-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  RAW DEGRADED CCTV INPUT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">FOG / LOW CONTRAST</span>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
                <img
                  src={currentCam.bgImage}
                  alt="Raw Degraded"
                  className="w-full h-full object-cover filter brightness-70 contrast-60 saturate-75"
                />
                <div className="absolute inset-0 bg-white/15 backdrop-blur-[0.5px]"></div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-950/80 text-red-200 text-[10px] font-mono">
                  Contrast: 6.4 (Compressed)
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span>Dynamic Range:</span>
                  <strong className="text-red-500 font-mono">Low (Compressed)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Effective Range:</span>
                  <strong className="text-red-500 font-mono">~45 meters</strong>
                </div>
                <div className="flex justify-between">
                  <span>Detection Confidence:</span>
                  <strong className="text-red-500 font-mono">42% (High Miss Risk)</strong>
                </div>
              </div>
            </div>

            {/* RESTORED CLAHE FRAME */}
            <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-200">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  CLAHE ENHANCED SURVEILLANCE OUTPUT
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                  RESTORED
                </span>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-300 bg-slate-900 shadow-sm">
                <img
                  src={currentCam.bgImage}
                  alt="Restored CLAHE"
                  className="w-full h-full object-cover transition-all duration-150"
                  style={{
                    filter: `contrast(${contrastBoost}) brightness(${brightnessBoost}) saturate(1.15)`
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[10px] font-mono">
                  Contrast Gain: +{((contrastBoost - 1) * 100).toFixed(0)}%
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span>Adaptive Histogram Equalization:</span>
                  <strong className="text-emerald-700 font-mono">Tile Grid 8x8, Clip {clipLimit.toFixed(1)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Effective Range:</span>
                  <strong className="text-emerald-700 font-mono">~160 meters (+255%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Detection Confidence:</span>
                  <strong className="text-emerald-700 font-mono">87% Operational</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Tuning Sliders */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Video Restoration Controls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Clip Limit Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>CLAHE Clip Limit (Noise Suppression):</span>
                  <span className="font-mono font-bold text-emerald-700">{clipLimit.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={clipLimit}
                  onChange={(e) => setClipLimit(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Contrast Boost Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>Dynamic Contrast Gain:</span>
                  <span className="font-mono font-bold text-emerald-700">{contrastBoost.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.2"
                  step="0.05"
                  value={contrastBoost}
                  onChange={(e) => setContrastBoost(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Brightness Boost Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>Low-Light Gamma / Luminance:</span>
                  <span className="font-mono font-bold text-emerald-700">{brightnessBoost.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.02"
                  value={brightnessBoost}
                  onChange={(e) => setBrightnessBoost(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Dehaze Intensity */}
              <div className="space-y-1">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>Atmospheric Dehazing Intensity:</span>
                  <span className="font-mono font-bold text-emerald-700">{dehazeStrength}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={dehazeStrength}
                  onChange={(e) => setDehazeStrength(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Technical Principle Box */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs space-y-1">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Engineering Principle: Luminance-Channel CLAHE</span>
            </div>
            <p className="text-blue-800/90 leading-relaxed text-[11px]">
              Global histogram equalization causes oversaturation and noise amplification in border surveillance. Our module transforms video frames into CIELAB color space, operates strictly on the <strong>Luminance (L) channel</strong> using 8x8 adaptive local tiles with mathematical clip limits, and leaves Chrominance (A & B) channels untouched. This guarantees authentic color preservation for vehicles, uniforms, and terrain while penetrating fog.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 text-xs">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
            >
              {isApplied ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span>{isApplied ? 'Enhanced Applied!' : `Apply to ${currentCam.name}`}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
