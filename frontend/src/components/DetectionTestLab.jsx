import React, { useState, useEffect } from 'react';
import { 
  Upload, Play, Power, CheckCircle, XCircle, AlertTriangle, 
  Sparkles, Sliders, RefreshCw, FileVideo, Image as ImageIcon, ShieldCheck
} from 'lucide-react';

export default function DetectionTestLab({ onModelStatusChange, currentModelStatus = 'MODEL ACTIVE' }) {
  const [file, setFile] = useState(null);
  const [confidence, setConfidence] = useState(0.35);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTestNum, setActiveTestNum] = useState(null);
  const [modelState, setModelState] = useState(currentModelStatus);

  // Sync model status
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/model/status')
      .then(res => res.json())
      .then(data => {
        setModelState(data.status);
        setConfidence(data.confidence_threshold || 0.35);
      })
      .catch(() => {});
  }, []);

  // Update confidence threshold
  const handleConfidenceChange = async (newVal) => {
    setConfidence(newVal);
    try {
      await fetch('http://127.0.0.1:8000/api/settings/confidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: newVal })
      });
    } catch (err) {
      console.error('Failed to update confidence', err);
    }
  };

  // Toggle model online/offline (Acceptance Test 5)
  const handleToggleModel = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/model/toggle', { method: 'POST' });
      const data = await res.json();
      setModelState(data.status);
      if (onModelStatusChange) {
        onModelStatusChange(data.status);
      }
    } catch (err) {
      console.error('Failed to toggle model', err);
    }
  };

  // Run Custom Uploaded File
  const handleRunInference = async (e) => {
    if (e) e.preventDefault();
    if (!file) {
      setError('Please select an image or MP4 video file to test.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('conf_thresh', confidence);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/test/inference', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Inference failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error executing YOLOv8 model inference');
    } finally {
      setLoading(false);
    }
  };

  // Run Pre-built Acceptance Test
  const handleRunAcceptanceTest = async (testNum) => {
    setActiveTestNum(testNum);
    setError(null);
    setResult(null);

    if (testNum === 5) {
      // Test 5: Disable/Enable model
      await handleToggleModel();
      return;
    }

    setLoading(true);

    const sampleMap = {
      1: 'test1_person.jpg',
      2: 'test2_empty.jpg',
      3: 'test3_moving_person.mp4',
      4: 'test4_dark_night.mp4'
    };

    const sampleName = sampleMap[testNum];

    try {
      const formData = new FormData();
      formData.append('conf_thresh', confidence);

      const res = await fetch(`http://127.0.0.1:8000/api/test/sample/${sampleName}`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Test execution failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* 1. Header Banner */}
      <div className="px-6 py-5 bg-slate-900 text-white border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Ultralytics YOLOv8 Verification & Testing Laboratory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Requirement 14 & 15: Prove model validity with real frame evaluation, classes, confidence, and inference latency.
          </p>
        </div>

        {/* Model Status Indicator & Test 5 Toggle Switch */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold ${
            modelState === 'MODEL ACTIVE'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${modelState === 'MODEL ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
            <span>{modelState}</span>
          </div>

          <button
            onClick={handleToggleModel}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              modelState === 'MODEL ACTIVE'
                ? 'bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border-red-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
            title="Acceptance Test 5: Toggle Model State"
          >
            <Power className="w-3.5 h-3.5" />
            <span>{modelState === 'MODEL ACTIVE' ? 'Simulate Model Offline (Test 5)' : 'Re-enable YOLO Model'}</span>
          </button>
        </div>
      </div>

      {/* 2. Acceptance Tests 1-5 Quick Bar */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <span>Official Acceptance Test Suite</span>
          <span className="text-[10px] text-slate-400 font-mono font-normal">(1-Click Verification)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          
          <button
            onClick={() => handleRunAcceptanceTest(1)}
            disabled={loading}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeTestNum === 1
                ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="text-[10px] font-bold text-blue-600 uppercase font-mono">Acceptance Test 1</div>
            <div className="text-xs font-bold mt-0.5 truncate">Visible Person Image</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">Expects: Bounding box drawn</div>
          </button>

          <button
            onClick={() => handleRunAcceptanceTest(2)}
            disabled={loading}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeTestNum === 2
                ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="text-[10px] font-bold text-emerald-600 uppercase font-mono">Acceptance Test 2</div>
            <div className="text-xs font-bold mt-0.5 truncate">No Person Image</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">Expects: 0 boxes, NO OBJECT</div>
          </button>

          <button
            onClick={() => handleRunAcceptanceTest(3)}
            disabled={loading}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeTestNum === 3
                ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="text-[10px] font-bold text-purple-600 uppercase font-mono">Acceptance Test 3</div>
            <div className="text-xs font-bold mt-0.5 truncate">Moving Person MP4</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">Expects: ByteTrack tracking ID</div>
          </button>

          <button
            onClick={() => handleRunAcceptanceTest(4)}
            disabled={loading}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeTestNum === 4
                ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="text-[10px] font-bold text-amber-600 uppercase font-mono">Acceptance Test 4</div>
            <div className="text-xs font-bold mt-0.5 truncate">Dark Night Video</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">Expects: CLAHE activates + YOLO</div>
          </button>

          <button
            onClick={() => handleRunAcceptanceTest(5)}
            disabled={loading}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeTestNum === 5
                ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="text-[10px] font-bold text-red-600 uppercase font-mono">Acceptance Test 5</div>
            <div className="text-xs font-bold mt-0.5 truncate">Disable YOLO Model</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">Expects: MODEL OFFLINE</div>
          </button>

        </div>
      </div>

      {/* 3. Controls Bar: Custom File Upload & Confidence Slider */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <form onSubmit={handleRunInference} className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between">
          
          {/* File Picker */}
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
            <label className="flex-1 w-full border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-3 group">
              <input
                type="file"
                accept="image/*,video/mp4,video/avi,video/mov,video/webm"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setActiveTestNum(null);
                }}
                className="hidden"
              />
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <div className="text-xs truncate">
                <span className="font-semibold text-slate-700 group-hover:text-blue-600">
                  {file ? file.name : 'Upload custom Image or MP4 video'}
                </span>
                <span className="text-slate-400 block text-[10px]">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Supports .jpg, .png, .mp4 (real frame inference)'}
                </span>
              </div>
            </label>

            <button
              type="submit"
              disabled={!file || loading || modelState !== 'MODEL ACTIVE'}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run YOLO Inference</span>
                </>
              )}
            </button>
          </div>

          {/* Configurable Confidence Threshold Slider */}
          <div className="w-full lg:w-72 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Confidence Threshold:</span>
              <span className="font-mono font-bold text-blue-600">{confidence.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={confidence}
              onChange={(e) => handleConfidenceChange(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>0.10 (Sensitive)</span>
              <span>0.35 (Default)</span>
              <span>0.90 (Strict)</span>
            </div>
          </div>

        </form>
      </div>

      {/* 4. Error Feedback */}
      {error && (
        <div className="mx-6 mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
          <div>
            <div className="font-bold">Inference Error:</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* 5. Results Section */}
      {result && (
        <div className="p-6 space-y-6">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Media Type</div>
              <div className="text-sm font-bold text-slate-800 mt-1 font-mono">{result.media_type || 'IMAGE'}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Inference Latency</div>
              <div className="text-sm font-bold text-emerald-600 mt-1 font-mono">{result.inference_ms} ms</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Detections</div>
              <div className={`text-sm font-extrabold mt-1 font-mono ${result.total_detections > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                {result.total_detections}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Brightness</div>
              <div className={`text-sm font-bold mt-1 font-mono ${result.low_light_detected ? 'text-amber-600' : 'text-slate-800'}`}>
                {result.brightness}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Enhancement</div>
              <div className="text-xs font-bold text-blue-600 mt-1 truncate" title={result.enhancement_applied}>
                {result.enhancement_applied.startsWith('CLAHE') ? 'CLAHE' : 'NONE'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">YOLO Status</div>
              <div className="text-xs font-bold text-emerald-600 mt-1 font-mono">GENUINE RUN</div>
            </div>
          </div>

          {/* Side-by-Side Verification Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Input Frame */}
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
              <div className="px-3 py-2 bg-slate-900 text-slate-200 text-xs font-bold flex items-center justify-between">
                <span>Input Frame (Original)</span>
                <span className="text-[10px] text-slate-400 font-mono">{result.filename}</span>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                {result.original_image_base64 && (
                  <img src={result.original_image_base64} alt="Original Frame" className="w-full h-full object-contain" />
                )}
              </div>
            </div>

            {/* Right: YOLO Detection Result */}
            <div className="bg-slate-950 rounded-xl overflow-hidden border-2 border-blue-500 shadow-sm">
              <div className="px-3 py-2 bg-blue-600 text-white text-xs font-bold flex items-center justify-between">
                <span>YOLO Detection Result</span>
                <span className="text-[10px] text-white/90 font-mono">Conf: {result.confidence_threshold}</span>
              </div>
              <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                {result.annotated_image_base64 && (
                  <img src={result.annotated_image_base64} alt="YOLO Detection Output" className="w-full h-full object-contain" />
                )}
                {result.total_detections === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="px-4 py-2 bg-slate-900 text-slate-300 border border-slate-700 rounded-xl text-xs font-mono font-bold">
                      NO OBJECT DETECTED
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Class Breakdown Table & Detections List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Detected Classes Table (Requirement 14) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Detected Classes Breakdown
              </h4>
              <div className="space-y-2 font-mono text-xs">
                {Object.entries(result.class_counts || {}).map(([cls, count]) => (
                  <div key={cls} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                    <span className="capitalize font-semibold text-slate-700">{cls}</span>
                    <span className={`font-extrabold px-2.5 py-0.5 rounded-full ${
                      count > 0 ? 'bg-blue-100 text-blue-700' : 'text-slate-400 bg-slate-100'
                    }`}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exact Detections Table */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Exact Detections ({result.detections.length})
              </h4>
              {result.detections.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {result.detections.map((d, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-mono flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{d.display_label}</div>
                        <div className="text-[10px] text-slate-500">Box: [{d.box.join(', ')}]</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-blue-600">{d.confidence}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{d.confidence_pct}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  No surveillance objects found exceeding {confidence} confidence threshold.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
