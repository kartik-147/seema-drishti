import React, { useState, useEffect } from 'react';
import { Shield, Bell, LogOut, UserCheck } from 'lucide-react';

export default function Header({ 
  onOpenNotifications, 
  alertCount = 1,
  modelStatus = 'MODEL ACTIVE',
  confidenceThreshold = 0.35,
  onOpenDetectionTest,
  currentUser,
  onLogout,
  onToggleDemoMode,
  isDemoActive = true
}) {
  const [currentTime, setCurrentTime] = useState('01 Jul 2026 14:32');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${day} ${month} ${year} ${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isModelActive = modelStatus === 'MODEL ACTIVE';
  const isModelOffline = modelStatus === 'MODEL OFFLINE';

  return (
    <header className="w-full bg-[#f8fafc]/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand Logo & Title with Emblem */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 shadow-sm shadow-blue-500/25 shrink-0">
          <Shield className="w-6 h-6 text-white stroke-[2.2]" />
          <div className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"></div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2.5">
            <img 
              src="/seema-drishti-logo.png" 
              alt="सीमा Drishti" 
              className="h-10 sm:h-11 w-auto object-contain drop-shadow-xs transition-transform hover:scale-102"
            />
            <span className="hidden sm:inline text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              SIH 2026
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 tracking-wide -mt-0.5">
            Turns separate CCTV detections into one understandable border situation.
          </p>
        </div>
      </div>

      {/* Center/Right: Persistent SIH Demo Mode Button & Telemetry */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* PERSISTENT SIH DEMO MODE BUTTON */}
        <button
          onClick={onToggleDemoMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
            isDemoActive
              ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-400/40 shadow-blue-500/20'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
          title="Toggle Guided SIH 2026 Incident Demonstration (Situation #024)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-mono tracking-wide">SIH DEMO MODE</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-white/20 text-white">
            #024
          </span>
        </button>
        
        {/* REAL MODEL STATUS INDICATOR */}
        <div 
          onClick={onOpenDetectionTest}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border cursor-pointer transition-all hover:shadow-xs ${
            isModelActive
              ? 'text-emerald-700 bg-emerald-50/90 border-emerald-300 hover:bg-emerald-100'
              : isModelOffline
              ? 'text-amber-700 bg-amber-50/90 border-amber-300 hover:bg-amber-100'
              : 'text-red-700 bg-red-50/90 border-red-300 hover:bg-red-100'
          }`}
          title="Smart detection system is continuously scanning cameras for people and vehicles. Click to open test lab."
        >
          <span className="font-mono font-bold text-[10px] tracking-wide text-slate-500">AI WATCH</span>
          <span className="relative flex h-2 w-2">
            {isModelActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isModelActive ? 'bg-emerald-500' : isModelOffline ? 'bg-amber-500' : 'bg-red-500'
            }`}></span>
          </span>
          <span className="font-mono text-[11px] font-bold">
            {isModelActive ? 'WATCH ACTIVE' : isModelOffline ? 'WATCH PAUSED' : 'SYSTEM CHECK'}
          </span>
          <span className="hidden md:inline text-[10.5px] font-mono text-slate-500 border-l border-slate-300/80 pl-2">
            24/7 Scanner
          </span>
        </div>

        {/* Live Date and Time */}
        <div className="text-xs font-medium text-slate-600 tracking-tight font-mono hidden md:block">
          {currentTime}
        </div>

        {/* Notification Bell */}
        <button 
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden cursor-pointer"
          title="Security Notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        {/* Operator Profile & Sign Out Button */}
        {currentUser && (
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name || 'Border Commander'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {currentUser.role || 'Sector Command'}
              </span>
            </div>
            <button
              onClick={onLogout}
              id="header-signout-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-xs font-bold transition-all border border-red-200 hover:border-red-300 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              title="Sign Out to Login Screen"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
