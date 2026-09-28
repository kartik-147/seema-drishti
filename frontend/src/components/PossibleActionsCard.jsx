import React from 'react';
import { 
  Lightbulb, 
  Eye, 
  Video, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  XCircle, 
  AlertOctagon, 
  FileText, 
  FileSearch,
  Check,
  Shield,
  Clock
} from 'lucide-react';

export default function PossibleActionsCard({
  onIncreaseMonitoring,
  onOpenCamera3,
  onNotifyTeam,
  onOpenEventMemory,
  operatorStatus = 'PENDING VERIFICATION',
  onReview,
  onAcknowledge,
  onVerify,
  onDismiss,
  onEscalate
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
      
      {/* 1. Header: Question 4: WHAT SHOULD THE OPERATOR DECIDE? */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0 text-purple-600 shadow-2xs">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                WHAT TO DECIDE?
              </span>
              <span className="text-xs font-bold text-slate-700">Commander Console</span>
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight mt-0.5">
              Operator Review & Actions
            </h2>
          </div>
        </div>

        {/* Current Operator State */}
        <div className="text-right">
          <span className={`text-[10.5px] px-2 py-0.5 rounded font-mono font-bold ${
            operatorStatus === 'VERIFIED'
              ? 'bg-emerald-100 text-emerald-800'
              : operatorStatus === 'ACKNOWLEDGED'
              ? 'bg-blue-100 text-blue-800'
              : operatorStatus === 'INVESTIGATING'
              ? 'bg-purple-100 text-purple-800'
              : operatorStatus === 'DISMISSED'
              ? 'bg-slate-200 text-slate-700'
              : operatorStatus === 'ESCALATED'
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {operatorStatus}
          </span>
          <div className="text-[9.5px] font-medium text-slate-400 mt-1">
            Human in control
          </div>
        </div>
      </div>

      {/* 2. Primary Decision Buttons with Plain-English Intent */}
      <div className="py-3 space-y-2.5">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
          Select Your Decision:
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* ACKNOWLEDGE */}
          <button
            onClick={onAcknowledge || onVerify}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              operatorStatus === 'ACKNOWLEDGED' || operatorStatus === 'VERIFIED'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                ACKNOWLEDGE
              </span>
            </div>
            <p className={`text-[10.5px] mt-1 leading-tight ${operatorStatus === 'ACKNOWLEDGED' || operatorStatus === 'VERIFIED' ? 'text-blue-100' : 'text-slate-500'}`}>
              "I have seen this situation and am monitoring"
            </p>
          </button>

          {/* INVESTIGATE */}
          <button
            onClick={() => onVerify && onVerify('INVESTIGATING')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              operatorStatus === 'INVESTIGATING'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                INVESTIGATE
              </span>
            </div>
            <p className={`text-[10.5px] mt-1 leading-tight ${operatorStatus === 'INVESTIGATING' ? 'text-purple-100' : 'text-slate-500'}`}>
              "Send patrol to verify boundary corridor"
            </p>
          </button>

          {/* ESCALATE */}
          <button
            onClick={onEscalate}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              operatorStatus === 'ESCALATED'
                ? 'bg-red-600 text-white border-red-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                ESCALATE
              </span>
            </div>
            <p className={`text-[10.5px] mt-1 leading-tight ${operatorStatus === 'ESCALATED' ? 'text-red-100' : 'text-slate-500'}`}>
              "High alert — notify Quick Reaction Team"
            </p>
          </button>

          {/* RESOLVE / BENIGN */}
          <button
            onClick={onDismiss}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              operatorStatus === 'DISMISSED' || operatorStatus === 'RESOLVED'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                RESOLVE
              </span>
            </div>
            <p className={`text-[10.5px] mt-1 leading-tight ${operatorStatus === 'DISMISSED' || operatorStatus === 'RESOLVED' ? 'text-emerald-100' : 'text-slate-500'}`}>
              "Normal authorized activity / False alarm"
            </p>
          </button>
        </div>
      </div>

      {/* 3. Fast Operational Helpers */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
        <button
          onClick={onOpenCamera3}
          className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200/80 transition-colors flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Video className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-xs">Keep River Camera (CAM-03) on Full Screen</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={onNotifyTeam}
          className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200/80 transition-colors flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-xs">Notify Sector Patrol Unit</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={onReview || onOpenEventMemory}
          className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 border border-slate-200/80 transition-colors flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span className="font-semibold text-xs">View Complete Incident Dossier</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

    </div>
  );
}
