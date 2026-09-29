import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2, AlertTriangle, XCircle, Eye,
  ChevronDown, ArrowRight, Sparkles, Activity,
  ShieldCheck, Sliders, ExternalLink, X, Monitor,
  Play, Pause, RotateCcw, Video, Download, Check, Shield
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA HEALTH DATA
// ─────────────────────────────────────────────────────────────────────────────
const CAMERA_HEALTH_DATA = [
  {
    id: 'cam_1', code: 'CAM-01', name: 'North Border', sector: 'Sector Alpha',
    status: 'HEALTHY', bgImage: '/cctv/cam1.jpg',
    visibility: 'CLEAR', brightnessRaw: 118, brightnessMax: 255, contrastRaw: 46.2,
    signal: 'GOOD', fps: 59, updatedSecsAgo: 2, claheActive: false,
    issue: null, systemResponse: null, systemResponseDetail: null,
    currentDetection: null, relatedSituation: null,
    techDetails: { resolution: '1920 × 1080', fps: '59.9', brightnessScore: '118/255 (46%)', contrastScore: 'Normal', enhancement: 'None', processing: 'OpenCV', model: 'YOLOv8n' }
  },
  {
    id: 'cam_2', code: 'CAM-02', name: 'Check Post', sector: 'Sector Bravo',
    status: 'HEALTHY', bgImage: '/cctv/cam2.jpg',
    visibility: 'CLEAR', brightnessRaw: 104, brightnessMax: 255, contrastRaw: 38.5,
    signal: 'GOOD', fps: 59, updatedSecsAgo: 2, claheActive: false,
    issue: null, systemResponse: null, systemResponseDetail: null,
    currentDetection: null, relatedSituation: null,
    techDetails: { resolution: '1920 × 1080', fps: '59.9', brightnessScore: '104/255 (41%)', contrastScore: 'Normal', enhancement: 'None', processing: 'OpenCV', model: 'YOLOv8n' }
  },
  {
    id: 'cam_3', code: 'CAM-03', name: 'River Side', sector: 'Sector Charlie',
    status: 'NEEDS_ATTENTION', bgImage: '/cctv/cam3.jpg',
    visibility: 'LOW', brightnessRaw: 62, brightnessMax: 255, contrastRaw: 21.4,
    signal: 'GOOD', fps: 59, updatedSecsAgo: 1, claheActive: true,
    issue: 'Low visibility detected due to river mist and reduced ambient light.',
    systemResponse: 'Image enhancement active (CLAHE)',
    systemResponseDetail: 'The system enhanced the camera image before running detection. Contrast and brightness were boosted automatically to improve visibility for processing.',
    currentDetection: { label: 'Related Movement', confidence: 88 },
    relatedSituation: 'SITUATION #024',
    techDetails: { resolution: '1920 × 1080', fps: '59.9', brightnessScore: '62/255 (24%)', contrastScore: 'Low', enhancement: 'CLAHE (ClipLimit 2.0)', processing: 'OpenCV', model: 'YOLOv8n' }
  },
  {
    id: 'cam_4', code: 'CAM-04', name: 'Perimeter Ridge', sector: 'Sector Delta',
    status: 'HEALTHY', bgImage: '/cctv/cam4.jpg',
    visibility: 'CLEAR', brightnessRaw: 112, brightnessMax: 255, contrastRaw: 42.1,
    signal: 'GOOD', fps: 59, updatedSecsAgo: 3, claheActive: false,
    issue: null, systemResponse: null, systemResponseDetail: null,
    currentDetection: null, relatedSituation: null,
    techDetails: { resolution: '1920 × 1080', fps: '59.9', brightnessScore: '112/255 (44%)', contrastScore: 'Normal', enhancement: 'None', processing: 'OpenCV', model: 'YOLOv8n' }
  },
  {
    id: 'cam_5', code: 'CAM-05', name: 'Eastern Fence', sector: 'Sector Echo',
    status: 'HEALTHY', bgImage: '/cctv/cam5.jpg',
    visibility: 'CLEAR', brightnessRaw: 126, brightnessMax: 255, contrastRaw: 48.0,
    signal: 'GOOD', fps: 59, updatedSecsAgo: 2, claheActive: false,
    issue: null, systemResponse: null, systemResponseDetail: null,
    currentDetection: null, relatedSituation: null,
    techDetails: { resolution: '1920 × 1080', fps: '59.9', brightnessScore: '126/255 (49%)', contrastScore: 'Normal', enhancement: 'None', processing: 'OpenCV', model: 'YOLOv8n' }
  },
  {
    id: 'cam_6', code: 'CAM-06', name: 'Sector Gate', sector: 'Sector Foxtrot',
    status: 'POOR_VISIBILITY', bgImage: '/cctv/cam6.jpg',
    visibility: 'VERY LOW', brightnessRaw: 48, brightnessMax: 255, contrastRaw: 18.2,
    signal: 'GOOD', fps: 59, updatedSecsAgo: 4, claheActive: true,
    issue: 'Very low light at night checkpoint. Image enhancement applied.',
    systemResponse: 'Image enhancement active (CLAHE)',
    systemResponseDetail: 'Night-time low-light conditions detected. CLAHE enhancement applied to improve visibility for AI processing.',
    currentDetection: null, relatedSituation: null,
    techDetails: { resolution: '1920 × 1080', fps: '59.9', brightnessScore: '48/255 (19%)', contrastScore: 'Very Low', enhancement: 'CLAHE (ClipLimit 2.0)', processing: 'OpenCV', model: 'YOLOv8n' }
  }
];

