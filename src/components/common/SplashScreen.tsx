"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onComplete?: () => void;
  loadingDurationMs?: number;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  loadingDurationMs = 1200,
  minDurationMs,
}) => {
  const actualDuration = minDurationMs || loadingDurationMs;
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, Math.floor((elapsed / actualDuration) * 100));

      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 400);
        }, 120);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [actualDuration, onComplete]);

  // SVG calculations for radius = 54
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getSystemStatus = (val: number) => {
    if (val < 25) return { code: "SYS_INIT", label: "INITIALIZING MATRIX..." };
    if (val < 55) return { code: "VAULT_SYNC", label: "ENCRYPTING SESSION DATA..." };
    if (val < 85) return { code: "DATA_PARSING", label: "CALIBRATING ANALYTICS..." };
    if (val < 100) return { code: "CORE_READY", label: "FINALIZING HUD DISPLAY..." };
    return { code: "SYSTEM_ONLINE", label: "ACCESS GRANTED" };
  };

  const status = getSystemStatus(progress);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white p-6 transition-all duration-500 ease-out select-none overflow-hidden",
        isFadingOut ? "opacity-0 scale-110 blur-md pointer-events-none" : "opacity-100 scale-100 blur-none"
      )}
    >
      {/* Sci-Fi Futuristic Grid Pattern Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Cybernetic Ambient Light Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-emerald-500/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Futuristic HUD Loading Container */}
      <div className="relative flex flex-col items-center justify-center space-y-10 z-10 max-w-sm w-full">
        
        {/* HUD Frame Brackets */}
        <div className="relative p-8 flex items-center justify-center">
          {/* Corner Frame Accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400/80 rounded-tl-sm shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400/80 rounded-tr-sm shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400/80 rounded-bl-sm shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400/80 rounded-br-sm shadow-[0_0_10px_rgba(52,211,153,0.6)]" />

          {/* Outer Dashed Rotating HUD Orbit Ring 1 */}
          <div className="absolute w-56 h-56 rounded-full border border-dashed border-emerald-500/35 animate-[spin_16s_linear_infinite]" />

          {/* Dotted Counter-Rotating HUD Ring 2 */}
          <div className="absolute w-48 h-48 rounded-full border border-dotted border-cyan-400/40 animate-[spin_10s_linear_infinite_reverse]" />

          {/* Glowing Outer Target Frame Container */}
          <div className="absolute w-40 h-40 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.3)]" />

          {/* Central Progress SVG Circle */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_14px_rgba(16,185,129,0.7)]" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="futuristicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>

              {/* Dark Track Ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-slate-800/90"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />

              {/* Glowing Neon Segment Arc */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="url(#futuristicGradient)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-[stroke-dashoffset] duration-75 ease-out"
              />
            </svg>

            {/* Center Core HUD Digital Counter */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <div className="flex items-baseline space-x-0.5 font-mono">
                <span className="text-3xl sm:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]">
                  {progress}
                </span>
                <span className="text-xs font-bold text-emerald-400 font-sans">%</span>
              </div>
              <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
                LOADING
              </span>
            </div>
          </div>
        </div>

        {/* Futuristic Status Indicator & Linear Progress Bar */}
        <div className="w-full space-y-3 px-2">
          {/* Neon Horizontal Progress Bar */}
          <div className="relative w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-emerald-500/20 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-100 ease-out rounded-full shadow-[0_0_14px_rgba(16,185,129,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Monospace HUD Status Code & Message */}
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold px-1">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              [{status.code}]
            </span>
            <span className="text-slate-400 tracking-wider font-sans text-[10px] font-bold uppercase">
              {status.label}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

