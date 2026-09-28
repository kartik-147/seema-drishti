import React, { useState } from 'react';
import { 
  X, Radio, Camera, Upload, Globe, Check, AlertCircle, CheckCircle2, Video 
} from 'lucide-react';

export default function ConnectCameraModal({
  isOpen,
  onClose,
  cameras,
  selectedCamera,
  onConnectWebcam,
  onConnectVideoFile,
  onConnectRtsp,
  onResetSimulated
}) {
  const [activeCamId, setActiveCamId] = useState(selectedCamera?.id || 'cam_1');
  const [sourceType, setSourceType] = useState('webcam'); // 'webcam' | 'file' | 'rtsp'
  const [rtspUrl, setRtspUrl] = useState('rtsp://admin:pass@192.168.1.104:554/ch1/main');
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const currentCam = cameras.find(c => c.id === activeCamId) || cameras[0];

  const handleStartWebcam = async () => {
    setIsConnecting(true);
    setStatusMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      onConnectWebcam(activeCamId, stream);
      setStatusMsg({ type: 'success', text: `Live webcam stream connected to ${currentCam.name}!` });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusMsg({
        type: 'error',
        text: 'Unable to access webcam. Please check browser camera permissions.'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    onConnectVideoFile(activeCamId, fileUrl, file.name);
    setStatusMsg({ type: 'success', text: `Video file "${file.name}" loaded into ${currentCam.name}!` });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleConnectRtsp = () => {
    if (!rtspUrl.trim()) return;
    onConnectRtsp(activeCamId, rtspUrl);
    setStatusMsg({ type: 'success', text: `RTSP stream endpoint bound to ${currentCam.name}!` });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleResetToSimulated = () => {
    onResetSimulated(activeCamId);
    setStatusMsg({ type: 'success', text: `Reset ${currentCam.name} to default surveillance dataset.` });
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Radio className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Connect Existing CCTV Camera
              </h2>
              <p className="text-xs text-slate-500">
                Plug in real physical cameras, upload original MP4 videos, or bind RTSP IP streams
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
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Target Channel Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select CCTV Screen to Assign:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {cameras.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCamId(c.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    activeCamId === c.id
                      ? 'bg-purple-50 border-purple-400 text-purple-900 ring-2 ring-purple-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate">{c.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{c.sourceType} feed</div>
                </button>
              ))}
            </div>
          </div>

          {/* Connection Mode Selection Tabs */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => setSourceType('webcam')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                sourceType === 'webcam'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span className="text-xs font-bold">Physical Webcam</span>
            </button>

            <button
              onClick={() => setSourceType('file')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                sourceType === 'file'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs font-bold">Upload Video</span>
            </button>

            <button
              onClick={() => setSourceType('rtsp')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                sourceType === 'rtsp'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold">RTSP / IP Camera</span>
            </button>
          </div>

          {/* Tab 1: Webcam */}
          {sourceType === 'webcam' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-600" />
                <span>Live USB or Integrated WebCam Stream</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your physical laptop camera or USB camera directly to <strong>{currentCam.name}</strong>. Real-time ByteTrack non-biometric detection overlays will immediately track anyone in front of the lens.
              </p>
              <button
                onClick={handleStartWebcam}
                disabled={isConnecting}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>{isConnecting ? 'Requesting Camera Access...' : `Connect Webcam to ${currentCam.name}`}</span>
              </button>
            </div>
          )}

          {/* Tab 2: Upload Video File */}
          {sourceType === 'file' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Original Surveillance Video File (.mp4, .webm)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload any original surveillance footage from your computer. The video will loop continuously inside <strong>{currentCam.name}</strong> with real-time detection bounding boxes.
              </p>
              <label className="w-full py-4 px-4 border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl bg-purple-50/50 hover:bg-purple-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-purple-600" />
                <span className="text-xs font-semibold text-purple-900">Click to Select MP4 / WebM Video</span>
                <span className="text-[10px] text-slate-500">Supports 720p, 1080p, 4K surveillance footage</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Tab 3: RTSP Stream */}
          {sourceType === 'rtsp' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <span>RTSP / ONVIF IP Border Camera Stream</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Directly connect to any ONVIF/RTSP compliant security camera (Hikvision, CP PLUS, Dahua, Axis).
              </p>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700">RTSP Stream URI:</label>
                <input
                  type="text"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  placeholder="rtsp://username:password@192.168.1.100:554/live"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleConnectRtsp}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4" />
                <span>Bind RTSP Stream to {currentCam.name}</span>
              </button>
            </div>
          )}

          {/* Status Message */}
          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Reset to Default */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Need to restore original demo feed?</span>
            <button
              onClick={handleResetToSimulated}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
            >
              Reset to Default Border Footage
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end bg-slate-50/70">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