const STATUS_CONFIG = {
  HEALTHY: {
    label: 'HEALTHY', description: 'Camera is clear and operating normally.',
    dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50',
    border: 'border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-600'
  },
  NEEDS_ATTENTION: {
    label: 'NEEDS ATTENTION', description: 'Camera is operating but visual quality is reduced.',
    dot: 'bg-amber-500 animate-pulse', text: 'text-amber-700', bg: 'bg-amber-50',
    border: 'border-amber-300', icon: AlertTriangle, iconColor: 'text-amber-600'
  },
  POOR_VISIBILITY: {
    label: 'POOR VISIBILITY', description: 'Fog, darkness, blur or similar conditions detected.',
    dot: 'bg-red-500 animate-pulse', text: 'text-red-700', bg: 'bg-red-50',
    border: 'border-red-300', icon: XCircle, iconColor: 'text-red-600'
  },
  OFFLINE: {
    label: 'OFFLINE', description: 'No camera feed available.',
    dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100',
    border: 'border-slate-300', icon: XCircle, iconColor: 'text-slate-500'
  }
};

function BrightnessBar({ value, max = 255 }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 40 ? 'bg-emerald-500' : pct >= 25 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function CameraCard({ cam, isSelected, onSelect }) {
  const cfg = STATUS_CONFIG[cam.status] || STATUS_CONFIG.HEALTHY;
  const Icon = cfg.icon;
  const brightnessPercent = Math.round((cam.brightnessRaw / cam.brightnessMax) * 100);
  const isProblematic = cam.status === 'NEEDS_ATTENTION' || cam.status === 'POOR_VISIBILITY';

  return (
    <div
      onClick={() => onSelect(cam)}
      className={`bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] overflow-hidden ${
        isSelected ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' :
        isProblematic ? cfg.border : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="relative h-36 bg-slate-900 overflow-hidden">
        <img src={cam.bgImage} alt={cam.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-black/75 text-white flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
          {cam.code}
        </div>
        {cam.claheActive && (
          <div className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/90 text-white flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> ENHANCED
          </div>
        )}
        <div className={`absolute bottom-2 left-2 text-[9.5px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
          {cfg.label}
        </div>
      </div>

      <div className="p-3.5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{cam.code}</div>
            <div className="text-sm font-extrabold text-slate-900 leading-tight">{cam.name}</div>
            <div className="text-[10px] text-slate-400 font-medium">{cam.sector}</div>
          </div>
          <Icon className={`w-4 h-4 ${cfg.iconColor} shrink-0 mt-0.5`} />
        </div>

        {cam.issue && (
          <div className={`p-2 rounded-xl border text-[11px] font-medium leading-snug ${cfg.bg} ${cfg.border} ${cfg.text}`}>
            <span className="font-bold">Issue: </span>{cam.issue}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-[10.5px]">
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Visibility</span>
            <div className={`font-bold ${cam.visibility === 'CLEAR' ? 'text-emerald-700' : cam.visibility === 'LOW' ? 'text-amber-700' : 'text-red-700'}`}>
              {cam.visibility}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Signal</span>
            <div className="font-bold text-emerald-700">{cam.signal}</div>
          </div>
          <div className="space-y-1 col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Brightness</span>
              <span className={`font-bold text-[10.5px] ${brightnessPercent >= 40 ? 'text-emerald-700' : brightnessPercent >= 25 ? 'text-amber-700' : 'text-red-700'}`}>
                {brightnessPercent}%
              </span>
            </div>
            <BrightnessBar value={cam.brightnessRaw} max={cam.brightnessMax} />
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">FPS</span>
            <div className="font-bold text-slate-800">{cam.fps}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Updated</span>
            <div className="font-bold text-slate-800">{cam.updatedSecsAgo}s ago</div>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onSelect(cam); }}
          className={`w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border flex items-center justify-center gap-1.5 ${
            isProblematic
              ? `${cfg.bg} ${cfg.border} ${cfg.text} hover:opacity-90`
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isProblematic ? 'VIEW DETAILS & RESPONSE' : 'VIEW CAMERA'}</span>
        </button>
      </div>
    </div>
  );
}

function DetailDrawer({ cam, onClose, onViewCamera, onNavigateToAlerts }) {
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [showTech, setShowTech] = useState(false);
  if (!cam) return null;

  const cfg = STATUS_CONFIG[cam.status] || STATUS_CONFIG.HEALTHY;
  const brightnessPercent = Math.round((cam.brightnessRaw / cam.brightnessMax) * 100);
  const isProblematic = cam.status === 'NEEDS_ATTENTION' || cam.status === 'POOR_VISIBILITY';

  const metrics = [
    { label: 'Brightness', value: `${brightnessPercent}%`, isBar: true, raw: cam.brightnessRaw },
    { label: 'Contrast', value: cam.contrastRaw < 25 ? 'Low' : cam.contrastRaw < 35 ? 'Moderate' : 'Normal' },
    { label: 'Visibility', value: cam.visibility },
    { label: 'Motion Blur', value: cam.contrastRaw < 25 ? 'Moderate' : 'Low' },
    { label: 'Signal', value: cam.signal },
    { label: 'FPS', value: String(cam.fps) },
  ];

  const getMetricColor = (label, value) => {
    if (label === 'Signal' || value === 'CLEAR' || value === 'Normal' || (label === 'Motion Blur' && value === 'Low')) return 'text-emerald-700';
    if (value === 'LOW' || value === 'Moderate' || value === 'Low') return 'text-amber-700';
    if (value === 'VERY LOW' || value === 'OFFLINE') return 'text-red-700';
    return 'text-slate-800';
  };

  return (
    <div className="w-80 shrink-0 bg-white rounded-3xl border border-slate-200/90 shadow-sm h-fit sticky top-4 overflow-hidden animate-in slide-in-from-right-4 duration-200">
      <div className={`p-4 border-b ${isProblematic ? cfg.bg : 'bg-slate-50'} flex items-center justify-between`}>
        <div>
          <div className={`text-[10px] font-mono font-bold uppercase tracking-widest ${cfg.text}`}>{cam.code}</div>
          <div className="text-base font-extrabold text-slate-900">{cam.name}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
            <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">

        {/* Preview */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">LIVE PREVIEW</div>
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video">
            <img src={cam.bgImage} alt={cam.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 py-2 flex items-center justify-between text-[9.5px] font-mono text-white">
              <span className="font-bold">{cam.code}</span>
              {cam.claheActive && <span className="bg-amber-500/90 px-1.5 py-0.5 rounded font-bold">ENHANCED</span>}
            </div>
          </div>

          {isProblematic && cam.claheActive && (
            <>
              <div className="mt-2 flex gap-1.5">
                <button onClick={() => setShowEnhanced(false)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border ${!showEnhanced ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                  Original
                </button>
                <button onClick={() => setShowEnhanced(true)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border flex items-center justify-center gap-1 ${showEnhanced ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                  <Sparkles className="w-2.5 h-2.5" /> Enhanced
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-center font-medium">"Visibility improved for processing"</p>
            </>
          )}
        </div>

        {/* Image Quality */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">IMAGE QUALITY</div>
          <div className="space-y-2.5">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{m.label}</span>
                <div className="text-right">
                  <span className={`font-bold ${getMetricColor(m.label, m.value)}`}>{m.value}</span>
                  {m.isBar && <div className="w-20 mt-0.5"><BrightnessBar value={m.raw} max={255} /></div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Response */}
        {isProblematic && cam.systemResponse && (
          <div className={`p-3 rounded-2xl border ${cfg.bg} ${cfg.border} space-y-2`}>
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">SYSTEM RESPONSE</div>
            </div>
            <div className={`text-sm font-bold ${cfg.text}`}>{cam.systemResponse}</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{cam.systemResponseDetail}</p>
          </div>
        )}

        {/* Current Detection */}
        {cam.currentDetection && (
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">CURRENT DETECTION</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900">{cam.currentDetection.label}</span>
              <span className="text-sm font-bold text-blue-700">{cam.currentDetection.confidence}% confidence</span>
            </div>
            <div className={`p-2 rounded-xl border text-[11px] leading-relaxed ${cfg.bg} ${cfg.border} ${cfg.text}`}>
              <span className="font-bold">Camera condition: </span>
              Low visibility — detection confidence may be affected by current camera conditions.
            </div>
          </div>
        )}

        {/* Related Situation */}
        {cam.relatedSituation && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-red-600">LINKED INCIDENT</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm font-extrabold text-slate-900">{cam.relatedSituation}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              This camera is part of the active cross-camera situation. Low visibility here may affect detection reliability.
            </p>
            <button
              onClick={onNavigateToAlerts}
              className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" /> VIEW RELATED EVENT
            </button>
          </div>
        )}

        {/* Technical Details */}
        <button
          onClick={() => setShowTech(p => !p)}
          className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-blue-700 transition-colors cursor-pointer py-1 border-t border-slate-100"
        >
          <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5" /> TECHNICAL DETAILS</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTech ? 'rotate-180' : ''}`} />
        </button>
        {showTech && (
          <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 text-[10.5px] font-mono space-y-1.5 animate-in fade-in duration-150">
            <div className="text-emerald-400 font-bold text-[9.5px] uppercase tracking-wider pb-0.5 border-b border-slate-800">{cam.code} — System Telemetry</div>
            {Object.entries(cam.techDetails).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-slate-400 capitalize shrink-0">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-right">{v}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => onViewCamera(cam)}
          className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5" /> VIEW CAMERA FEED
        </button>
      </div>
    </div>
  );
}

export default function CameraHealthModule({
  cameras = [],
  onSelectCamera,
  onNavigateToAlerts,
  onNavigateToNetwork,
  onNavigateToLive,
  onUpdateCameraEnhancement,
  currentTimeStr = '20:30:00'
}) {
  const [selectedCam, setSelectedCam] = useState(null);

  // Video Enhancement Studio State for Existing CCTV Videos
  const [selectedEnhanceCamId, setSelectedEnhanceCamId] = useState('cam_3');
  const [contrastBoost, setContrastBoost] = useState(1.65);
  const [brightnessBoost, setBrightnessBoost] = useState(1.35);
  const [dehazeStrength, setDehazeStrength] = useState(80);
  const [sharpnessBoost, setSharpnessBoost] = useState(65);
  const [saturationBoost, setSaturationBoost] = useState(1.2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'enhanced' | 'original'
  const [enhancementApplied, setEnhancementApplied] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('NIGHT_MIST');
  
  const rawVideoRef = useRef(null);
  const enhancedVideoRef = useRef(null);

  const ENHANCE_CAMERAS = [
    {
      id: 'cam_1',
      code: 'CAM-01',
      name: 'North Border',
      sector: 'Sector Alpha',
      location: 'Outer Fence Line',
      videoUrl: '/videos/camera1.mp4',
      poster: '/cctv/cam1.jpg',
      originalIssue: 'Direct sunlight glare & slight lens dust',
      ambientLux: '46%',
      targetClass: 'Person (Boundary)',
      rawConf: 72,
      enhancedConf: 94
    },
    {
      id: 'cam_2',
      code: 'CAM-02',
      name: 'Check Post',
      sector: 'Sector Bravo',
      location: 'Main Security Gate',
      videoUrl: '/videos/camera2.mp4',
      poster: '/cctv/cam2.jpg',
      originalIssue: 'Overcast cloud cover & motion blur',
      ambientLux: '41%',
      targetClass: 'Friendly Patrol Sentry',
      rawConf: 65,
      enhancedConf: 96
    },
    {
      id: 'cam_3',
      code: 'CAM-03',
      name: 'River Side',
      sector: 'Sector Charlie',
      location: 'Restricted Waterline Buffer',
      videoUrl: '/videos/camera3.mp4',
      poster: '/cctv/cam3.jpg',
      originalIssue: 'Severe low-light night conditions & river mist/fog',
      ambientLux: '24%',
      targetClass: 'Person P-12 Traversal',
      rawConf: 41,
      enhancedConf: 88,
      recommended: true
    },
    {
      id: 'cam_4',
      code: 'CAM-04',
      name: 'Perimeter Ridge',
      sector: 'Sector Delta',
      location: 'Hilltop Sentry Observation',
      videoUrl: '/videos/camera4.mp4',
      poster: '/cctv/cam4.jpg',
      originalIssue: 'Twilight shadows along valley terrain',
      ambientLux: '44%',
      targetClass: 'Perimeter Ridge Line',
      rawConf: 68,
      enhancedConf: 91
    },
    {
      id: 'cam_5',
      code: 'CAM-05',
      name: 'Eastern Fence',
      sector: 'Sector Echo',
      location: 'Boundary Highway Road',
      videoUrl: '/videos/camera5.mp4',
      poster: '/cctv/cam5.jpg',
      originalIssue: 'Vehicle road glare & long focal distance',
      ambientLux: '52%',
      targetClass: 'Patrol Vehicle V-04',
      rawConf: 62,
      enhancedConf: 89
    },
    {
      id: 'cam_6',
      code: 'CAM-06',
      name: 'Sector Gate',
      sector: 'Sector Foxtrot',
      location: 'BOP Checkpoint Barrier',
      videoUrl: '/videos/camera6.mp4',
      poster: '/cctv/cam6.jpg',
      originalIssue: 'Sodium vapor night light color cast',
      ambientLux: '38%',
      targetClass: 'Gate Corridor',
      rawConf: 70,
      enhancedConf: 93
    }
  ];

  const currentEnhanceCam = ENHANCE_CAMERAS.find(c => c.id === selectedEnhanceCamId) || ENHANCE_CAMERAS[2];

  const applyPreset = (presetKey) => {
    setSelectedPreset(presetKey);
    if (presetKey === 'NIGHT_MIST') {
      setContrastBoost(1.65);
      setBrightnessBoost(1.35);
      setDehazeStrength(80);
      setSharpnessBoost(65);
      setSaturationBoost(1.2);
    } else if (presetKey === 'HEAVY_FOG') {
      setContrastBoost(1.85);
      setBrightnessBoost(1.15);
      setDehazeStrength(95);
      setSharpnessBoost(75);
      setSaturationBoost(1.1);
    } else if (presetKey === 'RAIN_GLARE') {
      setContrastBoost(1.35);
      setBrightnessBoost(1.05);
      setDehazeStrength(60);
      setSharpnessBoost(50);
      setSaturationBoost(1.0);
    } else if (presetKey === 'MAX_CLARITY') {
      setContrastBoost(2.1);
      setBrightnessBoost(1.4);
      setDehazeStrength(90);
      setSharpnessBoost(85);
      setSaturationBoost(1.3);
    } else if (presetKey === 'RAW_RESET') {
      setContrastBoost(1.0);
      setBrightnessBoost(1.0);
      setDehazeStrength(0);
      setSharpnessBoost(0);
      setSaturationBoost(1.0);
    }
  };

  const handleApplyToLive = () => {
    if (onUpdateCameraEnhancement) {
      onUpdateCameraEnhancement(selectedEnhanceCamId, {
        claheActive: contrastBoost > 1.05 || dehazeStrength > 10,
        contrastBoost,
        brightnessBoost,
        dehazeStrength
      });
    }
    setEnhancementApplied(true);
    setTimeout(() => setEnhancementApplied(false), 3000);
  };

  const togglePlay = () => {
    if (rawVideoRef.current && enhancedVideoRef.current) {
      if (isPlaying) {
        rawVideoRef.current.pause();
        enhancedVideoRef.current.pause();
      } else {
        rawVideoRef.current.play();
        enhancedVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const healthData = CAMERA_HEALTH_DATA.map(hd => {
    const live = cameras.find(c => c.id === hd.id);
    if (!live) return hd;
    return { ...hd, brightnessRaw: live.brightness ?? hd.brightnessRaw, contrastRaw: live.contrast ?? hd.contrastRaw, claheActive: live.claheActive ?? hd.claheActive };
  });

  const counts = {
    online: healthData.filter(c => c.status !== 'OFFLINE').length,
    clear: healthData.filter(c => c.status === 'HEALTHY').length,
    attention: healthData.filter(c => c.status === 'NEEDS_ATTENTION').length,
    poor: healthData.filter(c => c.status === 'POOR_VISIBILITY').length,
  };

  const SUMMARY_CARDS = [
    { label: 'Cameras Online', value: counts.online, color: 'text-slate-900', bg: 'bg-white', border: 'border-slate-200', dot: 'bg-slate-500' },
    { label: 'Clear View', value: counts.clear, color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    { label: 'Needs Attention', value: counts.attention, color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-300', dot: 'bg-amber-500' },
    { label: 'Poor Visibility', value: counts.poor, color: 'text-red-800', bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500' },
  ];

  return (
    <div className="space-y-5 pb-8">

      {/* PAGE HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-500/30 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">CAMERA HEALTH</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium ml-11">
              Check whether each camera is providing clear and reliable visual information.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> LIVE SYSTEM
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold">● MODEL ACTIVE</div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold">YOLOv8 · CPU</div>
          </div>
        </div>
      </div>

      {/* PRIMARY QUESTION */}
      <div className="bg-white rounded-3xl border border-blue-200/80 p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-slate-900">Can we trust what the cameras are showing?</h2>
            <p className="text-sm text-slate-500 font-medium">
              Cameras with poor visibility may affect detection reliability. The system checks image quality before relying on the detection.
            </p>
          </div>
          <div className={`shrink-0 px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 ${
            counts.attention + counts.poor > 0 ? 'bg-amber-50 text-amber-800 border border-amber-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${counts.attention + counts.poor > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            {counts.attention + counts.poor > 0 ? `${counts.attention + counts.poor} Camera(s) Need Attention` : 'All Cameras Clear'}
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SUMMARY_CARDS.map((sc) => (
          <div key={sc.label} className={`rounded-2xl border ${sc.bg} ${sc.border} p-4 text-center`}>
            <div className={`text-3xl font-extrabold ${sc.color} font-mono`}>{sc.value}</div>
            <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${sc.color} opacity-80`}>{sc.label}</div>
            <div className="flex justify-center mt-1.5">
              <span className={`w-2 h-2 rounded-full ${sc.dot}`}></span>
            </div>
          </div>
        ))}
      </div>

      {/* CAMERA GRID + DRAWER */}
      <div className="flex gap-5 items-start">
        <div className="flex-1 space-y-4 min-w-0">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-0.5">Live Camera Health</h2>
            <p className="text-xs text-slate-500 font-medium">Camera condition can affect detection reliability. Click any camera to see details.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {healthData.map((cam) => (
              <CameraCard
                key={cam.id}
                cam={cam}
                isSelected={selectedCam?.id === cam.id}
                onSelect={(c) => setSelectedCam(prev => prev?.id === c.id ? null : c)}
              />
            ))}
          </div>
        </div>

        {selectedCam && (
          <DetailDrawer
            cam={selectedCam}
            onClose={() => setSelectedCam(null)}
            onViewCamera={(cam) => {
              const cameraObj = cameras.find(c => c.id === cam.id);
              if (cameraObj && onSelectCamera) onSelectCamera(cameraObj);
            }}
            onNavigateToAlerts={onNavigateToAlerts}
          />
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          CCTV VIDEO ENHANCEMENT & QUALITY RESTORATION STUDIO
          (Interactive CCTV Video Restorer for Existing Border Cameras)
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-6">
        
        {/* Studio Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10.5px] font-bold font-mono tracking-wider">
                OPENCV CLAHE &bull; REAL-TIME VISION RESTORATION
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold font-mono">
                GPU ACCELERATED
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>CCTV Video Enhancement & Quality Restoration Studio</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select any existing border camera to preview real-time CLAHE contrast boosting, low-light night enhancement, and river fog dehazing.
            </p>
          </div>

          {/* Quick Telemetry Boost Indicators */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto font-mono text-xs">
            <div className="p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase">Confidence Boost:</span>
              <strong className="text-emerald-700 font-bold">
                {currentEnhanceCam.rawConf}% &rarr; {currentEnhanceCam.enhancedConf}% (+{currentEnhanceCam.enhancedConf - currentEnhanceCam.rawConf}%)
              </strong>
            </div>
            <div className="p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase">Dynamic Range:</span>
              <strong className="text-blue-700 font-bold">+{(contrastBoost * 32).toFixed(0)}% Boosted</strong>
            </div>
          </div>
        </div>

        {/* Camera Selector Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Existing CCTV Video to Enhance:</span>
            </span>
            <span className="text-slate-500 text-[11px]">
              Active: <strong>{currentEnhanceCam.name} ({currentEnhanceCam.code})</strong> &bull; {currentEnhanceCam.sector}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {ENHANCE_CAMERAS.map((c) => {
              const isSelected = selectedEnhanceCamId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedEnhanceCamId(c.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {c.recommended && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-amber-500 text-white text-[8.5px] font-bold font-mono">
                      DEMO
                    </span>
                  )}
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">{c.code}</div>
                  <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{c.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{c.sector}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[9.5px] font-mono">
                    <span className={c.id === 'cam_3' ? 'text-amber-600 font-bold' : 'text-slate-500'}>
                      Lux: {c.ambientLux}
                    </span>
                    <span className="text-emerald-700 font-bold">CLAHE</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Player Display: Side-by-Side Comparison */}
        <div className="space-y-3">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'PAUSE VIDEO' : 'PLAY VIDEO'}</span>
              </button>
              
              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYNCED FEED ({currentEnhanceCam.code} &bull; 59.9 FPS)</span>
              </div>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'side-by-side' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Side-by-Side (Compare)
              </button>
              <button
                onClick={() => setViewMode('enhanced')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'enhanced' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Enhanced Only
              </button>
              <button
                onClick={() => setViewMode('original')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'original' ? 'bg-slate-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Raw Original
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          <div className={`grid gap-4 ${
            viewMode === 'side-by-side' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            
            {/* 1. ORIGINAL RAW VIDEO */}
            {(viewMode === 'side-by-side' || viewMode === 'original') && (
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-300 shadow-md aspect-16/10 group">
                <video
                  ref={rawVideoRef}
                  key={`raw-${currentEnhanceCam.id}`}
                  src={currentEnhanceCam.videoUrl}
                  poster={currentEnhanceCam.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Header Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold border border-white/20">
                      RAW UNPROCESSED FEED
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-red-900/80 text-red-200 text-[10px] font-mono border border-red-500/30">
                      LOW DYNAMIC RANGE
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-black/80 text-amber-300 text-[10px] font-mono font-bold">
                    LUX {currentEnhanceCam.ambientLux}
                  </span>
                </div>

                {/* Subtitle / Issue Warning */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl bg-black/85 backdrop-blur-xs text-white text-[11px] flex items-center justify-between border border-white/10 pointer-events-none">
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">ORIGINAL TELEMETRY:</span>
                    <span className="text-slate-200 font-semibold">{currentEnhanceCam.originalIssue}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-slate-400 block text-[9.5px]">RAW CONFIDENCE:</span>
                    <strong className="text-amber-400">{currentEnhanceCam.rawConf}%</strong>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ENHANCED RESTORED VIDEO */}
            {(viewMode === 'side-by-side' || viewMode === 'enhanced') && (
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md aspect-16/10 group">
                <video
                  ref={enhancedVideoRef}
                  key={`enhanced-${currentEnhanceCam.id}`}
                  src={currentEnhanceCam.videoUrl}
                  poster={currentEnhanceCam.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    filter: `contrast(${contrastBoost}) brightness(${brightnessBoost}) saturate(${saturationBoost})`,
                  }}
                  className="w-full h-full object-cover transition-all duration-150"
                />

                {/* Simulated Target Detection Box on Enhanced Stream */}
                <div className="absolute inset-x-[30%] inset-y-[22%] w-[26%] h-[58%] border-2 border-emerald-400 rounded-sm pointer-events-none shadow-sm animate-pulse">
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] font-bold font-mono whitespace-nowrap shadow-xs">
                    {currentEnhanceCam.targetClass}: {currentEnhanceCam.enhancedConf}%
                  </div>
                </div>

                {/* Header Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-mono font-bold shadow-xs">
                      AI ENHANCED STREAM (CLAHE)
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-blue-600/90 text-white text-[10px] font-mono">
                      DEHAZING ACTIVE
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-950/90 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                    RESTORED LUX 82%
                  </span>
                </div>

                {/* Enhanced Bottom Metrics */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl bg-slate-900/90 backdrop-blur-xs text-white text-[11px] flex items-center justify-between border border-emerald-500/30 pointer-events-none">
                  <div>
                    <span className="text-emerald-400 block text-[9.5px] font-bold">OPENCV CLAHE RESTORATION:</span>
                    <span className="text-slate-200 font-semibold">Contrast & Dynamic Range Expanded</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 block text-[9.5px] font-bold">AI CONFIDENCE:</span>
                    <strong className="text-emerald-400 text-xs">{currentEnhanceCam.enhancedConf}% (&uarr;+{currentEnhanceCam.enhancedConf - currentEnhanceCam.rawConf}%)</strong>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Enhancement Presets & Sliders Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          
          {/* Left Column (5 cols): 1-Click Presets */}
          <div className="lg:col-span-5 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>1-Click Enhancement Presets</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Optimized mathematical profiles for rapid border camera restoration
              </p>
            </div>

            <div className="space-y-2">
              {[
                { key: 'NIGHT_MIST', label: 'Night Vision & River Mist Restoration', desc: 'Boosts dark ambient shadows and cuts low-light haze (CLAHE 1.65x)' },
                { key: 'HEAVY_FOG', label: 'Dense Fog & Atmospheric Dehaze', desc: 'Deep penetration filter for winter river fog (CLAHE 1.85x, 95% Dehaze)' },
                { key: 'RAIN_GLARE', label: 'Rain Glaze & Specular Glare Reduction', desc: 'Balances high specular reflections from wet boundary roads' },
                { key: 'MAX_CLARITY', label: 'Maximum AI Clarifier', desc: 'Full dynamic range expansion for difficult distance angles' },
                { key: 'RAW_RESET', label: 'Reset to Raw CCTV Feed', desc: 'Neutral settings (1.0x contrast, 1.0x brightness, 0% dehaze)' }
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p.key)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPreset === p.key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs">{p.label}</div>
                  <div className={`text-[10px] mt-0.5 leading-tight ${selectedPreset === p.key ? 'text-blue-100' : 'text-slate-500'}`}>
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column (7 cols): Fine-Tuning Sliders & Live Stream Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fine-Tuning Video Restorer Sliders</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Adjust video parameters in real time. Changes take effect on the video immediately.
              </p>
            </div>

            {/* 4 Interactive Sliders */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
              {/* Contrast / CLAHE */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Contrast Boost (CLAHE Clip Limit):</span>
                  <span className="font-mono font-bold text-blue-700">{contrastBoost.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.05"
                  value={contrastBoost}
                  onChange={(e) => {
                    setContrastBoost(parseFloat(e.target.value));
                    setSelectedPreset(null);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Night Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Night Vision & Brightness Boost:</span>
                  <span className="font-mono font-bold text-blue-700">{brightnessBoost.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.05"
                  value={brightnessBoost}
                  onChange={(e) => {
                    setBrightnessBoost(parseFloat(e.target.value));
                    setSelectedPreset(null);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Dehaze */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Fog / River Mist Dehazing:</span>
                  <span className="font-mono font-bold text-blue-700">{dehazeStrength}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={dehazeStrength}
                  onChange={(e) => {
                    setDehazeStrength(parseInt(e.target.value));
                    setSelectedPreset(null);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Edge Sharpness */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Detail Sharpness & Boundary Clarity:</span>
                  <span className="font-mono font-bold text-blue-700">{sharpnessBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={sharpnessBoost}
                  onChange={(e) => {
                    setSharpnessBoost(parseInt(e.target.value));
                    setSelectedPreset(null);
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {enhancementApplied && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Enhancement profile applied to {currentEnhanceCam.name} ({currentEnhanceCam.code}) live stream!</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleApplyToLive}
                  className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/25 transition-all hover:scale-[1.01] cursor-pointer uppercase"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>APPLY TO LIVE CCTV STREAM</span>
                </button>

                <button
                  onClick={() => {
                    const camObj = cameras.find(c => c.id === selectedEnhanceCamId);
                    if (onNavigateToLive) onNavigateToLive(camObj);
                  }}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs uppercase tracking-wider"
                >
                  <Eye className="w-4 h-4" />
                  <span>VIEW IN LIVE GRID</span>
                </button>

                <button
                  onClick={() => applyPreset('RAW_RESET')}
                  className="py-3 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset sliders to neutral"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
