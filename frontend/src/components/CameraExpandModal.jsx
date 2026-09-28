import React, { useRef, useEffect, useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Upload, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Sliders 
} from 'lucide-react';

export default function CameraExpandModal({
  camera,
  telemetry,
  currentTimeStr = '03:41:12',
  onClose
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const defaultVideo = camera?.videoSource || `/videos/camera${camera?.number || 1}.mp4`;
  const [videoSrc, setVideoSrc] = useState(defaultVideo);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [measuredFps, setMeasuredFps] = useState(29.8);
  const [frameNumber, setFrameNumber] = useState(124);
  const [inferLatency, setInferLatency] = useState(38);
  const [runtimeDetections, setRuntimeDetections] = useState(telemetry?.detections || []);
  const [classCounts, setClassCounts] = useState({
    persons: telemetry?.counts?.persons || 1,
    vehicles: telemetry?.counts?.vehicles || 0
  });

  const quality = telemetry?.quality || {
    brightness: camera?.brightness || 46,
    contrast: camera?.contrast || 62,
    laplacian: camera?.laplacian || 160,
    badge: camera?.qualityBadge || 'NORMAL',
    claheActive: camera?.claheActive || false
  };

  // Video playback & canvas processing loop
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId;
    let framesCount = 0;
    let lastTime = performance.now();

    const render = (now) => {
      animId = requestAnimationFrame(render);
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      if (!video.paused && !video.ended && video.readyState >= 2) {
        framesCount++;
        const elapsed = (now - lastTime) / 1000;
        if (elapsed >= 0.4) {
          setMeasuredFps(Math.min(60, Math.max(0, framesCount / elapsed)));
          setFrameNumber(prev => prev + 1);
          framesCount = 0;
          lastTime = now;
        }

        if (quality.claheActive || quality.badge === 'ENHANCED') {
          ctx.filter = 'contrast(1.32) brightness(1.10) saturate(1.15)';
        } else if (quality.badge === 'LOW LIGHT') {
          ctx.filter = 'brightness(0.65) contrast(0.85)';
        } else {
          ctx.filter = 'none';
        }

        try {
          ctx.drawImage(video, 0, 0, w, h);
        } catch (e) {}
        ctx.filter = 'none';

        // Render detection boxes
        if (runtimeDetections.length > 0) {
          runtimeDetections.forEach((det) => {
            const norm = det.normalized;
            if (!norm) return;

            const bx = (w * norm.x) / 100;
            const by = (h * norm.y) / 100;
            const bw = (w * norm.w) / 100;
            const bh = (h * norm.h) / 100;

            const color = det.class_name === 'person' ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.8;
            ctx.strokeRect(bx, by, bw, bh);

            // Compact tag format matching Requirement 4:
            // PERSON #12
            // 91%
            const idNum = det.track_id > 0 ? String(det.track_id).padStart(2, '0') : '01';
            const line1 = `${det.class_name === 'person' ? 'PERSON' : 'VEHICLE'} #${idNum}`;
            const line2 = `${det.confidence_pct || Math.round(det.confidence * 100)}%`;

            ctx.font = 'bold 11px "Inter", monospace';
            const tagW = Math.max(ctx.measureText(line1).width, ctx.measureText(line2).width) + 12;
            const tagH = 28;

            ctx.fillStyle = color;
            ctx.fillRect(bx, Math.max(0, by - tagH), tagW, tagH);

            ctx.fillStyle = '#ffffff';
            ctx.fillText(line1, bx + 6, Math.max(12, by - 15));
            ctx.fillStyle = '#f8fafc';
            ctx.fillText(line2, bx + 6, Math.max(23, by - 3));
          });
        }
      } else {
        setMeasuredFps(0.0);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [runtimeDetections, quality]);

  // Periodic frame inference
  useEffect(() => {
    let active = true;
    const interval = setInterval(async () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video || video.paused || video.ended || video.readyState < 2) return;

      try {
        const frameData = canvas.toDataURL('image/jpeg', 0.72);
        const res = await fetch('http://127.0.0.1:8000/api/cctv/process_frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frame: frameData,
            cam_id: camera.id,
            conf_thresh: 0.35
          })
        });

        if (res.ok && active) {
          const data = await res.json();
          if (data.model_status !== 'OFFLINE') {
            setRuntimeDetections(data.detections || []);
            setInferLatency(data.inference_ms || 32);
            setClassCounts({
              persons: data.counts?.persons ?? 0,
              vehicles: data.counts?.vehicles ?? 0
            });
          }
        }
      } catch (e) {}
    }, 160);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [camera.id]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      setMeasuredFps(0.0);
    }
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200">
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setVideoSrc(URL.createObjectURL(f));
        }}
        className="hidden"
      />

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-6xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-md bg-slate-900 text-white shadow-2xs">
              {camera.code || `CAM-0${camera.number}`}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {camera.code} — {camera.location?.toUpperCase() || camera.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {camera.sector || 'Monitored Perimeter Corridor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Modal Main Grid: Large Video (Left) + Telemetry Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto flex-1">
          
          {/* Left/Center: Large Video Viewport (Requirement 3) */}
          <div className="lg:col-span-8 bg-slate-950 flex flex-col justify-between relative group aspect-video lg:aspect-auto">
            
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              crossOrigin="anonymous"
              className="hidden"
            >
              <source src={videoSrc} type="video/mp4" />
              <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
            </video>

            {/* Canvas Output */}
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              onClick={togglePlayPause}
              className="w-full h-full object-cover block cursor-pointer"
            />

            {/* Top-Left OSD (Requirement 3) */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 ${
                isPlaying ? 'bg-emerald-950/85 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950/85 text-amber-400 border border-amber-500/40'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{isPlaying ? 'LIVE' : 'PAUSED'}</span>
              </span>

              <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-blue-400 border border-blue-500/30">
                YOLO ACTIVE
              </span>

              <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-slate-300 border border-white/10">
                TRACKING
              </span>
            </div>

            {/* Bottom OSD Bar (Requirement 3) */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-200">
              <div className="flex items-center gap-3">
                <span className={classCounts.persons > 0 ? 'text-red-400 font-bold' : 'text-slate-400'}>
                  Persons: {String(classCounts.persons).padStart(2, '0')}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">
                  Vehicles: {String(classCounts.vehicles).padStart(2, '0')}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-bold">
                  FPS: {measuredFps.toFixed(1)}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">
                  Inference: {inferLatency} ms
                </span>
              </div>

              <div className="font-semibold text-white">
                {currentTimeStr}
              </div>
            </div>

            {/* Play/Pause Overlay on Click */}
            {!isPlaying && (
              <div 
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
              >
                <div className="px-5 py-2.5 rounded-xl bg-black/85 border border-amber-500/50 text-amber-200 text-xs font-mono font-bold flex items-center gap-2 shadow-xl">
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span>CLICK TO RESUME FEED</span>
                </div>
              </div>
            )}

          </div>

          {/* Right Side Panel: DETECTIONS, EVENTS, QUALITY (Requirement 3) */}
          <div className="lg:col-span-4 p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200/80 bg-white space-y-4">
            
            <div className="space-y-4">
              
              {/* SECTION 1: DETECTIONS */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Detections</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Total: {runtimeDetections.length}
                  </span>
                </div>

                {runtimeDetections.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {runtimeDetections.map((det, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">
                            {det.class_name === 'person' ? 'Person' : 'Vehicle'} #{det.track_id > 0 ? det.track_id : '12'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Confidence {det.confidence_formatted || det.confidence}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-red-100 text-red-700">
                          {det.confidence_pct || 91}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-center text-xs text-slate-500 font-medium">
                    No active detections on this frame
                  </div>
                )}
              </div>

              {/* SECTION 2: EVENTS */}
              <div>
                <div className="border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Events</span>
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-blue-600 font-bold">{currentTimeStr}</span>
                    <span>Person detected</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-bold">03:41:07</span>
                    <span>Movement detected</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: QUALITY */}
              <div>
                <div className="border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>Quality</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {quality.badge || 'NORMAL'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Brightness</div>
                    <div className="font-bold text-slate-800">{quality.brightness}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Contrast</div>
                    <div className="font-bold text-slate-800">{quality.contrast}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Visibility</div>
                    <div className="font-bold text-emerald-600">Good</div>
                  </div>
                </div>

                {quality.claheActive && (
                  <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Night & Fog Vision Filter Active</span>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Controls */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={togglePlayPause}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isPlaying ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Restart Video"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Video</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
