import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Info,
  Sliders,
  HelpCircle,
  Eye,
  Share2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { DEMO_SCENARIO_STEPS } from '../data/surveillanceData';

export default function DemoController({
  currentStep = 6,
  onSetStep,
  isPlaying = false,
  onTogglePlay,
  onReset
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const currentStepData = DEMO_SCENARIO_STEPS.find(s => s.step === currentStep) || DEMO_SCENARIO_STEPS[5];

  return (
    <div className="w-full bg-white rounded-2xl border border-blue-200/90 shadow-2xs p-4 space-y-3 transition-all duration-200 hover:shadow-md">
      {/* 1. Core Mission Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10.5px] font-bold font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            SIH DEMO MODE &bull; SITUATION #024
          </span>
          <span className="hidden md:inline text-xs font-semibold text-slate-500">
            &bull; Operational Incident Storyline
          </span>
        </div>

        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="italic">
            "SEEMA DRISHTI turns separate CCTV detections into one understandable border situation."
          </span>
        </div>
      </div>

      {/* 2. Primary Story Stage & Plain-English Explanation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
        <div className="space-y-1">
          {/* Question Tag */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-600 text-white text-[10.5px] font-bold font-mono tracking-wide">
            {currentStepData.questionAnswered.split('?')[0]}?
          </div>

          {/* Simple Explanation First */}
          <div className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-1">
            <span>{currentStepData.title}</span>
            <span className="text-slate-300 font-normal">|</span>
            <span className="text-xs font-bold text-blue-700 font-mono">
              {currentStepData.shortDesc.split('•')[0]?.trim()}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-sans max-w-3xl">
            {currentStepData.simpleStory}
          </p>
        </div>

        {/* Playback & Step Controls */}
        <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-center">
          <button
            onClick={() => onSetStep(Math.max(1, currentStep - 1))}
            disabled={currentStep <= 1}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-200/60 disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer"
            title="Previous Story Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Auto Play Story</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSetStep(Math.min(6, currentStep + 1))}
            disabled={currentStep >= 6}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-200/60 disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer"
            title="Next Story Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-200/60 text-slate-600 transition-colors cursor-pointer"
            title="Restart Scenario from Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
              showTechnicalDetails 
                ? 'bg-blue-50 text-blue-700 border-blue-300' 
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            title="Learn how the system detected and connected these events"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">How It Works</span>
          </button>
        </div>
      </div>

      {/* 3. 6 Story Progression Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-0.5">
        {DEMO_SCENARIO_STEPS.map((s) => {
          const isActive = s.step === currentStep;
          const isPassed = s.step < currentStep;

          return (
            <button
              key={s.step}
              onClick={() => onSetStep(s.step)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/25 shadow-xs'
                  : isPassed
                  ? 'bg-blue-50/70 text-blue-900 border-blue-200 hover:bg-blue-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="font-mono">STAGE {s.step}</span>
                {isPassed && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
              </div>
              <div className="text-[11px] font-bold truncate mt-0.5">
                {s.title.split('—')[0]?.trim()}
              </div>
              <div className={`text-[10px] truncate opacity-90 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                {s.title.split('—')[1]?.trim() || s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Expandable Technical Information Drawer */}
      {showTechnicalDetails && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2 border border-slate-800 shadow-inner animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-blue-400 font-bold border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-400" />
              How The System Works Behind The Scenes (Stage {currentStep})
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Continuous Motion Scanner &bull; Night Vision Filter &bull; Direction Matcher
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block text-[10px]">CAMERA AI SCANNER:</span>
              <strong className="text-emerald-400">AI Motion Detector Active</strong>
              <div className="text-slate-400 text-[10px] mt-0.5">Match Score: 91% (Subject 12)</div>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block text-[10px]">PATH TRACKING LOGIC:</span>
              <strong className="text-blue-400">Walking Corridor & Speed Match</strong>
              <div className="text-slate-400 text-[10px] mt-0.5">Normal Walking Pace (~1.2 m/s)</div>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block text-[10px]">NIGHT & FOG FILTER:</span>
              <strong className="text-amber-400">Night Vision Brightening</strong>
              <div className="text-slate-400 text-[10px] mt-0.5">Enhanced River Camera Visibility</div>
            </div>
          </div>

          <div className="text-[10.5px] text-slate-400 italic">
            Privacy Protection: The system only tracks physical movement, speed, and timing. No facial recognition or biometric scanning is used.
          </div>
        </div>
      )}
    </div>
  );
}
