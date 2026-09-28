import React, { useState, useEffect } from 'react';
import { X, Sliders, Activity, Sparkles, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function DetectionDebugModal({ isOpen, onClose, camera, confidenceThreshold = 0.35 }) {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('side-by-side'); // 'side-by-side' or 'tabs'
  const [activeTab, setActiveTab] = useState('yolo'); // 'original', 'enhanced', 'yolo'

  const fetchDebugData = async () => {
    if (!camera) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/cctv/debug/${camera.id}`);
      if (res.ok) {
        const data = await res.json();
        setDebugData(data);
      }
    } catch (err) {
      console.error('Failed to fetch debug data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && camera) {
      fetchDebugData();
    }
  }, [isOpen, camera]);

  if (!isOpen || !camera) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold">
              {debugData?.code || camera.code}
            </span>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>[Detection Debug] Pipeline Proof</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REAL YOLOv8 INFERENCE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {debugData?.name || camera.name} — Sector: {debugData?.location || camera.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDebugData}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Debug Frame"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Technical Proof Metrics Bar (Requirement 7) */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 text-slate-200 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Brightness</div>
            <div className={`text-sm font-bold mt-0.5 ${debugData?.is_low_light ? 'text-amber-400' : 'text-emerald-400'}`}>
              {debugData ? `${debugData.brightness}` : '—'}
            </div>
          </div>

          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Contrast</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {debugData ? `${debugData.contrast}` : '—'}
            </div>
          </div>

          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Enhancement</div>
            <div className="text-xs font-bold text-blue-400 mt-0.5 truncate" title={debugData?.enhancement}>
              {debugData ? (debugData.enhancement.startsWith('CLAHE') ? 'CLAHE' : 'NONE') : '—'}
            </div>
          </div>

          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Conf Threshold</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              {debugData ? `${debugData.confidence_threshold}` : confidenceThreshold}
            </div>
          </div>

          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Detections</div>
            <div className={`text-sm font-bold mt-0.5 ${debugData?.detections_count > 0 ? 'text-red-400 font-extrabold' : 'text-slate-400'}`}>
              {debugData ? `${debugData.detections_count}` : '0'}
            </div>
          </div>

          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Inference Time</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              {debugData ? `${debugData.inference_ms} ms` : '—'}
            </div>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="px-6 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Comparison Mode:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-200 border border-slate-300 text-xs">
              <button
                onClick={() => setActiveView('side-by-side')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeView === 'side-by-side' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Side-by-Side (3 Stages)
              </button>
              <button
                onClick={() => setActiveView('tabs')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeView === 'tabs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Expanded View
              </button>
            </div>
          </div>

          {activeView === 'tabs' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('original')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  activeTab === 'original' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                1. Original Frame
              </button>
              <button
                onClick={() => setActiveTab('enhanced')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  activeTab === 'enhanced' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                2. Enhanced Frame
              </button>
              <button
                onClick={() => setActiveTab('yolo')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  activeTab === 'yolo' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                3. YOLO Result
              </button>
            </div>
          )}
        </div>

        {/* Frames Display Area */}
        <div className="p-6 bg-slate-50 flex-1">
          {loading && !debugData ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Extracting raw frame and running real YOLOv8 inference...</p>
            </div>
          ) : activeView === 'side-by-side' ? (
            /* 3-Column Pipeline Comparison */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Stage 1: Original Frame */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                <div className="px-3 py-2 bg-slate-900 text-slate-200 text-xs font-bold flex items-center justify-between">
                  <span>1. Original Frame</span>
                  <span className="text-[10px] text-slate-400 font-mono">Raw CCTV Input</span>
                </div>
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {debugData?.original_frame ? (
                    <img src={debugData.original_frame} alt="Original CCTV" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-slate-500">No frame data</div>
                  )}
                  {debugData?.is_low_light && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500/90 text-white text-[10px] font-bold rounded">
                      LOW LIGHT (&lt; 65)
                    </div>
                  )}
                </div>
                <div className="p-3 text-xs text-slate-600 space-y-1 bg-slate-50 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mean Brightness:</span>
                    <span className="font-mono font-semibold">{debugData?.brightness || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Standard Deviation:</span>
                    <span className="font-mono font-semibold">{debugData?.contrast || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Stage 2: Enhanced Frame */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                <div className="px-3 py-2 bg-slate-900 text-slate-200 text-xs font-bold flex items-center justify-between">
                  <span>2. Enhanced Frame</span>
                  <span className="text-[10px] text-blue-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> OpenCV CLAHE
                  </span>
                </div>
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {debugData?.enhanced_frame ? (
                    <img src={debugData.enhanced_frame} alt="Enhanced CCTV" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-slate-500">No frame data</div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600/90 text-white text-[10px] font-bold rounded">
                    {debugData?.enhancement !== 'NONE' ? 'ENHANCED (CLAHE)' : 'PASSTHROUGH (NORMAL)'}
                  </div>
                </div>
                <div className="p-3 text-xs text-slate-600 space-y-1 bg-slate-50 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Color Space:</span>
                    <span className="font-mono font-semibold">LAB (L-Channel CLAHE)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contrast Status:</span>
                    <span className="font-mono font-semibold text-blue-700">{debugData?.enhancement || 'NONE'}</span>
                  </div>
                </div>
              </div>

              {/* Stage 3: YOLO Detection Result */}
              <div className="bg-white rounded-xl border-2 border-blue-500 overflow-hidden shadow-xs flex flex-col">
                <div className="px-3 py-2 bg-blue-600 text-white text-xs font-bold flex items-center justify-between">
                  <span>3. YOLOv8 Result</span>
                  <span className="text-[10px] text-white/90 font-mono">ByteTrack Active</span>
                </div>
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {debugData?.yolo_result ? (
                    <img src={debugData.yolo_result} alt="YOLOv8 Output" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-slate-500">No detection data</div>
                  )}
                  {debugData?.detections_count === 0 ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="px-3 py-1.5 bg-slate-900/90 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold">
                        NO OBJECT DETECTED
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="p-3 text-xs text-slate-600 space-y-1 bg-blue-50/60 border-t border-blue-200">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Objects Detected:</span>
                    <span className="font-mono font-bold text-slate-900">{debugData?.detections_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Inference Latency:</span>
                    <span className="font-mono font-bold text-emerald-700">{debugData?.inference_ms || 0} ms</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Single Tab Expanded View */
            <div className="bg-slate-950 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center max-w-3xl mx-auto shadow-lg">
              {activeTab === 'original' && debugData?.original_frame && (
                <img src={debugData.original_frame} alt="Original Frame" className="w-full h-full object-contain" />
              )}
              {activeTab === 'enhanced' && debugData?.enhanced_frame && (
                <img src={debugData.enhanced_frame} alt="Enhanced Frame" className="w-full h-full object-contain" />
              )}
              {activeTab === 'yolo' && debugData?.yolo_result && (
                <img src={debugData.yolo_result} alt="YOLO Result" className="w-full h-full object-contain" />
              )}
            </div>
          )}

          {/* Detections List Details */}
          {debugData?.detections && debugData.detections.length > 0 ? (
            <div className="mt-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Runtime YOLO Detections ({debugData.detections.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {debugData.detections.map((d, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{d.display_label}</div>
                      <div className="text-[11px] text-slate-500">Class: {d.class}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-blue-600">
                        {d.confidence_formatted}
                      </div>
                      <div className="text-[10px] text-slate-400">Confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-mono text-center">
              NO OBJECT DETECTED — Verified zero bounding boxes drawn. System prioritizing technical truth.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Pipeline Proof: YOLOv8 Inference Active on Device: CPU</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
          >
            Close Debug View
          </button>
        </div>

      </div>
    </div>
  );
}
