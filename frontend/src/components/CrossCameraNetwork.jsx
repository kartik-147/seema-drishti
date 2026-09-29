import React, { useState, useEffect, useRef } from 'react';
import {
  Clock, Eye, ShieldCheck, AlertOctagon, XCircle, ChevronDown,
  ArrowRight, MapPin, Shield, Activity, Radio, CheckCircle2,
  Sliders, X, AlertTriangle, Video, FileSearch, Play, Pause,
  RotateCcw, Info, Sparkles, Share2, Navigation, Wifi, Send, MessageSquare,
  Printer, Download, FileText
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// DATA: Situation #024 — CAM-01 → CAM-03 → CAM-05
// ─────────────────────────────────────────────────────────────────────────────
const SIGHTINGS = [
  {
    id: 1,
    camCode: 'CAM-01',
    camId: 'cam_1',
    location: 'NORTH BORDER',
    terrain: 'Outer Fence — Sector Alpha',
    time: '08:41:12',
    confidence: 91,
    label: 'Person detected',
    story: 'A person was spotted walking along the outer fence line near the restricted border perimeter.',
    bgImage: '/cctv/cam1.jpg',
    qualityBadge: 'NORMAL',
    // bbox: left%, top%, width%, height% — tuned to cover the person in the image
    bboxStyle: { left: '38%', top: '20%', width: '16%', height: '65%' },
    techDetails: {
      model: 'Ultralytics YOLOv8n',
      conf: '0.91',
      class: 'person',
      bbox: 'x:420 y:180 w:64 h:142',
      frame: '842',
      fps: '59.9',
      clahe: null
    }
  },
  {
    id: 2,
    camCode: 'CAM-03',
    camId: 'cam_3',
    location: 'RIVER SIDE',
    terrain: 'Waterline Buffer — Sector Charlie',
    time: '08:42:08',
    confidence: 88,
    label: 'Related movement detected',
    story: 'Related movement was observed entering the restricted river buffer zone. Low visibility required automated contrast enhancement (CLAHE).',
    bgImage: '/cctv/cam3.jpg',
    qualityBadge: 'ENHANCED (CLAHE)',
    // person/movement appears in the lower-centre of the river frame
    bboxStyle: { left: '28%', top: '38%', width: '18%', height: '52%' },
    techDetails: {
      model: 'Ultralytics YOLOv8n + OpenCV CLAHE',
      conf: '0.88',
      class: 'person',
      bbox: 'x:210 y:310 w:58 h:130',
      frame: '1,420',
      fps: '59.9',
      clahe: 'ClipLimit 2.0 · TileGrid 8×8 · +38% dynamic range'
    }
  },
  {
    id: 3,
    camCode: 'CAM-05',
    camId: 'cam_5',
    location: 'EASTERN FENCE',
    terrain: 'Boundary Road — Sector Echo',
    time: '08:43:17',
    confidence: 84,
    label: 'Movement continues — vehicle spotted',
    story: 'A vehicle was detected moving along the eastern boundary fence road, completing the 770m border corridor traversal across three monitored sectors.',
    bgImage: '/cctv/cam5.jpg',
    qualityBadge: 'NORMAL',
    // Green patrol truck visible center-right along the fence road
    bboxStyle: { left: '53%', top: '50%', width: '17%', height: '24%' },
    techDetails: {
      model: 'Ultralytics YOLOv8n',
      conf: '0.84',
      class: 'vehicle',
      bbox: 'x:580 y:280 w:80 h:60',
      frame: '2,110',
      fps: '59.9',
      clahe: null
    }
  }
];

const CORRELATION_FACTORS = [
  {
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    title: 'TIME',
    headline: 'Sightings occurred close together',
    detail: 'All three detections happened within 2 minutes and 5 seconds — within the system\'s 3-minute correlation threshold.'
  },
  {
    icon: Navigation,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    title: 'DIRECTION',
    headline: 'Movement followed a consistent route',
    detail: 'The movement direction (South-East at ~1.2 m/s) remained consistent across all three camera observations.'
  },
  {
    icon: MapPin,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'LOCATION',
    headline: 'Cameras cover connected border areas',
    detail: 'CAM-01, CAM-03 and CAM-05 are physically adjacent — their monitored zones form a continuous border corridor (770m total).'
  },
  {
    icon: Activity,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    title: 'PATTERN',
    headline: 'Observations showed related movement',
    detail: 'Object class (Person), movement pace, and body silhouette are consistent across all three sightings.'
  }
];

// All 6 cameras for the secondary topology map
const ALL_CAMERAS = [
  { id: 'cam_1', code: 'CAM-01', name: 'North Border',     x: 50, y: 13, inSituation: true },
  { id: 'cam_2', code: 'CAM-02', name: 'Check Post',       x: 22, y: 42, inSituation: false },
  { id: 'cam_3', code: 'CAM-03', name: 'River Side',       x: 75, y: 37, inSituation: true },
  { id: 'cam_4', code: 'CAM-04', name: 'Perimeter Ridge',  x: 12, y: 72, inSituation: false },
  { id: 'cam_5', code: 'CAM-05', name: 'Eastern Fence',    x: 83, y: 72, inSituation: true },
  { id: 'cam_6', code: 'CAM-06', name: 'Sector Gate',      x: 50, y: 87, inSituation: false }
];

const TOPOLOGY_LINES = [
  { s: 'cam_1', t: 'cam_3', active: true  },
  { s: 'cam_3', t: 'cam_5', active: true  },
  { s: 'cam_1', t: 'cam_2', active: false },
  { s: 'cam_2', t: 'cam_4', active: false },
  { s: 'cam_4', t: 'cam_6', active: false },
  { s: 'cam_5', t: 'cam_6', active: false }
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED CONNECTION DOTS (along SVG paths)
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedDot({ from, to, delay = 0 }) {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t = (t + 0.008) % 1;
      setPos(t);
    }, 16);
    return () => clearInterval(id);
  }, []);
  const x = from.x + (to.x - from.x) * pos;
  const y = from.y + (to.y - from.y) * pos;
  return (
    <circle
      cx={`${x}%`}
      cy={`${y}%`}
      r="4"
      fill="#3b82f6"
      opacity={0.85}
      style={{ filter: 'drop-shadow(0 0 4px #3b82f6)' }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function CrossCameraNetwork({
  cameras = [],
  telemetryMap = {},
  currentTimeStr = '08:43:20',
  situation,
  onNavigateToLive,
  onSelectCamera,
  onVerify,
  onDismiss,
  onEscalate
}) {
  const [hoveredSighting, setHoveredSighting]       = useState(null);
  const [expandedTech, setExpandedTech]             = useState(null); // 1 | 2 | 3
  const [showSituationDetail, setShowSituationDetail] = useState(false);
  const [expandedFactor, setExpandedFactor]         = useState(null);
  const [showAllTech, setShowAllTech]               = useState(false);
  const [selectedEvidence, setSelectedEvidence]     = useState(1);
  const [animStep, setAnimStep]                     = useState(0); // 0,1,2 for story animation
  const [isAutoPlaying, setIsAutoPlaying]           = useState(false);
  const [radioNotified, setRadioNotified]           = useState(false);
  const [lastActionTime, setLastActionTime]         = useState(null);
  const [actionFeedback, setActionFeedback]         = useState(null);

  // Send Message to Authority State
  const [isAuthorityModalOpen, setIsAuthorityModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [authorityRecipient, setAuthorityRecipient] = useState('Sector HQ Commandant (Col. V. S. Rathore)');
  const [authorityUrgency, setAuthorityUrgency] = useState('URGENT FLASH');
  const [authorityMessage, setAuthorityMessage] = useState(
    'Situation #024 Alert: Target cross-camera movement verified across CAM-01, CAM-03, CAM-05 (770m corridor traversal). Target moving near outer boundary fence. Requesting patrol intercept.'
  );
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [transmittedDispatches, setTransmittedDispatches] = useState([]);

  const handleSendAuthorityMessage = (e) => {
    if (e) e.preventDefault();
    if (!authorityMessage.trim()) return;

    setIsTransmitting(true);
    setTimeout(() => {
      const recipientShort = authorityRecipient.split('(')[0].trim();
      const newDispatch = {
        time: currentTimeStr,
        recipient: recipientShort,
        urgency: authorityUrgency,
        message: authorityMessage
      };
      setTransmittedDispatches(prev => [newDispatch, ...prev]);
      setIsTransmitting(false);
      setDispatchSuccess(true);
      setActionFeedback(`Encrypted dispatch transmitted to ${recipientShort} (${authorityUrgency})`);
      setLastActionTime(currentTimeStr);

      setTimeout(() => {
        setDispatchSuccess(false);
        setIsAuthorityModalOpen(false);
      }, 1200);
    }, 600);
  };

  // Auto-play entrance animation on mount
  useEffect(() => {
    let t;
    const steps = [0, 1, 2];
    let i = 0;
    const run = () => {
      if (i < steps.length) {
        setAnimStep(steps[i]);
        i++;
        t = setTimeout(run, 800);
      }
    };
    t = setTimeout(run, 400);
    return () => clearTimeout(t);
  }, []);

  // Auto-play through sightings for live demo
  useEffect(() => {
    if (!isAutoPlaying) return;
    const id = setInterval(() => {
      setSelectedEvidence(prev => {
        const next = prev >= 3 ? 1 : prev + 1;
        return next;
      });
    }, 2500);
    return () => clearInterval(id);
  }, [isAutoPlaying]);

  const situationCode  = situation?.situationCode  || 'SITUATION #024';
  const operatorStatus = situation?.operatorStatus || 'PENDING VERIFICATION';

  // ── Helpers ──────────────────────────────────────────────────────────────
  const confColor = (c) =>
    c >= 90 ? 'text-emerald-700' : c >= 80 ? 'text-blue-700' : 'text-amber-700';
  const confBg = (c) =>
    c >= 90 ? 'bg-emerald-50 border-emerald-200' : c >= 80 ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200';

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto font-sans pb-8 animate-in fade-in duration-200">

      {/* ════════════════════════════════════════════════════════════════════
          PAGE HEADER
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/30 shrink-0">
                <Share2 className="w-4.5 h-4.5" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                Cross-Camera Situational Awareness
              </h1>
              <span className="hidden sm:inline text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Incident Code: SITUATION #024
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium ml-12">
              "Follow how separate camera observations become one connected situation."
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span><strong className="text-slate-900">6/6</strong> Cameras Online</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span><strong>1</strong> Active Situation</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2 text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span><strong>3</strong> Sightings Linked</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1 — LIVE STORY: HORIZONTAL 3-STEP VISUAL NARRATIVE
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-blue-200/80 shadow-xs p-6 space-y-5">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-mono">
                STAGE 1
              </span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                What the Cameras Saw — In Sequence
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Three separate cameras observed related movement within 2 minutes and 5 seconds.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(p => !p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                isAutoPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Pause' : 'Auto-Advance'}</span>
            </button>
          </div>
        </div>

        {/* 3-Step horizontal story with animated connectors */}
        <div className="grid grid-cols-1 lg:grid-cols-11 items-stretch gap-2">

          {SIGHTINGS.map((s, idx) => {
            const isHovered  = hoveredSighting === s.id;
            const isEvidence = selectedEvidence === s.id;
            const isVisible  = animStep >= idx;
            const hasTech    = expandedTech === s.id;

            return (
              <React.Fragment key={s.id}>
                {/* CAMERA STORY CARD */}
                <div
                  className={`lg:col-span-3 relative rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
                    ${isEvidence
                      ? 'border-blue-500 shadow-lg shadow-blue-500/15 scale-[1.01]'
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.005]'
                    }
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={() => { setHoveredSighting(s.id); setSelectedEvidence(s.id); }}
                  onMouseLeave={() => setHoveredSighting(null)}
                  onClick={() => setSelectedEvidence(s.id)}
                >
                  {/* CCTV Thumbnail with hover overlay */}
                  <div className="relative h-36 bg-slate-900 overflow-hidden">
                    <img
                      src={s.bgImage}
                      alt={s.location}
                      className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                    {/* Per-sighting bounding box — positioned over the actual detected person */}
                    <div
                      style={{
                        position: 'absolute',
                        left:   s.bboxStyle?.left   || '35%',
                        top:    s.bboxStyle?.top    || '22%',
                        width:  s.bboxStyle?.width  || '18%',
                        height: s.bboxStyle?.height || '60%',
                        border: '2px solid #f87171',
                        borderRadius: '2px',
                        transition: 'all 0.3s ease',
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                        boxShadow: '0 0 0 1px rgba(248,113,113,0.3)',
                      }}
                    >
                      <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-red-600 text-white text-[8.5px] font-bold rounded-sm whitespace-nowrap flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                        {idx === 0 ? 'Person P-12' : 'Related Movement'}
                      </div>
                      {/* Corner tick marks */}
                      <div className="absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 border-white/80 rounded-tl-sm" />
                      <div className="absolute -top-px -right-px w-2.5 h-2.5 border-t-2 border-r-2 border-white/80 rounded-tr-sm" />
                      <div className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b-2 border-l-2 border-white/80 rounded-bl-sm" />
                      <div className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 border-white/80 rounded-br-sm" />
                    </div>

                    {/* Camera code top-left */}
                    <div className="absolute top-2 left-2 font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-black/75 text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {s.camCode}
                    </div>

                    {/* Timestamp top-right */}
                    <div className="absolute top-2 right-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-blue-300 font-bold">
                      {s.time}
                    </div>

                    {/* Confidence bottom-right */}
                    <div className={`absolute bottom-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${confBg(s.confidence)} ${confColor(s.confidence)}`}>
                      {s.confidence}% conf
                    </div>

                    {/* Enhancement badge */}
                    {s.qualityBadge === 'ENHANCED (CLAHE)' && (
                      <div className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/90 text-white">
                        CLAHE ACTIVE
                      </div>
                    )}
                    {s.qualityBadge === 'NIGHT VISION' && (
                      <div className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-700/90 text-white">
                        IR NIGHT MODE
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-3.5 space-y-2.5 bg-white">
                    {/* Location badge + step indicator */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider border
                        ${idx === 0 ? 'bg-slate-900 text-white border-slate-800' :
                          idx === 1 ? 'bg-blue-900 text-white border-blue-800' :
                          'bg-slate-900 text-white border-slate-800'}`}
                      >
                        {s.camCode}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide
                        ${idx === 0 ? 'text-slate-500 bg-slate-100' :
                          'text-blue-600 bg-blue-50 border border-blue-200'}`}
                      >
                        {idx === 0 ? 'Sighting 1' : idx === 1 ? 'Sighting 2' : 'Sighting 3'}
                      </span>
                    </div>

                    {/* Location name */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.location}</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">{s.label}</div>
                    </div>

                    {/* Plain-English story */}
                    <p className="text-[11px] text-slate-600 leading-snug">{s.story}</p>

                    {/* Terrain & timestamp row */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                      <span>{s.terrain}</span>
                      <span className="font-bold text-blue-700">{s.time}</span>
                    </div>

                    {/* Expandable technical details */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedTech(hasTech ? null : s.id); }}
                      className="w-full text-[10.5px] font-semibold text-slate-500 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer pt-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{hasTech ? 'Hide' : 'Detection Details'}</span>
                      <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${hasTech ? 'rotate-180' : ''}`} />
                    </button>

                    {hasTech && (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 text-[10px] font-mono space-y-1 border border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="text-emerald-400 font-bold text-[9.5px] uppercase tracking-wider pb-0.5 border-b border-slate-800">
                          YOLOv8 Telemetry — {s.camCode}
                        </div>
                        <div className="flex justify-between"><span className="text-slate-400">Model:</span><span className="text-right max-w-[55%]">{s.techDetails.model}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Confidence:</span><span className="text-emerald-400">{s.techDetails.conf}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Class:</span><span>{s.techDetails.class}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Bbox:</span><span>{s.techDetails.bbox}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Frame / FPS:</span><span>{s.techDetails.frame} / {s.techDetails.fps}</span></div>
                        {s.techDetails.clahe && (
                          <div className={`pt-1 border-t border-slate-800 text-[9px] ${s.qualityBadge === 'NIGHT VISION' ? 'text-purple-400' : 'text-amber-400'}`}>
                            {s.qualityBadge === 'NIGHT VISION' ? 'IR: ' : 'CLAHE: '}{s.techDetails.clahe}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Active indicator line at bottom */}
                  {isEvidence && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-500 rounded-b-2xl" />
                  )}
                </div>

                {/* ANIMATED ARROW CONNECTOR (between cards) */}
                {idx < SIGHTINGS.length - 1 && (
                  <div className="lg:col-span-1 flex flex-col items-center justify-center gap-1.5 py-4 lg:py-0">
                    {/* Animated pulse line */}
                    <div className="hidden lg:flex flex-col items-center gap-0.5 w-full">
                      <div className="w-full h-px bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 relative overflow-hidden rounded">
                        <div
                          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
                          style={{ animation: 'slideRight 1.8s linear infinite' }}
                        />
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />
                      <div className="text-[9px] font-mono text-slate-400 text-center leading-tight">
                        {idx === 0 ? '56s later\n350m' : '69s later\n420m'}
                      </div>
                    </div>
                    {/* Mobile: vertical */}
                    <div className="lg:hidden flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <div className="w-px h-6 bg-blue-300"></div>
                      <span>{idx === 0 ? '56 sec' : '69 sec'}</span>
                      <div className="w-px h-6 bg-blue-300"></div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* CSS keyframes for sliding shimmer */}
        <style>{`
          @keyframes slideRight {
            from { transform: translateX(-200%); }
            to   { transform: translateX(400%); }
          }
        `}</style>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2 — SYSTEM UNDERSTANDING: SITUATION #024 CARD
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-red-200/80 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          {/* Left: core message */}
          <div className="space-y-3 lg:max-w-lg">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-mono">STAGE 2</span>
              <div className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                ACTIVE SITUATION
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                {situationCode}
              </h2>
              <p className="text-sm font-bold text-slate-500 mt-0.5">
                "3 related sightings connected"
              </p>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              The system observed related movement across three cameras within a short time window.
              These separate observations were combined into a single, understandable incident —
              rather than generating three separate alarms.
            </p>

            {/* Non-biometric disclaimer */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/80 border border-blue-200/90">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-blue-900">Non-biometric movement correlation</div>
                <div className="text-[11px] text-blue-700 leading-relaxed">
                  This system does NOT use facial recognition or biometric identification.
                  It uses only timing, location, and movement direction to connect observations.
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3 metrics */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:w-52 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">3</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Cameras</div>
              <div className="text-[10px] text-slate-400 font-medium">CAM-01 · 03 · 05</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-2xl font-extrabold text-blue-800 font-mono">2:05</div>
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">Duration</div>
              <div className="text-[10px] text-blue-400 font-medium">min : sec elapsed</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-2xl font-extrabold text-emerald-800 font-mono">87%</div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Correlation</div>
              <div className="text-[10px] text-emerald-400 font-medium">movement match</div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3 — WHY WERE THEY CONNECTED?
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-mono">STAGE 3</span>
          <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
            Why Were They Connected?
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          The system used four simple rules to decide these sightings were part of the same incident.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CORRELATION_FACTORS.map((f, i) => {
            const Icon = f.icon;
            const isExpanded = expandedFactor === i;
            return (
              <button
                key={i}
                onClick={() => setExpandedFactor(isExpanded ? null : i)}
                className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-sm group ${
                  isExpanded ? `${f.border} ${f.bg} shadow-xs` : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isExpanded ? f.bg : 'bg-white border border-slate-200 group-hover:bg-slate-50'
                }`}>
                  <Icon className={`w-5 h-5 ${isExpanded ? f.color : 'text-slate-500 group-hover:text-slate-700'}`} />
                </div>

                <div className={`text-[10px] font-mono font-extrabold uppercase tracking-widest mb-1 ${isExpanded ? f.color : 'text-slate-400'}`}>
                  {f.title}
                </div>
                <div className="text-sm font-bold text-slate-800 leading-tight mb-2">
                  {f.headline}
                </div>

                {isExpanded && (
                  <p className="text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
                    {f.detail}
                  </p>
                )}

                <div className={`text-[10px] font-semibold mt-1.5 transition-colors ${isExpanded ? f.color : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {isExpanded ? 'Click to collapse' : 'Tap to learn more →'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4 — BORDER CORRIDOR (Secondary topology map)
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-mono">STAGE 4</span>
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              Border Corridor Map
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-medium italic">
            Highlighted path: CAM-01 → CAM-03 → CAM-05 (Situation #024 route)
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          All 6 cameras monitor the border. The highlighted cameras (CAM-01, CAM-03, CAM-05) were involved in Situation #024.
          Other cameras remain active and monitoring.
        </p>

        <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#f1f5f9] via-[#e8eef6] to-[#dde6f0] border border-slate-200/80 overflow-hidden" style={{ height: '320px' }}>

          {/* Terrain labels */}
          <div className="absolute top-3 inset-x-6 flex items-center justify-between text-[9px] font-mono text-slate-400 border-b border-dashed border-slate-300 pb-1 pointer-events-none">
            <span>◄ NORTH BORDER PERIMETER FENCE LINE ►</span>
            <span className="text-red-400 font-bold">RESTRICTED</span>
          </div>
          <div className="absolute right-3 top-12 bottom-6 w-24 bg-blue-500/6 rounded-2xl border border-blue-300/25 flex items-center justify-center pointer-events-none rotate-2">
            <span className="text-[8px] font-mono text-blue-500 font-semibold text-center leading-tight">
              CHARLIE<br/>WATERLINE<br/>BUFFER
            </span>
          </div>
          <div className="absolute left-3 top-28 w-20 h-40 bg-slate-300/20 rounded-2xl border border-slate-300/30 flex items-center justify-center pointer-events-none -rotate-6">
            <span className="text-[8px] font-mono text-slate-400 text-center">DELTA<br/>RIDGE</span>
          </div>

          {/* SVG corridors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {TOPOLOGY_LINES.map((line, li) => {
              const s = ALL_CAMERAS.find(c => c.id === line.s);
              const t = ALL_CAMERAS.find(c => c.id === line.t);
              return (
                <line
                  key={li}
                  x1={`${s.x}%`} y1={`${s.y}%`}
                  x2={`${t.x}%`} y2={`${t.y}%`}
                  stroke={line.active ? '#ef4444' : '#cbd5e1'}
                  strokeWidth={line.active ? 2.5 : 1.5}
                  strokeDasharray={line.active ? '7 4' : 'none'}
                  strokeOpacity={line.active ? 0.85 : 0.5}
                />
              );
            })}

            {/* Animated dots on active paths */}
            {TOPOLOGY_LINES.filter(l => l.active).map((line, li) => {
              const s = ALL_CAMERAS.find(c => c.id === line.s);
              const t = ALL_CAMERAS.find(c => c.id === line.t);
              return <AnimatedDot key={`dot-${li}`} from={s} to={t} delay={li * 800} />;
            })}
          </svg>

          {/* Camera nodes */}
          {ALL_CAMERAS.map((cam) => (
            <div
              key={cam.id}
              style={{ position: 'absolute', left: `${cam.x}%`, top: `${cam.y}%`, transform: 'translate(-50%, -50%)' }}
              className={`group cursor-pointer select-none z-10 transition-all duration-200 hover:scale-105`}
              onClick={() => {
                const cameraObj = cameras.find(c => c.id === cam.id);
                if (cameraObj && onSelectCamera) onSelectCamera(cameraObj);
              }}
            >
              <div className={`rounded-2xl border-2 px-2.5 py-2 text-center min-w-[84px] shadow-xs transition-all ${
                cam.inSituation
                  ? 'bg-white border-red-400 shadow-red-500/15'
                  : 'bg-white/80 border-slate-200'
              }`}>
                <div className={`text-[9px] font-mono font-bold mb-0.5 ${cam.inSituation ? 'text-red-600' : 'text-slate-400'}`}>
                  {cam.code}
                </div>
                <div className={`text-[10px] font-bold leading-tight ${cam.inSituation ? 'text-slate-800' : 'text-slate-500'}`}>
                  {cam.name}
                </div>
                {cam.inSituation && (
                  <div className="mt-1 flex items-center justify-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[8px] font-bold text-red-600">#024</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-400 inline-block"></span> Situation #024 path
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-300 inline-block"></span> Other active corridors
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Cameras in situation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300 inline-block border border-slate-400"></span> Monitoring normally
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 5 — EVIDENCE: 3 CCTV FRAMES SIDE BY SIDE
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold font-mono">STEP 5</span>
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              Evidence — Camera Exhibits
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAllTech(p => !p)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>{showAllTech ? 'Hide Detection Details' : 'View Detection Details'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Click any exhibit to view details. Each frame shows the moment of detection.
        </p>

        {/* 3 frames */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SIGHTINGS.map((s) => {
            const isSelected = selectedEvidence === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedEvidence(s.id)}
                className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 shadow-lg shadow-blue-500/15 scale-[1.01]'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Frame */}
                <div className="relative h-44 bg-slate-900">
                  <img src={s.bgImage} alt={s.location} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                  {/* Per-sighting bounding box — positioned over detected person */}
                  <div
                    style={{
                      position: 'absolute',
                      left:   s.bboxStyle?.left   || '35%',
                      top:    s.bboxStyle?.top    || '22%',
                      width:  s.bboxStyle?.width  || '18%',
                      height: s.bboxStyle?.height || '60%',
                      border: '2px solid #f87171',
                      borderRadius: '2px',
                      boxShadow: '0 0 0 1px rgba(248,113,113,0.3)',
                    }}
                  >
                    <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-bold whitespace-nowrap rounded-sm flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                      {s.id === 1 ? 'Person P-12' : 'Related Movement'}
                    </div>
                    {/* Corner ticks */}
                    <div className="absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 border-white/80 rounded-tl-sm" />
                    <div className="absolute -top-px -right-px w-2.5 h-2.5 border-t-2 border-r-2 border-white/80 rounded-tr-sm" />
                    <div className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b-2 border-l-2 border-white/80 rounded-bl-sm" />
                    <div className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 border-white/80 rounded-br-sm" />
                  </div>

                  {/* Overlays */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/75 text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {s.camCode}
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/70 text-blue-300">
                    {s.time}
                  </div>
                  {s.qualityBadge === 'ENHANCED (CLAHE)' && (
                    <div className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/90 text-white">
                      CLAHE ACTIVE
                    </div>
                  )}
                  {s.qualityBadge === 'NIGHT VISION' && (
                    <div className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-700/90 text-white">
                      IR NIGHT MODE
                    </div>
                  )}
                  <div className={`absolute bottom-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${confBg(s.confidence)} ${confColor(s.confidence)}`}>
                    {s.confidence}%
                  </div>
                </div>

                {/* Frame info */}
                <div className="p-3.5 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.location}</div>
                      <div className="text-xs font-extrabold text-slate-900">{s.label}</div>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Exhibit {s.id}/3
                    </div>
                  </div>

                  {showAllTech && (
                    <div className="p-2 rounded-lg bg-slate-900 text-slate-200 text-[9.5px] font-mono space-y-0.5 animate-in fade-in duration-150">
                      <div className="text-emerald-400 font-bold">Technical Telemetry</div>
                      <div>Conf: {s.techDetails.conf} · Class: {s.techDetails.class}</div>
                      <div>Bbox: {s.techDetails.bbox}</div>
                      <div>Frame {s.techDetails.frame} @ {s.techDetails.fps} FPS</div>
                      {s.techDetails.clahe && (
                        <div className="text-amber-400 text-[9px]">CLAHE: {s.techDetails.clahe}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation between exhibits */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {SIGHTINGS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedEvidence(s.id)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  selectedEvidence === s.id ? 'bg-blue-500 scale-125' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => {
              const current = SIGHTINGS.find(s => s.id === selectedEvidence);
              const cam = cameras.find(c => c.id === current?.camId);
              if (cam && onSelectCamera) onSelectCamera(cam);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>VIEW FULL EVIDENCE</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 6 — OFFICER RESPONSE & DECISION CONSOLE (Overhauled UI)
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border-2 border-blue-500/30 shadow-lg shadow-blue-500/5 p-6 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold font-mono tracking-wide shadow-xs">
              STEP 6 OF 6
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Officer Response & Decision Console</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                No technical background needed — review the verified camera journey and select your action with one click.
              </p>
            </div>
          </div>

          {/* Current Operator Status Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-slate-400">Current Status:</span>
            <span className={`px-3 py-1 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 border shadow-2xs ${
              operatorStatus === 'VERIFIED'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : operatorStatus === 'ESCALATED'
                ? 'bg-red-50 text-red-800 border-red-300'
                : operatorStatus === 'DISMISSED'
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                operatorStatus === 'VERIFIED'
                  ? 'bg-emerald-500'
                  : operatorStatus === 'ESCALATED'
                  ? 'bg-red-500'
                  : operatorStatus === 'DISMISSED'
                  ? 'bg-slate-500'
                  : 'bg-amber-500'
              }`}></span>
              <span>
                {operatorStatus === 'VERIFIED'
                  ? 'VERIFIED BY OFFICER'
                  : operatorStatus === 'ESCALATED'
                  ? 'PATROL DISPATCHED (QRT)'
                  : operatorStatus === 'DISMISSED'
                  ? 'ROUTINE WATCH CONTINUED'
                  : 'WAITING FOR YOUR DECISION'}
              </span>
            </span>
          </div>
        </div>

        {/* Visual Journey Digest Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-5 space-y-4 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-300 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Verified Sighting Sequence &bull; {situationCode}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Person traveled 770m across 3 camera zones in 2 minutes 5 seconds
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/15">
                Speed: <strong>~1.2 m/s (Walking)</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Route Confirmed
              </span>
            </div>
          </div>

          {/* 3 Step Visual Sequence Pills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="min-w-0 text-xs">
                <div className="font-mono font-bold text-blue-300 flex items-center gap-1.5">
                  <span>CAM-01</span>
                  <span className="text-[10px] text-slate-300 font-normal">08:41:12</span>
                </div>
                <div className="font-semibold text-white truncate">North Border Fence Line</div>
                <div className="text-[11px] text-slate-300 truncate">First acquisition walking south-east</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/30 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="min-w-0 text-xs">
                <div className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                  <span>CAM-03</span>
                  <span className="text-[10px] text-slate-300 font-normal">08:42:08</span>
                </div>
                <div className="font-semibold text-white truncate">River Waterline Crossing</div>
                <div className="text-[11px] text-slate-300 truncate">Night vision filter brightened view</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/30 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="min-w-0 text-xs">
                <div className="font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>CAM-05</span>
                  <span className="text-[10px] text-slate-300 font-normal">08:43:17</span>
                </div>
                <div className="font-semibold text-white truncate">Eastern Perimeter Road</div>
                <div className="text-[11px] text-slate-300 truncate">Movement towards outer road boundary</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-blue-200/90 pt-1 border-t border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Privacy Notice:</strong> This link is calculated strictly from time and physical direction. No facial recognition or biometric scanning is used.</span>
          </div>
        </div>

        {/* Officer Authority Communication & Action Console */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Officer Response & Command Communication</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Transmit instant encrypted advisory to Border HQ or trigger tactical protocol
              </p>
            </div>
            {transmittedDispatches.length > 0 ? (
              <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-mono border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{transmittedDispatches.length} DISPATCH TRANSMITTED</span>
              </span>
            ) : (
              <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold font-mono border border-blue-200">
                DIRECT COMM CHANNEL ACTIVE
              </span>
            )}
          </div>

          {/* Quick Authority Dispatch Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Authority Dispatch Templates:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: 'Immediate QRT Intercept',
                  urgency: 'URGENT FLASH',
                  recipient: 'Sector HQ Commandant (Col. V. S. Rathore)',
                  msg: 'Situation #024 Alert: Target cross-camera movement verified across CAM-01, CAM-03, CAM-05 (770m corridor traversal). Target moving near outer boundary fence. Requesting immediate QRT Alpha patrol intercept.'
                },
                {
                  label: 'Confirm Cross-Camera Track',
                  urgency: 'PRIORITY ADVISORY',
                  recipient: 'Sector HQ Commandant (Col. V. S. Rathore)',
                  msg: 'Confirmed Cross-Camera Continuity: Trajectory established across 3 border posts in 2m 05s. Speed ~1.2m/s walking. Corroborated with optical camera frames. Logged into border registry.'
                },
                {
                  label: 'Check Post Bravo Advisory',
                  urgency: 'OPERATIONAL SITREP',
                  recipient: 'Check Post Bravo (Duty Officer Sub-Inspector)',
                  msg: 'Check Post Bravo Notice: Person tracked approaching your eastern perimeter corridor. Please maintain visual line of sight along boundary gate.'
                },
                {
                  label: 'Border Police Joint Dispatch',
                  urgency: 'PRIORITY ADVISORY',
                  recipient: 'District Border Police (DIG Control Room)',
                  msg: 'Joint Advisory: Situation #024 synthesized along Sector Echo. Coordinates passed to QRT patrol units. Requesting highway checkpoint awareness.'
                }
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAuthorityUrgency(tmpl.urgency);
                    setAuthorityRecipient(tmpl.recipient);
                    setAuthorityMessage(tmpl.msg);
                    setIsAuthorityModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                >
                  <span>{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prominent Send Message to Authority Button */}
          <div className="pt-1">
            <button
              id="btn-send-message-authority"
              onClick={() => setIsAuthorityModalOpen(true)}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.008] active:scale-[0.99] cursor-pointer border border-blue-400/30"
            >
              <Send className="w-5 h-5 -rotate-12 shrink-0" />
              <span>SEND MESSAGE TO AUTHORITY</span>
            </button>
          </div>

          {/* Secondary Action Buttons (View Live Cameras & Create Incident Report) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateToLive && onNavigateToLive()}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer uppercase tracking-wider"
            >
              <Video className="w-4 h-4 text-blue-600" />
              <span>VIEW LIVE CAMERAS</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer uppercase tracking-wider"
            >
              <FileSearch className="w-4 h-4 text-blue-600" />
              <span>CREATE INCIDENT REPORT</span>
            </button>
          </div>

          {/* Quick Operator Protocol Buttons */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Direct Tactical Protocol:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  onVerify && onVerify();
                  setActionFeedback('Confirmed: Sighting verified and logged into shift audit.');
                  setLastActionTime(currentTimeStr);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  operatorStatus === 'VERIFIED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{operatorStatus === 'VERIFIED' ? '✓ Verified & Logged' : 'Verify Sighting'}</span>
              </button>
              <button
                onClick={() => {
                  onEscalate && onEscalate();
                  setActionFeedback('Dispatched: QRT Alpha notified with GPS coordinates of Eastern Fence.');
                  setLastActionTime(currentTimeStr);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  operatorStatus === 'ESCALATED'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white hover:bg-red-50 text-red-800 border border-red-300 shadow-2xs'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                <span>{operatorStatus === 'ESCALATED' ? 'QRT Dispatched' : 'Dispatch QRT'}</span>
              </button>
              <button
                onClick={() => {
                  onDismiss && onDismiss();
                  setActionFeedback('Status set: Continuing normal camera watch.');
                  setLastActionTime(currentTimeStr);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                  operatorStatus === 'DISMISSED'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>{operatorStatus === 'DISMISSED' ? '✓ Normal Watch' : 'Continue Watch'}</span>
              </button>
            </div>
          </div>

          {/* Transmitted Messages Log in Session */}
          {transmittedDispatches.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
              <div className="font-bold text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Transmitted Dispatches ({transmittedDispatches.length})</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700">Digital Audit Trail</span>
              </div>
              <div className="space-y-2">
                {transmittedDispatches.map((d, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-emerald-200/80 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-bold text-slate-800">To: {d.recipient}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                        {d.urgency}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{d.message}</p>
                    <div className="text-[10px] font-mono text-slate-400 pt-0.5">
                      Transmitted at {d.time} IST &bull; AES-256 Encrypted &bull; Ack Pending
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ground Units Readiness Status Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span>Ground Patrol Readiness: High</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="text-[11px] text-slate-500">
                QRT Squad Alpha is 2.1 km away &bull; Estimated response time: ~2 minutes
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">
              Station: <strong>Sector Alpha HQ</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">
              Authority: <strong>Border Commander</strong>
            </span>
          </div>
        </div>

        {/* Action Feedback Notification if recently triggered */}
        {actionFeedback && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionFeedback}</span>
              {lastActionTime && (
                <span className="text-[10px] font-mono text-emerald-700 font-normal">
                  (Logged at {lastActionTime})
                </span>
              )}
            </div>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

      </div>

      {/* ════════════════════════════════════════════════════════════════════
          APPENDIX — CROSS-CAMERA EVENT TIMELINE (Compact)
          ════════════════════════════════════════════════════════════════════ */}
      <details className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <summary className="flex items-center justify-between p-5 cursor-pointer select-none list-none">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Full Event Timeline</h3>
            <span className="text-xs text-slate-400 font-medium">(Technical view · all events)</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" />
        </summary>

        <div className="px-5 pb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { time: '08:41:12', cam: 'CAM-01', bg: 'bg-slate-50', border: 'border-slate-200', badgeBg: 'bg-slate-900 text-white', desc: 'Person P-12 acquired at outer perimeter fence line', conf: '91%', tag: null },
              { time: '08:42:08', cam: 'CAM-03', bg: 'bg-blue-50/60', border: 'border-blue-200', badgeBg: 'bg-blue-900 text-white', desc: 'Related movement in river buffer zone · CLAHE active', conf: '88%', tag: 'CLAHE' },
              { time: '08:43:17', cam: 'CAM-05', bg: 'bg-slate-50', border: 'border-slate-200', badgeBg: 'bg-slate-900 text-white', desc: 'Continuing traversal towards eastern boundary fence', conf: '84%', tag: null },
              { time: '08:43:20', cam: 'SYSTEM', bg: 'bg-red-50/80', border: 'border-red-200', badgeBg: 'bg-red-600 text-white', desc: 'Situation #024 synthesised · Risk 82/100 (HIGH)', conf: '87%', tag: 'HIGH RISK' }
            ].map((ev, i) => (
              <div key={i} className={`p-3.5 rounded-2xl ${ev.bg} border ${ev.border} space-y-1.5 transition-all hover:shadow-xs`}>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-blue-700">{ev.time}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.badgeBg}`}>{ev.cam}</span>
                </div>
                <div className="text-xs font-semibold text-slate-800">{ev.desc}</div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Confidence: <strong className="text-slate-700">{ev.conf}</strong></span>
                  {ev.tag && (
                    <span className="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">{ev.tag}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>

      {/* ════════════════════════════════════════════════════════════════════
          AUTHORITY MESSAGE DISPATCH MODAL
          ════════════════════════════════════════════════════════════════════ */}
      {isAuthorityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-blue-300 flex items-center justify-center border border-white/20">
                  <Send className="w-5 h-5 -rotate-12" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold tracking-tight">
                      TRANSMIT MESSAGE TO AUTHORITY
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                      SECURE AES-256
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/80">
                    Direct tactical dispatch to Higher Command & Patrol Units
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthorityModalOpen(false)}
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendAuthorityMessage} className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              {/* Recipient */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Authority Recipient:</span>
                </label>
                <select
                  value={authorityRecipient}
                  onChange={(e) => setAuthorityRecipient(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Sector HQ Commandant (Col. V. S. Rathore)">
                    Sector HQ Commandant (Col. V. S. Rathore) — Higher Command
                  </option>
                  <option value="BSF Quick Response Team (QRT Alpha)">
                    BSF Quick Response Team (QRT Alpha) — Field Ground Patrol
                  </option>
                  <option value="District Border Police (DIG Control Room)">
                    District Border Police (DIG Control Room) — Outer Cordon
                  </option>
                  <option value="Check Post Bravo (Duty Officer Sub-Inspector)">
                    Check Post Bravo (Duty Officer Sub-Inspector) — Immediate Gate
                  </option>
                  <option value="UAV Drone Reconnaissance Squad (Unit 4)">
                    UAV Drone Reconnaissance Squad (Unit 4) — Aerial Recon
                  </option>
                </select>
              </div>

              {/* Urgency */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Urgency Priority Level:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { level: 'URGENT FLASH', desc: 'Immediate response', bg: 'bg-red-50 text-red-800 border-red-300 ring-red-400' },
                    { level: 'PRIORITY ADVISORY', desc: 'Elevated caution', bg: 'bg-amber-50 text-amber-800 border-amber-300 ring-amber-400' },
                    { level: 'OPERATIONAL SITREP', desc: 'Routine log', bg: 'bg-blue-50 text-blue-800 border-blue-300 ring-blue-400' }
                  ].map((p) => (
                    <button
                      key={p.level}
                      type="button"
                      onClick={() => setAuthorityUrgency(p.level)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        authorityUrgency === p.level
                          ? `${p.bg} ring-2 font-bold shadow-xs`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-mono text-[10.5px] font-bold">{p.level}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Message Body:</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {authorityMessage.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={authorityMessage}
                  onChange={(e) => setAuthorityMessage(e.target.value)}
                  placeholder="Type clear instructions or situational briefing..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Auto Attached Digital Evidence */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-600 text-[11px]">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Automatically Attached Digital Evidence:</span>
                </div>
                <ul className="list-disc list-inside text-slate-500 space-y-0.5 text-[10.5px]">
                  <li>3 Optical camera frames (CAM-01 @ 08:41:12, CAM-03 @ 08:42:08, CAM-05 @ 08:43:17)</li>
                  <li>GPS Corridor trajectory (770m traversal vector, 1.2 m/s calculated velocity)</li>
                  <li>Operator digital badge and session timestamp</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAuthorityModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransmitting || dispatchSuccess}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    dispatchSuccess
                      ? 'bg-emerald-600 text-white'
                      : isTransmitting
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25'
                  }`}
                >
                  {dispatchSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>DISPATCH TRANSMITTED ✓</span>
                    </>
                  ) : isTransmitting ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>ENCRYPTING & SENDING...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 -rotate-12" />
                      <span>TRANSMIT DISPATCH NOW</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          INCIDENT SITREP DOSSIER MODAL
          ════════════════════════════════════════════════════════════════════ */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileSearch className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      INCIDENT SITUATION REPORT (SITREP)
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      SITREP-2026-024
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    BSF Command & Control &bull; Cross-Camera Synthesis Audit
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">CASE ID:</span>
                  <strong className="text-slate-800">SIT-024</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CORRIDOR:</span>
                  <strong className="text-slate-800">Sector Alpha → Charlie → Echo</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DISTANCE / TIME:</span>
                  <strong className="text-blue-700">770m in 2m 05s</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">STATUS:</span>
                  <strong className="text-emerald-700">{operatorStatus}</strong>
                </div>
              </div>

              {/* Narrative */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
                <div className="font-bold text-slate-900 text-xs">Official Situation Summary:</div>
                <p className="leading-relaxed">
                  Target acquired at outer perimeter fence in CAM-01 at 08:41:12. Moving in a south-easterly heading, target re-appeared in CAM-03 at 08:42:08 in the restricted river buffer zone. Sequence concluded at CAM-05 at 08:43:17 near boundary road with green patrol vehicle. Direction vector and timing strictly rule out coincidence.
                </p>
              </div>

              {/* Evidence Triad */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono">
                  Optical Evidence Timeline
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {SIGHTINGS.map((s) => (
                    <div key={s.id} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 p-1">
                      <img src={s.bgImage} alt={s.camCode} className="w-full aspect-16/10 object-cover rounded-lg" />
                      <div className="p-2 text-[10px] text-white">
                        <div className="font-bold flex justify-between font-mono">
                          <span>{s.camCode}</span>
                          <span className="text-blue-400">{s.time}</span>
                        </div>
                        <div className="text-slate-300 truncate">{s.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Certification */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-600">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Certifying Officer:</div>
                  <div className="font-bold text-slate-800 text-xs">Sub-Inspector R. Sharma (Badge #8841)</div>
                  <div className="text-[10.5px] text-slate-500">Border Surveillance Unit</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Timestamp:</div>
                  <div className="font-mono text-xs text-slate-800">28 Sep 2026 {currentTimeStr} IST</div>
                  <div className="text-[10px] font-bold text-emerald-600 font-mono">✓ CERTIFIED VALID</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-200 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionFeedback('Incident Report exported as PDF.');
                  setIsReportModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
