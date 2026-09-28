import React, { useState } from 'react';
import { Shield, User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('operator@drishti.gov.in');
  const [password, setPassword] = useState('Sentinel@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        username: username || 'operator@drishti.gov.in',
        name: 'Commandant R. K. Sharma',
        role: 'Border Commander (Sector Alpha-Foxtrot)'
      });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden select-none bg-slate-900">
      
      {/* Background Mountain Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />

      {/* Subtle Ambient Vignette & Contour Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/30 via-transparent to-blue-900/10 pointer-events-none" />

      {/* Center Authentication Container */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        
        {/* Emblem Shield Logo */}
        <div className="relative mb-2 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 shadow-md shadow-blue-500/25 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white stroke-[2.2]" />
          </div>
        </div>

        {/* Branding Typography matching logo */}
        <div className="text-center mb-6 flex flex-col items-center">
          <img 
            src="/seema-drishti-logo.png" 
            alt="सीमा Drishti" 
            className="h-14 w-auto object-contain drop-shadow-md my-1"
          />
          <p className="text-xs sm:text-[13px] font-semibold text-slate-600 tracking-wide mt-1">
            AI-Powered Border Surveillance & Intelligence
          </p>
        </div>

        {/* Sign In Card */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-blue-600/10 border border-white/80 p-7 sm:p-8 flex flex-col gap-5 transition-all">
          
          <h2 className="text-lg font-bold text-slate-800 text-center">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Field 1: Email or Username */}
            <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
              <User className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email or Username"
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                required
              />
            </div>

            {/* Field 2: Password */}
            <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
              <Lock className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium pr-7"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Submit Button: Sign In -> */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.99] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Access Helper */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sentinel Security v2.4</span>
            </span>
            <span className="font-mono">Restricted Access</span>
          </div>

        </div>

      </div>

    </div>
  );
}
