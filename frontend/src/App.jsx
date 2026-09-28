import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DemoController from './components/DemoController';
import CCTVGrid from './components/CCTVGrid';
import RecentEventsBar from './components/RecentEventsBar';
import StorylineModal from './components/StorylineModal';
import VideoEnhancementModal from './components/VideoEnhancementModal';
import ConnectCameraModal from './components/ConnectCameraModal';
import ByteTrackInfoModal from './components/ByteTrackInfoModal';
import NotificationModal from './components/NotificationModal';
import EventMemoryModal from './components/EventMemoryModal';
import DetectionDebugModal from './components/DetectionDebugModal';
import DetectionTestLab from './components/DetectionTestLab';
import LoginScreen from './components/LoginScreen';
import CameraExpandModal from './components/CameraExpandModal';
import CrossCameraNetwork from './components/CrossCameraNetwork';
import AlertsEventsModule from './components/AlertsEventsModule';
import CameraHealthModule from './components/CameraHealthModule';

import {
  INITIAL_CAMERAS,
  INITIAL_SITUATION,
  INITIAL_EVENT_MEMORY,
  DEMO_SCENARIO_STEPS,
  RECENT_EVENTS
} from './data/surveillanceData';

export default function App() {
  // Authentication State — initialized with Commandant profile for instant dashboard access, logout switches to LoginScreen
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('seema_drishti_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      username: 'operator@drishti.gov.in',
      name: 'Commandant R. K. Sharma',
      role: 'Border Commander (Sector Alpha-Foxtrot)'
    };
  });

  // Navigation & View State
  const [activeTab, setActiveTab] = useState('live');
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [situation, setSituation] = useState(INITIAL_SITUATION);
  const [eventMemory, setEventMemory] = useState(INITIAL_EVENT_MEMORY);
  const [recentEvents, setRecentEvents] = useState(RECENT_EVENTS);

  // Real Model Telemetry State
  const [modelStatus, setModelStatus] = useState('MODEL ACTIVE');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.35);
  const [telemetryMap, setTelemetryMap] = useState({});

  // Debug Modal State
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const [debugCamera, setDebugCamera] = useState(null);

  // Demo Scenario State (Steps 1 to 6)
  const [demoStep, setDemoStep] = useState(6);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(true);

  // Alert State
  const [isAlertAcknowledged, setIsAlertAcknowledged] = useState(false);
  const [unresolvedAlertsCount, setUnresolvedAlertsCount] = useState(12);

  // Modals State
  const [isSituationModalOpen, setIsSituationModalOpen] = useState(false);
  const [isEnhanceModalOpen, setIsEnhanceModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isByteTrackModalOpen, setIsByteTrackModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isEventMemoryModalOpen, setIsEventMemoryModalOpen] = useState(false);

  // Selected camera for inspect/enhance
  const [selectedCamera, setSelectedCamera] = useState(INITIAL_CAMERAS[1]);
  const [focusedCamId, setFocusedCamId] = useState(null);

  // Camera Expand Surveillance Modal State (Requirement 3)
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false);
  const [expandedCamera, setExpandedCamera] = useState(null);

  // Toast alert feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronized Surveillance Clock String (matching 03:41:12 format)
  const [timeStr, setTimeStr] = useState('03:41:12');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setTimeStr(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll Real-Time YOLO Telemetry from Backend
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/cctv/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (data.cameras) setTelemetryMap(data.cameras);
          if (data.confidence_threshold !== undefined) setConfidenceThreshold(data.confidence_threshold);
          if (data.model_status) setModelStatus(data.model_status === 'ACTIVE' ? 'MODEL ACTIVE' : 'MODEL OFFLINE');
        }
      } catch (err) {
        // Backend offline
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll Real Cross-Camera Events & Situation from Backend
  useEffect(() => {
    const fetchEventsAndSituation = async () => {
      try {
        const sRes = await fetch('http://127.0.0.1:8000/api/situation');
        if (sRes.ok) {
          const sData = await sRes.json();
          setSituation((prev) => ({
            ...prev,
            situationCode: sData.situation_code || prev.situationCode,
            targetTrackId: sData.target_track_id || prev.targetTrackId,
            sightingsCount: sData.sightings_count || prev.sightingsCount,
            trajectorySummary: sData.trajectory_summary || prev.trajectorySummary,
            trajectoryChain: sData.trajectory_chain?.length ? sData.trajectory_chain : prev.trajectoryChain,
            riskAssessment: {
              ...prev.riskAssessment,
              level: sData.risk_assessment?.level || prev.riskAssessment.level,
              score: sData.risk_assessment?.score || prev.riskAssessment.score,
              reason: sData.risk_assessment?.reason || prev.riskAssessment.reason,
              ruleBreakdown: sData.risk_assessment?.rule_breakdown || prev.riskAssessment.ruleBreakdown
            },
            aiExplanation: sData.ai_explanation || prev.aiExplanation,
            operatorStatus: sData.operator_status || prev.operatorStatus
          }));
        }

        const eRes = await fetch('http://127.0.0.1:8000/api/events');
        if (eRes.ok) {
          const eData = await eRes.json();
          if (Array.isArray(eData) && eData.length > 0) {
            setEventMemory(eData);
          }
        }
      } catch (err) {}
    };

    fetchEventsAndSituation();
    const interval = setInterval(fetchEventsAndSituation, 2500);
    return () => clearInterval(interval);
  }, []);

  // Synchronize Demo Step with Cameras & Risk Score
  const handleSetDemoStep = (step) => {
    setDemoStep(step);
    const stepData = DEMO_SCENARIO_STEPS.find(s => s.step === step) || DEMO_SCENARIO_STEPS[5];

    // Focus camera according to the operational story
    if (step === 1) setFocusedCamId('cam_1');
    else if (step === 2) setFocusedCamId('cam_3');
    else if (step === 3) setFocusedCamId('cam_5');
    else setFocusedCamId(null);

    setSituation((prev) => ({
      ...prev,
      riskAssessment: {
        ...prev.riskAssessment,
        score: stepData.currentRisk,
        level: stepData.riskLevel,
        reason: step >= 5
          ? 'Sequential sightings detected across monitored sectors within a short time interval.'
          : step >= 3
          ? 'Related sighting observed traversing Sector Alpha to Echo.'
          : 'Isolated detection under observation.'
      },
      aiExplanation: stepData.explanation
    }));

    // Notify backend if online
    fetch(`http://127.0.0.1:8000/api/demo/step/${step}`, { method: 'POST' }).catch(() => {});
    showToast(`Demo Scenario set to Step ${step}: ${stepData.title}`, 'info');
  };

  // Auto-play demo scenario timer
  useEffect(() => {
    if (!isPlayingDemo) return;

    const timer = setInterval(() => {
      setDemoStep((prev) => {
        if (prev >= 6) {
          setIsPlayingDemo(false);
          return 6;
        }
        const next = prev + 1;
        handleSetDemoStep(next);
        return next;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlayingDemo]);

  // Operator Verification Handlers
  const handleVerify = () => {
    const updated = {
      ...situation,
      operatorStatus: 'VERIFIED',
      verifiedAt: timeStr
    };
    setSituation(updated);
    showToast('OPERATOR DECISION: Verified as legitimate intrusion threat.', 'success');

    fetch('http://127.0.0.1:8000/api/situation/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'VERIFY' })
    }).catch(() => {});
  };

  const handleDismiss = () => {
    const updated = {
      ...situation,
      operatorStatus: 'DISMISSED',
      verifiedAt: timeStr
    };
    setSituation(updated);
    showToast('OPERATOR DECISION: Dismissed as benign / false alarm.', 'info');

    fetch('http://127.0.0.1:8000/api/situation/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DISMISS' })
    }).catch(() => {});
  };

  const handleEscalate = () => {
    const updated = {
      ...situation,
      operatorStatus: 'ESCALATED',
      verifiedAt: timeStr
    };
    setSituation(updated);
    showToast('OPERATOR DECISION: ESCALATED TO BORDER COMMAND & QRT!', 'warning');

    setRecentEvents((prev) => [
      {
        id: Date.now(),
        time: timeStr.slice(0, 5),
        text: 'COMMAND ESCALATION: Situation #024 dispatched to QRT Alpha',
        color: 'bg-red-500'
      },
      ...prev
    ]);

    fetch('http://127.0.0.1:8000/api/situation/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ESCALATE' })
    }).catch(() => {});
  };

  const handleAcknowledgeAlert = () => {
    setIsAlertAcknowledged(!isAlertAcknowledged);
    showToast(
      !isAlertAcknowledged
        ? 'High Risk Alert acknowledged by operator.'
        : 'Alert returned to active state.',
      'info'
    );
  };

  // Camera Management
  const handleOpenEnhance = (camera) => {
    setSelectedCamera(camera || cameras[2]);
    setIsEnhanceModalOpen(true);
  };

  const handleOpenConnect = (camera) => {
    setSelectedCamera(camera || cameras[0]);
    setIsConnectModalOpen(true);
  };

  const handleOpenDebug = (camera) => {
    setDebugCamera(camera || cameras[0]);
    setIsDebugModalOpen(true);
  };

  const handleUpdateCameraEnhancement = (camId, settings) => {
    setCameras((prev) =>
      prev.map((c) =>
        c.id === camId
          ? {
              ...c,
              ...settings,
              qualityBadge: settings.claheActive ? 'ENHANCED' : c.qualityBadge
            }
          : c
      )
    );
    showToast(`Updated enhancement for ${cameras.find(c => c.id === camId)?.name || camId}`, 'success');
  };

  const handleConnectWebcam = (camId, stream) => {
    setCameras((prev) =>
      prev.map((c) =>
        c.id === camId
          ? {
              ...c,
              sourceType: 'webcam',
              mediaStream: stream,
              detectionMode: 'REAL DETECTION',
              status: 'Online'
            }
          : c
      )
    );
    showToast(`Live Physical WebCam active on ${cameras.find(c => c.id === camId)?.name}!`, 'success');
  };

  const handleConnectVideoFile = (camId, fileUrl, fileName) => {
    setCameras((prev) =>
      prev.map((c) =>
        c.id === camId
          ? {
              ...c,
              sourceType: 'file',
              mediaStream: fileUrl,
              detectionMode: 'REAL DETECTION',
              status: 'Online'
            }
          : c
      )
    );
    showToast(`Video "${fileName}" loaded into ${cameras.find(c => c.id === camId)?.name}!`, 'success');
  };

  const handleConnectRtsp = (camId, rtspUrl) => {
    setCameras((prev) =>
      prev.map((c) =>
        c.id === camId
          ? {
              ...c,
              sourceType: 'rtsp',
              detectionMode: 'REAL DETECTION',
              status: 'Online'
            }
          : c
      )
    );
    showToast(`RTSP Stream bound to ${cameras.find(c => c.id === camId)?.name}!`, 'success');
  };

  const handleResetSimulated = (camId) => {
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === camId) {
          const orig = INITIAL_CAMERAS.find((x) => x.id === camId);
          return { ...orig };
        }
        return c;
      })
    );
    showToast(`Reset ${camId} to simulated surveillance feed`, 'info');
  };

  // Logout handler returning immediately to Login page
  const handleLogout = () => {
    try {
      localStorage.removeItem('seema_drishti_user');
      sessionStorage.removeItem('seema_drishti_user');
    } catch (e) {}
    setCurrentUser(null);
    setActiveTab('live');
    showToast('Signed out from command terminal', 'info');
  };

  // If user is not authenticated, display the Seema Drishti Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={(user) => {
          try {
            localStorage.setItem('seema_drishti_user', JSON.stringify(user));
          } catch (e) {}
          setCurrentUser(user);
          showToast(`Access Granted. Welcome, ${user.name}`, 'success');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f8] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header with Model Status Indicator & Operator Profile */}
      <Header
        alertCount={unresolvedAlertsCount}
        modelStatus={modelStatus}
        confidenceThreshold={confidenceThreshold}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenDetectionTest={() => setActiveTab('settings')}
        currentUser={currentUser}
        onLogout={handleLogout}
        isDemoActive={isDemoActive}
        onToggleDemoMode={() => {
          setIsDemoActive((prev) => !prev);
          showToast(
            !isDemoActive
              ? 'SIH Demo Mode engaged: Situation #024 incident story active.'
              : 'SIH Demo Mode paused.',
            'info'
          );
        }}
      />

      {/* 2. Main Layout (Sidebar + Command Center Content) */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenStory={() => setIsSituationModalOpen(true)}
          onOpenEnhance={() => handleOpenEnhance(cameras[2])}
          onOpenConnect={() => handleOpenConnect(cameras[0])}
          onLogout={handleLogout}
          unresolvedAlertsCount={unresolvedAlertsCount}
        />

        {/* Center/Main Dashboard Content */}
        <main className="flex-1 p-6 space-y-5 overflow-x-hidden">

          {/* Persistent SIH Demo Mode Notification & Direct Access (when navigating other modules) */}
          {isDemoActive && activeTab !== 'live' && (
            <div className="bg-white rounded-2xl border border-blue-200 shadow-2xs p-3.5 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10.5px] font-bold font-mono tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  SIH DEMO MODE ACTIVE &bull; SITUATION #024
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {DEMO_SCENARIO_STEPS[demoStep - 1]?.title}:
                </span>
                <span className="text-xs text-slate-600 hidden sm:inline">
                  {DEMO_SCENARIO_STEPS[demoStep - 1]?.simpleStory}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('live');
                    const el = document.getElementById('cctv-grid-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Return to Incident Story</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
          
          {/* TAB: ALERTS & EVENTS DEDICATED MODULE */}
          {activeTab === 'alerts' ? (
            <section>
              <AlertsEventsModule
                cameras={cameras}
                currentTimeStr={timeStr}
                modelStatus={modelStatus}
                currentUser={currentUser}
                onNavigateToLive={(camCode) => {
                  setActiveTab('live');
                  if (camCode) {
                    const cid = camCode.toLowerCase().replace('-', '_');
                    setFocusedCamId(cid);
                  }
                }}
                onOpenHealth={() => setActiveTab('health')}
                onSelectCamera={(cam) => {
                  setExpandedCamera(cam);
                  setIsExpandModalOpen(true);
                }}
                onUpdateUnresolvedCount={(cnt) => setUnresolvedAlertsCount(cnt)}
              />
            </section>
          ) : activeTab === 'health' ? (
            /* TAB: CAMERA HEALTH MODULE */
            <section>
              <CameraHealthModule
                cameras={cameras}
                onSelectCamera={(cam) => {
                  setExpandedCamera(cam);
                  setIsExpandModalOpen(true);
                }}
                onNavigateToAlerts={() => setActiveTab('alerts')}
                onNavigateToNetwork={() => setActiveTab('network')}
                onNavigateToLive={(cam) => {
                  setActiveTab('live');
                  if (cam) setFocusedCamId(cam.id);
                }}
                onUpdateCameraEnhancement={handleUpdateCameraEnhancement}
                currentTimeStr={timeStr}
              />
            </section>
          ) : activeTab === 'settings' ? (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    System Settings & Detection Test Laboratory
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Execute real Ultralytics YOLOv8 inference on custom files or verify Acceptance Tests 1 through 5.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('live')}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
                >
                  ← Return to Live Grid
                </button>
              </div>

              <DetectionTestLab
                currentModelStatus={modelStatus}
                onModelStatusChange={(st) => setModelStatus(st)}
              />
            </section>
          ) : activeTab === 'network' ? (
            /* TAB 2: DEDICATED CROSS-CAMERA NETWORK MODULE */
            <section className="space-y-4">
              <CrossCameraNetwork
                cameras={cameras}
                telemetryMap={telemetryMap}
                currentTimeStr={timeStr}
                situation={situation}
                onNavigateToLive={(cam) => {
                  setActiveTab('live');
                  if (cam) setFocusedCamId(cam.id);
                }}
                onSelectCamera={(cam) => {
                  setExpandedCamera(cam);
                  setIsExpandModalOpen(true);
                }}
                onVerify={handleVerify}
                onDismiss={handleDismiss}
                onEscalate={handleEscalate}
              />
            </section>
          ) : (
            /* TAB 3: LIVE SURVEILLANCE COMMAND CENTER */
            <>
              {/* REQUIREMENT 10: DEMO SCENARIO CONTROLLER */}
              <section>
                <DemoController
                  currentStep={demoStep}
                  onSetStep={handleSetDemoStep}
                  isPlaying={isPlayingDemo}
                  onTogglePlay={() => setIsPlayingDemo(!isPlayingDemo)}
                  onReset={() => handleSetDemoStep(1)}
                />
              </section>

              {/* TOP SECTION: 6 CCTV Screens Grid with Real YOLO Bounding Boxes */}
              <section id="cctv-grid-section">
                <CCTVGrid
                  cameras={cameras}
                  telemetryMap={telemetryMap}
                  currentTimeStr={timeStr}
                  onSelectCamera={(cam) => {
                    setExpandedCamera(cam);
                    setIsExpandModalOpen(true);
                  }}
                  onOpenEnhance={handleOpenEnhance}
                  onOpenConnect={handleOpenConnect}
                  onOpenDebug={handleOpenDebug}
                  onOpenNetworkMap={() => setActiveTab('network')}
                  focusedCamId={focusedCamId}
                  situation={situation}
                />
              </section>

              {/* BOTTOM SECTION: RECENT EVENTS BAR */}
              <section>
                <RecentEventsBar
                  events={recentEvents}
                  onViewAll={() => setIsEventMemoryModalOpen(true)}
                />
              </section>
            </>
          )}

        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 ${
            toastMessage.type === 'warning'
              ? 'bg-amber-900 text-white border-amber-700'
              : toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODALS FOR CORE SURVEILLANCE PIPELINE
          ============================================================== */}

      {/* 1. Situation Review & Evidence Modal */}
      <StorylineModal
        isOpen={isSituationModalOpen}
        onClose={() => setIsSituationModalOpen(false)}
        situation={situation}
        onFocusCamera={(camId) => {
          setFocusedCamId(camId);
          const el = document.getElementById('cctv-grid-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onVerify={handleVerify}
        onDismiss={handleDismiss}
        onEscalate={handleEscalate}
      />

      {/* 2. Video Quality Enhancement Module (OpenCV CLAHE) */}
      <VideoEnhancementModal
        isOpen={isEnhanceModalOpen}
        onClose={() => setIsEnhanceModalOpen(false)}
        cameras={cameras}
        selectedCamera={selectedCamera}
        onUpdateCameraEnhancement={handleUpdateCameraEnhancement}
      />

      {/* 3. Connect Existing CCTV Camera Modal (WebCam / File / RTSP) */}
      <ConnectCameraModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        cameras={cameras}
        selectedCamera={selectedCamera}
        onConnectWebcam={handleConnectWebcam}
        onConnectVideoFile={handleConnectVideoFile}
        onConnectRtsp={handleConnectRtsp}
        onResetSimulated={handleResetSimulated}
      />

      {/* 4. Event Memory Store Modal */}
      <EventMemoryModal
        isOpen={isEventMemoryModalOpen}
        onClose={() => setIsEventMemoryModalOpen(false)}
        events={eventMemory}
        onFocusCamera={(camId) => {
          setFocusedCamId(camId);
          const el = document.getElementById('cctv-grid-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 5. ByteTrack Architecture & Privacy Info Modal */}
      <ByteTrackInfoModal
        isOpen={isByteTrackModalOpen}
        onClose={() => setIsByteTrackModalOpen(false)}
      />

      {/* 6. Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        events={recentEvents}
        onOpenStory={() => setIsSituationModalOpen(true)}
      />

      {/* 7. REQUIREMENT 7: [Detection Debug] Modal */}
      <DetectionDebugModal
        isOpen={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
        camera={debugCamera || cameras[0]}
        confidenceThreshold={confidenceThreshold}
      />

      {/* 8. REQUIREMENT 3: Camera Expand Surveillance Modal */}
      {isExpandModalOpen && expandedCamera && (
        <CameraExpandModal
          camera={expandedCamera}
          telemetry={telemetryMap[expandedCamera.id]}
          currentTimeStr={timeStr}
          onClose={() => setIsExpandModalOpen(false)}
        />
      )}

    </div>
  );
}
