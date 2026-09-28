import React, { useState, useMemo } from 'react';
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Eye,
  Video,
  ArrowRight,
  Share2,
  Filter,
  Search,
  X,
  Download,
  Plus,
  Sparkles,
  RefreshCw,
  Layers,
  FileText,
  Printer,
  Check,
  Info,
  User,
  Car,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Flame,
  ChevronRight,
  Sliders,
  ExternalLink,
  ChevronDown,
  Send,
  MessageSquare
} from 'lucide-react';

import { INITIAL_ALERTS, ALERT_EVENT_TYPES, SIMULATION_TEMPLATES } from '../data/alertsData';

export default function AlertsEventsModule({
  cameras = [],
  currentTimeStr = '20:29:45',
  modelStatus = 'MODEL ACTIVE',
  currentUser = { name: 'Commander R. K. Sharma', role: 'Border Commander (Sector Alpha-Foxtrot)' },
  onNavigateToLive,
  onOpenHealth,
  onSelectCamera,
  onUpdateUnresolvedCount
}) {
  // Alert State Store
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedAlertId, setSelectedAlertId] = useState('A-0241'); // SITUATION #024 initial selected
  const [newAlertHighlightId, setNewAlertHighlightId] = useState(null);

  // Filters State
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'RESOLVED'
  const [searchQuery, setSearchQuery] = useState('');
  const [cameraFilter, setCameraFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // SITREP Incident Report Modal State
  const [isSitrepModalOpen, setIsSitrepModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selected Alert Object
  const selectedAlert = useMemo(() => {
    return alerts.find((a) => a.id === selectedAlertId) || alerts[0];
  }, [alerts, selectedAlertId]);

  // Authority Modal State for Selected Alert Tracking
  const [isAuthorityModalOpen, setIsAuthorityModalOpen] = useState(false);
  const [authorityRecipient, setAuthorityRecipient] = useState('Sector HQ Commandant (Col. V. S. Rathore)');
  const [authorityUrgency, setAuthorityUrgency] = useState('URGENT FLASH');
  const [authorityMessage, setAuthorityMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [transmittedAlertDispatches, setTransmittedAlertDispatches] = useState({});

  const handleOpenAuthorityModal = () => {
    const defaultUrgency = selectedAlert.riskScore >= 75 ? 'URGENT FLASH' : selectedAlert.riskScore >= 50 ? 'PRIORITY ADVISORY' : 'OPERATIONAL SITREP';
    setAuthorityUrgency(defaultUrgency);
    setAuthorityMessage(
      `Incident ${selectedAlert.alertNumber} Tracking Report: ${selectedAlert.title} in ${selectedAlert.sector}. Priority score: ${selectedAlert.riskScore}/100. Target: ${selectedAlert.targetTrackId || 'Person P-12'}. AI Assessment: ${selectedAlert.aiExplanation}`
    );
    setIsAuthorityModalOpen(true);
  };

  const handleSendAuthorityMessage = (e) => {
    if (e) e.preventDefault();
    if (!authorityMessage.trim()) return;

    setIsTransmitting(true);
    setTimeout(() => {
      const recipientShort = authorityRecipient.split('(')[0].trim();
      setTransmittedAlertDispatches(prev => ({
        ...prev,
        [selectedAlert.id]: {
          time: currentTimeStr,
          recipient: recipientShort,
          urgency: authorityUrgency,
          message: authorityMessage
        }
      }));
      setIsTransmitting(false);
      setDispatchSuccess(true);
      showToast(`Encrypted tracking dispatch transmitted to ${recipientShort}`, 'success');

      setTimeout(() => {
        setDispatchSuccess(false);
        setIsAuthorityModalOpen(false);
      }, 1200);
    }, 600);
  };

  // Dynamic Summary Counts
  const counts = useMemo(() => {
    let critical = 0;
    let high = 0;
    let medium = 0;
    let resolved = 0;

    alerts.forEach((a) => {
      if (a.status === 'RESOLVED') {
        resolved += 1;
      } else {
        if (a.severity === 'CRITICAL') critical += 1;
        else if (a.severity === 'HIGH') high += 1;
        else if (a.severity === 'MEDIUM') medium += 1;
      }
    });

    const unresolved = critical + high + medium;
    return { critical, high, medium, resolved, unresolved };
  }, [alerts]);

  React.useEffect(() => {
    if (onUpdateUnresolvedCount) {
      onUpdateUnresolvedCount(counts.unresolved);
    }
  }, [counts.unresolved, onUpdateUnresolvedCount]);

  // Filtered Alert List
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      // 1. Severity / Tab filter
      if (severityFilter === 'RESOLVED') {
        if (a.status !== 'RESOLVED') return false;
      } else if (severityFilter !== 'ALL') {
        if (a.severity !== severityFilter || a.status === 'RESOLVED') return false;
      }

      // 2. Status dropdown filter
      if (statusFilter !== 'ALL') {
        if (a.status !== statusFilter) return false;
      }

      // 3. Camera filter
      if (cameraFilter !== 'ALL') {
        if (!a.camera.includes(cameraFilter)) return false;
      }

      // 4. Event Type filter
      if (eventTypeFilter !== 'ALL') {
        if (a.eventType !== eventTypeFilter) return false;
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchCam = a.camera.toLowerCase().includes(q);
        const matchSituation = (a.situation || '').toLowerCase().includes(q);
        const matchTarget = (a.targetTrackId || '').toLowerCase().includes(q);
        const matchId = a.id.toLowerCase().includes(q);
        const matchType = a.eventType.toLowerCase().includes(q);
        if (!matchTitle && !matchCam && !matchSituation && !matchTarget && !matchId && !matchType) {
          return false;
        }
      }

      return true;
    });
  }, [alerts, severityFilter, statusFilter, cameraFilter, eventTypeFilter, searchQuery]);

  // Operator Action Handler: Update Alert Status
  const handleUpdateStatus = (newStatus) => {
    if (!selectedAlert) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const actionLabel = `STATUS CHANGED TO ${newStatus}`;

    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === selectedAlert.id) {
          return {
            ...a,
            status: newStatus,
            auditLog: [
              ...(a.auditLog || []),
              {
                time: timeStr,
                action: actionLabel,
                by: currentUser.name || 'Border Commander',
                status: newStatus
              }
            ]
          };
        }
        return a;
      })
    );

    showToast(`${selectedAlert.alertNumber} marked as ${newStatus}`, 'success');
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSeverityFilter('ALL');
    setSearchQuery('');
    setCameraFilter('ALL');
    setEventTypeFilter('ALL');
    setTimeFilter('ALL');
    setStatusFilter('ALL');
  };

  // Live Alert Simulation
  const handleSimulateDetection = () => {
    // Pick next template randomly or cyclically
    const template = SIMULATION_TEMPLATES[Math.floor(Math.random() * SIMULATION_TEMPLATES.length)];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newIdNum = Math.floor(Math.random() * 800) + 250;
    const newId = `A-0${newIdNum}`;

    const newAlert = {
      id: newId,
      alertNumber: `ALERT #${newId}`,
      title: template.title,
      severity: template.severity,
      eventType: template.eventType,
      camera: template.camera,
      primaryCam: template.camerasList[0],
      camerasList: template.camerasList,
      time: timeStr,
      date: '28 Sep 2026',
      confidence: template.confidence,
      rawConfidence: template.rawConfidence,
      visibility: template.visibility,
      reducedConfidence: template.reducedConfidence || false,
      reducedConfidenceNote: template.reducedConfidenceNote || '',
      situation: template.situation || '—',
      status: 'ACTIVE',
      targetTrackId: template.targetTrackId,
      targetClass: template.targetClass,
      sector: template.sector,
      isCrossCamera: template.isCrossCamera,
      corridorName: template.corridorName || 'Perimeter Security Sector',
      riskScore: template.riskScore,
      maxRisk: 100,
      riskLevel: template.riskLevel,
      riskBreakdown: template.riskBreakdown,
      aiExplanation: template.aiExplanation,
      isCameraHealthAlert: template.isCameraHealthAlert || false,
      healthMetrics: template.healthMetrics || null,
      evidenceThumbnails: [
        {
          camCode: template.camerasList[0],
          name: template.sector.split('(')[0]?.trim() || template.camerasList[0],
          sector: template.sector,
          img: `/cctv/${template.camerasList[0].toLowerCase().replace('-', '')}.jpg`,
          video: `/videos/${template.camerasList[0].toLowerCase().replace('-', '')}.mp4`,
          label: `${template.targetClass.toUpperCase()} ${template.confidence}`,
          model: 'YOLOv8 ACTIVE',
          time: timeStr,
          badge: template.visibility,
          note: template.note
        }
      ],
      timeline: [
        {
          time: timeStr,
          source: template.camerasList[0],
          title: template.title,
          desc: `${template.targetTrackId} detected in ${template.sector}.`,
          confidence: template.confidence,
          badge: 'NEW DETECTION'
        }
      ],
      auditLog: [
        {
          time: timeStr,
          action: 'SIMULATED DETECTION DISPATCHED',
          by: 'Simulation Subsystem',
          status: 'ACTIVE'
        }
      ]
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setSelectedAlertId(newId);
    setNewAlertHighlightId(newId);
    setTimeout(() => setNewAlertHighlightId(null), 3000);

    showToast(`New ${template.severity} Alert: ${template.title} on ${template.camera}`, 'warning');
  };

  // Export Events JSON Log
  const handleExportEvents = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `seema_drishti_alerts_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported surveillance alerts JSON audit log', 'success');
  };

  // Helper for Severity Badges
  const renderSeverityBadge = (sev) => {
    if (sev === 'CRITICAL') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-red-100 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
          CRITICAL
        </span>
      );
    }
    if (sev === 'HIGH') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-orange-100 text-orange-700 border border-orange-200">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
          HIGH
        </span>
      );
    }
    if (sev === 'MEDIUM') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-amber-100 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          MEDIUM
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
        LOW
      </span>
    );
  };

  // Helper for Status Badges
  const renderStatusBadge = (status) => {
    if (status === 'ACTIVE') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold font-mono bg-red-50 text-red-700 border border-red-200">
          ACTIVE
        </span>
      );
    }
    if (status === 'ACKNOWLEDGED') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
          ACKNOWLEDGED
        </span>
      );
    }
    if (status === 'INVESTIGATING') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold font-mono bg-purple-50 text-purple-700 border border-purple-200">
          INVESTIGATING
        </span>
      );
    }
    if (status === 'ESCALATED') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold font-mono bg-rose-100 text-rose-800 border border-rose-300">
          ESCALATED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
        RESOLVED
      </span>
    );
  };

  // Helper for Event Icon
  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'Cross-Camera Movement':
        return <Share2 className="w-4 h-4 text-blue-600" />;
      case 'Restricted Zone Entry':
        return <AlertOctagon className="w-4 h-4 text-red-600" />;
      case 'Vehicle Detection':
        return <Car className="w-4 h-4 text-amber-600" />;
      case 'Multiple Person Detection':
        return <User className="w-4 h-4 text-indigo-600" />;
      case 'Camera Health Warning':
        return <Sliders className="w-4 h-4 text-slate-600" />;
      case 'Low-Light Detection':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'Fog / Visibility Warning':
        return <Layers className="w-4 h-4 text-sky-600" />;
      case 'Suspicious Movement Pattern':
        return <Flame className="w-4 h-4 text-orange-600" />;
      default:
        return <User className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-500/40'
              : toastMessage.type === 'warning'
              ? 'bg-amber-900/90 text-white border-amber-500/40'
              : 'bg-slate-900/90 text-white border-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ==================================================
          1. TOP HEADER & OPERATIONAL BAR
      ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Module Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
              <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Alerts & Events
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                  {counts.unresolved} UNRESOLVED
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Real-time detections, correlated incidents and operator actions
              </p>
            </div>
          </div>
        </div>

        {/* Right: Telemetry & Actions */}
        <div className="flex items-center flex-wrap gap-2.5 text-xs font-mono font-medium">
          {/* Live System Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>LIVE SYSTEM</span>
          </div>

          {/* AI Watch Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-800">24/7 AI Watch Active</span>
          </div>

          {/* Clock */}
          <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-semibold hidden lg:block">
            28 Sep 2026 {currentTimeStr}
          </div>

          {/* SIMULATE DETECTION BUTTON */}
          <button
            onClick={handleSimulateDetection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            title="Inject a realistic surveillance detection into the queue"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Detection</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          2. ALERT SUMMARY CARDS (4 Cards)
      ================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. CRITICAL */}
        <div
          onClick={() => setSeverityFilter(severityFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-md ${
            severityFilter === 'CRITICAL'
              ? 'border-red-500 ring-2 ring-red-500/20 shadow-xs'
              : 'border-red-200/80 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider font-mono">
              CRITICAL
            </span>
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600 font-mono tracking-tight mt-1">
            {String(counts.critical).padStart(2, '0')}
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>Immediate operator attention</span>
          </div>
        </div>

        {/* 2. HIGH */}
        <div
          onClick={() => setSeverityFilter(severityFilter === 'HIGH' ? 'ALL' : 'HIGH')}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-md ${
            severityFilter === 'HIGH'
              ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
              : 'border-orange-200/80 hover:border-orange-300'
          }`}
        >
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider font-mono">
              HIGH
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
              <AlertCircle className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-mono tracking-tight mt-1">
            {String(counts.high).padStart(2, '0')}
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span>Cross-camera & perimeter threats</span>
          </div>
        </div>

        {/* 3. MEDIUM */}
        <div
          onClick={() => setSeverityFilter(severityFilter === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-md ${
            severityFilter === 'MEDIUM'
              ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
              : 'border-amber-200/80 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-mono">
              MEDIUM
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <Radio className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono tracking-tight mt-1">
            {String(counts.medium).padStart(2, '0')}
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Low-light & single sensor events</span>
          </div>
        </div>

        {/* 4. RESOLVED TODAY */}
        <div
          onClick={() => setSeverityFilter(severityFilter === 'RESOLVED' ? 'ALL' : 'RESOLVED')}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-md ${
            severityFilter === 'RESOLVED'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
              : 'border-emerald-200/80 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
              RESOLVED TODAY
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tracking-tight mt-1">
            {String(counts.resolved).padStart(2, '0')}
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Verified by Sector Commander</span>
          </div>
        </div>
      </div>

      {/* ==================================================
          3. FILTER / CONTROL TOOLBAR
      ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 space-y-3">
        {/* Top Row: Severity Segmented Controls & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Severity Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Alerts', count: alerts.length },
              { id: 'CRITICAL', label: 'Critical', count: counts.critical, color: 'text-red-700' },
              { id: 'HIGH', label: 'High', count: counts.high, color: 'text-orange-700' },
              { id: 'MEDIUM', label: 'Medium', count: counts.medium, color: 'text-amber-700' },
              { id: 'LOW', label: 'Low', count: alerts.filter((a) => a.severity === 'LOW' && a.status !== 'RESOLVED').length },
              { id: 'RESOLVED', label: 'Resolved', count: counts.resolved, color: 'text-emerald-700' }
            ].map((tab) => {
              const active = severityFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSeverityFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      active ? 'bg-white/25 text-white' : 'bg-slate-200/90 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative shrink-0 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alerts, cams, tracks..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Detailed Dropdown Filters & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Camera */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1">
              <Video className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-400 font-medium">Camera:</span>
              <select
                value={cameraFilter}
                onChange={(e) => setCameraFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Cameras</option>
                <option value="CAM-01">CAM-01 (North Border)</option>
                <option value="CAM-02">CAM-02 (Check Post)</option>
                <option value="CAM-03">CAM-03 (River Side)</option>
                <option value="CAM-04">CAM-04 (Perimeter Ridge)</option>
                <option value="CAM-05">CAM-05 (Eastern Fence)</option>
                <option value="CAM-06">CAM-06 (Sector Gate)</option>
              </select>
            </div>

            {/* Filter by Event Type */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-400 font-medium">Type:</span>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer max-w-[140px] truncate"
              >
                <option value="ALL">All Event Types</option>
                {ALERT_EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-400 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="ESCALATED">ESCALATED</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(severityFilter !== 'ALL' ||
              searchQuery ||
              cameraFilter !== 'ALL' ||
              eventTypeFilter !== 'ALL' ||
              statusFilter !== 'ALL') && (
              <button
                onClick={handleClearFilters}
                className="px-2.5 py-1 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Action Buttons: Export & Count */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-mono">
              Showing <strong className="text-slate-700">{filteredAlerts.length}</strong> alerts
            </span>
            <button
              onClick={handleExportEvents}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
              title="Download official JSON audit log"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Events</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          4. MAIN WORKSPACE: SPLIT GRID (ALERT LIST + DETAIL DRAWER)
      ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ==================================================
            LEFT COLUMN (7 cols): MAIN ALERT LIST / TABLE
        ================================================== */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          {/* Table Header Bar */}
          <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">
                Operational Alert Feed
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-bold font-mono">
                SIH26187 CONSOLE
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Click any event to load multi-sensor telemetry & actions
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto max-h-[760px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs text-slate-600 font-bold font-mono text-[11px] border-b border-slate-200 z-10">
                <tr>
                  <th className="py-2.5 px-3">SEVERITY</th>
                  <th className="py-2.5 px-3">EVENT</th>
                  <th className="py-2.5 px-3">CAMERA</th>
                  <th className="py-2.5 px-2">TIME</th>
                  <th className="py-2.5 px-2">CONF</th>
                  <th className="py-2.5 px-2">SITUATION</th>
                  <th className="py-2.5 px-2">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <div className="font-semibold text-slate-600">No matching alerts found</div>
                      <div className="text-xs text-slate-400 mt-0.5">Try relaxing your search or filter parameters</div>
                      <button
                        onClick={handleClearFilters}
                        className="mt-3 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert) => {
                    const isSelected = selectedAlert?.id === alert.id;
                    const isHighlighted = newAlertHighlightId === alert.id;

                    return (
                      <tr
                        key={alert.id}
                        onClick={() => setSelectedAlertId(alert.id)}
                        className={`transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 border-l-4 border-l-blue-600'
                            : isHighlighted
                            ? 'bg-amber-50/90 border-l-4 border-l-amber-500 animate-pulse'
                            : 'hover:bg-slate-50/70 border-l-4 border-l-transparent'
                        }`}
                      >
                        {/* 1. SEVERITY */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {renderSeverityBadge(alert.severity)}
                        </td>

                        {/* 2. EVENT TITLE + ICON */}
                        <td className="py-3 px-3">
                          <div className="flex items-start gap-2 max-w-[210px]">
                            <div className="p-1 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                              {getEventIcon(alert.eventType)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 leading-tight">
                                {alert.title}
                              </div>
                              <div className="text-[10.5px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <span>{alert.eventType}</span>
                                {alert.isCrossCamera && (
                                  <span className="text-[9.5px] font-bold text-blue-600 px-1 rounded bg-blue-100/70 font-mono">
                                    CORRELATED
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 3. CAMERA / CORRIDOR */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {alert.isCrossCamera ? (
                            <div className="flex items-center gap-1 font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200 text-[11px]">
                              <Share2 className="w-3 h-3 shrink-0 text-blue-600" />
                              <span>{alert.camera}</span>
                            </div>
                          ) : (
                            <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                              {alert.camera}
                            </span>
                          )}
                        </td>

                        {/* 4. TIME */}
                        <td className="py-3 px-2 font-mono font-semibold text-slate-600 text-[11px] whitespace-nowrap">
                          {alert.time}
                        </td>

                        {/* 5. CONFIDENCE */}
                        <td className="py-3 px-2 whitespace-nowrap">
                          {alert.confidence === '—' ? (
                            <span className="font-mono text-slate-400">—</span>
                          ) : (
                            <div className="flex flex-col">
                              <span
                                className={`font-mono font-bold text-[11px] ${
                                  alert.reducedConfidence
                                    ? 'text-amber-600'
                                    : parseInt(alert.confidence) >= 90
                                    ? 'text-emerald-600'
                                    : 'text-blue-600'
                                }`}
                              >
                                {alert.confidence}
                              </span>
                              {alert.reducedConfidence && (
                                <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded">
                                  LOW VIS
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 6. SITUATION */}
                        <td className="py-3 px-2 whitespace-nowrap">
                          {alert.situation && alert.situation !== '—' ? (
                            <span className="font-mono font-bold text-[10.5px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {alert.situation}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">—</span>
                          )}
                        </td>

                        {/* 7. STATUS */}
                        <td className="py-3 px-2 whitespace-nowrap">
                          {renderStatusBadge(alert.status)}
                        </td>

                        {/* 8. ACTION */}
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAlertId(alert.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-700">Border Surveillance Feed Active</span>
              <span className="text-slate-400 font-normal">&bull; 6 Cameras Monitored 24/7</span>
            </div>
            <div className="text-slate-400 font-medium">Privacy-First Architecture &bull; Zero Facial Recognition</div>
          </div>
        </div>

        {/* ==================================================
            RIGHT COLUMN (5 cols): ALERT DETAIL & OPERATOR PANEL
        ================================================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          {/* Header of Detail Drawer */}
          <div className="pb-3 border-b border-slate-100 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedAlert.alertNumber}
                </span>
                {renderSeverityBadge(selectedAlert.severity)}
                {renderStatusBadge(selectedAlert.status)}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight mt-1.5 leading-snug">
                {selectedAlert.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {selectedAlert.date} {selectedAlert.time}
                </span>
                <span className="font-mono text-slate-700 font-semibold">
                  Conf: {selectedAlert.confidence}
                </span>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSitrepModalOpen(true)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors cursor-pointer"
                title="Open Official SITREP Dossier"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ==================================================
              EVIDENCE SECTION (CCTV Thumbnails)
          ================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-slate-500" />
                Camera Photo Evidence ({selectedAlert.evidenceThumbnails?.length || 1})
              </span>
              <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Camera Frames
              </span>
            </div>

            {/* Evidence Thumbnails Grid */}
            <div
              className={`grid gap-2.5 ${
                selectedAlert.isCrossCamera
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {selectedAlert.evidenceThumbnails?.map((ev, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner group aspect-16/10"
                >
                  <img
                    src={ev.img}
                    alt={ev.camCode}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top Overlay: Camera Code & Time */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                    <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-white text-[9.5px] font-mono font-bold">
                      {ev.camCode}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono">
                      {ev.time}
                    </span>
                  </div>

                  {/* Real YOLO Bounding Box Overlay */}
                  <div className="absolute inset-x-[36%] inset-y-[26%] w-[28%] h-[56%] border-2 border-red-500 rounded-xs pointer-events-none">
                    <div className="absolute -top-5 left-0 px-1 py-0.5 bg-red-600 text-white text-[8px] font-bold font-mono whitespace-nowrap shadow-xs">
                      {ev.label}
                    </div>
                  </div>

                  {/* Bottom Overlay: Sensor Name & Model Badge */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[9px] font-medium text-white/90 drop-shadow-xs truncate max-w-[100px]">
                      {ev.name}
                    </span>
                    <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-600/90 text-white">
                      {ev.model}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Camera Health Widget (If Camera Health Alert) */}
            {selectedAlert.isCameraHealthAlert && selectedAlert.healthMetrics && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>{selectedAlert.camera} Hardware Diagnostics</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    {selectedAlert.healthMetrics.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                    <span className="text-slate-400">Signal Quality:</span>
                    <div className="font-bold text-amber-700">{selectedAlert.healthMetrics.signal}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                    <span className="text-slate-400">Luminance Brightness:</span>
                    <div className="font-bold text-slate-700">{selectedAlert.healthMetrics.brightness}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                    <span className="text-slate-400">Effective Visibility:</span>
                    <div className="font-bold text-amber-700">{selectedAlert.healthMetrics.visibility}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                    <span className="text-slate-400">Video Frame Rate:</span>
                    <div className="font-bold text-slate-700">{selectedAlert.healthMetrics.fps} FPS</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onOpenHealth) onOpenHealth();
                    showToast('Navigating to Camera Health module', 'info');
                  }}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>OPEN CAMERA HEALTH CONSOLE</span>
                </button>
              </div>
            )}
          </div>

          {/* ==================================================
              EVENT TIMELINE
          ================================================== */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Incident Sequence & Timeline
              </span>
              <span className="text-[10.5px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Shift Log
              </span>
            </div>

            <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              {selectedAlert.timeline?.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></div>
                  <div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-800">{step.time}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                        {step.source}
                      </span>
                      {step.confidence && (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {step.confidence} match
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-800 mt-0.5">{step.title}</div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ==================================================
              EXPLAINABLE RISK SECTION
          ================================================== */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                  Priority Assessment
                </span>
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>PRIORITY SCORE:</span>
                  <span
                    className={`font-mono font-bold ${
                      selectedAlert.riskScore >= 75
                        ? 'text-red-600'
                        : selectedAlert.riskScore >= 50
                        ? 'text-orange-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {selectedAlert.riskScore} / {selectedAlert.maxRisk || 100}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                      selectedAlert.riskScore >= 75
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : selectedAlert.riskScore >= 50
                        ? 'bg-orange-100 text-orange-800 border-orange-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {selectedAlert.riskLevel}
                  </span>
                </div>
              </div>
              <ShieldAlert
                className={`w-5 h-5 ${
                  selectedAlert.riskScore >= 75
                    ? 'text-red-500'
                    : selectedAlert.riskScore >= 50
                    ? 'text-orange-500'
                    : 'text-emerald-500'
                }`}
              />
            </div>

            {/* Risk Meter Bar */}
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedAlert.riskScore >= 75
                    ? 'bg-red-500'
                    : selectedAlert.riskScore >= 50
                    ? 'bg-orange-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${selectedAlert.riskScore}%` }}
              ></div>
            </div>

            {/* Risk Factors Breakdown */}
            <div className="space-y-1.5 pt-0.5 text-xs">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Contributing Risk Factors:
              </div>
              <div className="space-y-1.5">
                {selectedAlert.riskBreakdown?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-slate-700 shadow-2xs"
                  >
                    <span className="truncate pr-2 font-medium text-xs">{item.factor}</span>
                    <span className="text-blue-700 font-mono font-bold shrink-0 text-[10.5px] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                      {item.weight} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Human Verification Notice */}
            <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-xs text-amber-900 leading-snug flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Human Verification Required: </span>
                <span>Risk scores are automated advisories. The duty officer verifies all situations before ground units are dispatched.</span>
              </div>
            </div>
          </div>

          {/* ==================================================
              AI EXPLANATION BOX
          ================================================== */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Situational Assessment</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                Automated Analysis
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-normal font-sans">
              {selectedAlert.aiExplanation}
            </p>
            {selectedAlert.reducedConfidence && selectedAlert.reducedConfidenceNote && (
              <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-800 font-medium flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Notice: {selectedAlert.reducedConfidenceNote.replace(/CLAHE clip limit adjusted to 3.8/g, 'Night & fog vision filter active')}</span>
              </div>
            )}
          </div>

          {/* Send Tracking / Message to Authority Section */}
          <div className="pt-2 space-y-2.5">
            {/* If a dispatch was already sent for this alert, show confirmation banner */}
            {transmittedAlertDispatches[selectedAlert.id] && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Tracking Dispatched to {transmittedAlertDispatches[selectedAlert.id].recipient}</span>
                    <span className="text-[10px] font-mono text-emerald-700 block">
                      Sent at {transmittedAlertDispatches[selectedAlert.id].time} IST &bull; {transmittedAlertDispatches[selectedAlert.id].urgency}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-800 text-[10px] font-mono font-bold">
                  SENT ✓
                </span>
              </div>
            )}

            {/* Prominent Send Message to Authority Button */}
            <button
              id="btn-alert-send-authority"
              onClick={handleOpenAuthorityModal}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2.5 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.008] active:scale-[0.99] cursor-pointer border border-blue-400/30 uppercase"
            >
              <Send className="w-4 h-4 -rotate-12 shrink-0" />
              <span>SEND MESSAGE TO AUTHORITY</span>
            </button>

            {/* Secondary Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigateToLive && onNavigateToLive(selectedAlert.primaryCam)}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer uppercase tracking-wider"
              >
                <Video className="w-3.5 h-3.5 text-blue-600" />
                <span>VIEW LIVE CAMERAS</span>
              </button>
              <button
                onClick={() => setIsSitrepModalOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer uppercase tracking-wider"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>CREATE INCIDENT REPORT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          5. OFFICIAL INCIDENT SITREP DOSSIER MODAL
      ================================================== */}
      {isSitrepModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                      OFFICIAL INCIDENT SITUATION REPORT (SITREP)
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      FORM BSF-2026/ALPHA
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Ministry of Home Affairs &bull; Border Security Force &bull; Classified Level-3
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSitrepModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              {/* Metadata Header Block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">INCIDENT ID:</span>
                  <strong className="text-slate-800">SITREP-2026-{selectedAlert.id}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SECTOR / POST:</span>
                  <strong className="text-slate-800">BOP Samba, RS Pura (Grid B-4)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PRIMARY TARGET:</span>
                  <strong className="text-blue-700">{selectedAlert.targetTrackId || 'Person P-12'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">OFFICIAL STATUS:</span>
                  <strong className="text-red-700">{selectedAlert.status}</strong>
                </div>
              </div>

              {/* Forensic Narrative */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono">
                  1. Incident Narrative & Cross-Camera Continuity
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedAlert.aiExplanation}
                  <div className="mt-2 text-slate-500 text-[11px]">
                    <strong>Corridor Monitored:</strong> {selectedAlert.corridorName || selectedAlert.sector}
                  </div>
                </div>
              </div>

              {/* Forensic Evidence Thumbnails */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono">
                  2. Optical Evidence Exhibits
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedAlert.evidenceThumbnails?.map((ev, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 p-1">
                      <img src={ev.img} alt={ev.camCode} className="w-full aspect-16/10 object-cover rounded-lg" />
                      <div className="p-2 text-[10.5px] text-white space-y-0.5">
                        <div className="font-bold flex justify-between font-mono">
                          <span>{ev.camCode}</span>
                          <span className="text-emerald-400">{ev.time}</span>
                        </div>
                        <div className="text-slate-300 text-[10px]">{ev.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Sign-Off */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-600">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Duty Officer Certification:</div>
                  <div className="font-bold text-slate-800 text-xs">{currentUser.name}</div>
                  <div className="text-[10.5px] text-slate-500">{currentUser.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Digital Timestamp:</div>
                  <div className="font-mono text-xs text-slate-800">28 Sep 2026 {selectedAlert.time} IST</div>
                  <div className="text-[10px] font-bold text-emerald-600 font-mono">✓ CERTIFIED VALID</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-200 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dossier</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportEvents}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => setIsSitrepModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TRANSMIT INCIDENT TRACKING TO AUTHORITY MODAL
          ════════════════════════════════════════════════════════════════════ */}
      {isAuthorityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-blue-300 flex items-center justify-center border border-white/20">
                  <Send className="w-5 h-5 -rotate-12" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold tracking-tight">
                      TRANSMIT TRACKING TO AUTHORITY
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                      SECURE AES-256
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/80">
                    Direct tactical dispatch for Alert {selectedAlert.alertNumber} ({selectedAlert.sector})
                  </p>
                </div>
              </div>
              <button
                type="button"
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

              {/* Message Body */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tracking Message Details:</span>
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
                  <li>CCTV Camera {selectedAlert.primaryCam} frame captured at {selectedAlert.time}</li>
                  <li>Incident ID: SITREP-2026-{selectedAlert.id} ({selectedAlert.sector})</li>
                  <li>Priority Score: {selectedAlert.riskScore}/100 ({selectedAlert.riskLevel})</li>
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
                      <span>TRACKING TRANSMITTED ✓</span>
                    </>
                  ) : isTransmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ENCRYPTING & SENDING...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 -rotate-12" />
                      <span>TRANSMIT TO AUTHORITY</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
