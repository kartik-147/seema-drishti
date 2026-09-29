import React from 'react';
import { 
  Video, Bell, CheckCircle2, FlaskConical, Share2, LogOut 
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenStory, 
  onOpenEnhance, 
  onOpenConnect,
  onLogout,
  unresolvedAlertsCount = 12
}) {
  const navItems = [
    { id: 'live', label: 'Live View', icon: Video },
    { id: 'network', label: 'Cross-Camera Network', icon: Share2 },
    { id: 'alerts', label: 'Alerts & Events', icon: Bell, badge: unresolvedAlertsCount > 0 ? unresolvedAlertsCount : null },
    { id: 'health', label: 'Camera Health', icon: CheckCircle2 },
    { id: 'settings', label: 'Detection Test Lab', icon: FlaskConical },
  ];

  return (
    <aside className="w-56 shrink-0 bg-transparent flex flex-col justify-between py-6 pl-6 pr-2">
      {/* Navigation Links */}
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tactical Quick Actions */}
      <div className="space-y-2 mt-8 pt-4 border-t border-slate-200/80">
        <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Quick Tools
        </div>

        <button
          onClick={onOpenStory}
          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-white/80 hover:text-blue-600 border border-transparent hover:border-slate-200 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Incident Story</span>
        </button>

        <button
          onClick={onOpenEnhance}
          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-white/80 hover:text-blue-600 border border-transparent hover:border-slate-200 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Night / Fog Vision Enhancer</span>
        </button>

        <button
          onClick={onOpenConnect}
          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-white/80 hover:text-blue-600 border border-transparent hover:border-slate-200 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span>Connect CCTV</span>
        </button>

        {/* Sign Out / Exit Terminal */}
        {onLogout && (
          <button
            onClick={onLogout}
            id="sidebar-signout-btn"
            className="w-full mt-3 py-2.5 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:scale-[1.01] active:scale-[0.99]"
            title="Sign out and return to Login Screen"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span>Sign Out Terminal</span>
          </button>
        )}

        {/* Authorship info — custom-built, not a UI template */}
        <div className="p-3 bg-white/70 rounded-xl border border-slate-200/70 text-[11px] text-slate-500 space-y-1 mt-3">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Created by Kartik Bendre
          </div>
          <p className="text-[10.5px] leading-tight text-slate-500">
            Custom engineered border intelligence & video analytics platform
          </p>
        </div>
      </div>
    </aside>
  );
}
