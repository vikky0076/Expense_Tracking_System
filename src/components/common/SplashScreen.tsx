"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onComplete?: () => void;
  brandSplashDurationMs?: number;
  loadingDurationMs?: number;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  brandSplashDurationMs = 700,
  loadingDurationMs = 1400,
  minDurationMs,
}) => {
  const actualLoadingDuration = minDurationMs || loadingDurationMs;
  const [showLoadingRing, setShowLoadingRing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Step 1: Splash Website Name first for initial delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingRing(true);
    }, brandSplashDurationMs);

    return () => clearTimeout(timer);
  }, [brandSplashDurationMs]);

  // Step 2: Once loading ring starts, tick progress 0% -> 100%
  useEffect(() => {
    if (!showLoadingRing) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, Math.floor((elapsed / actualLoadingDuration) * 100));
      
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 450); // Fade-out completion
        }, 150);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [showLoadingRing, actualLoadingDuration, onComplete]);

  // SVG circular calculation (r = 46)
  const radius = 46;
  const circumference = 2 * Math.PI * radius; // ~289.02
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getStatusText = (val: number) => {
    if (val < 35) return "Initializing FinTrack...";
    if (val < 75) return "Syncing Financial Data...";
    if (val < 100) return "Preparing Dashboard...";
    return "Ready!";
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white p-6 transition-all duration-500 ease-out select-none",
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      )}
    >
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex flex-col items-center text-center space-y-8 max-w-sm w-full z-10">
        
        {/* PHASE 1: Website Name & Brand Splash */}
        <div className="flex flex-col items-center space-y-3 transition-all duration-500 transform animate-in fade-in zoom-in-95">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-3xl blur-md opacity-80 animate-pulse" />
            <div className="relative w-20 h-20 bg-slate-900 rounded-3xl border border-emerald-500/40 flex items-center justify-center text-white shadow-2xl">
              <TrendingUp className="w-10 h-10 text-emerald-400" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Fin<span className="text-emerald-400">Track</span>
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1 tracking-wide">
              Personal Finance & Expense Manager
            </p>
          </div>
        </div>

        {/* PHASE 2: Round Loading Animation & 0-100% Counter (Fades & Slides in after Website Name Splash) */}
        <div
          className={cn(
            "flex flex-col items-center space-y-6 transition-all duration-500 transform",
            showLoadingRing
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          )}
        >
          {/* Circular SVG Ring */}
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>

              {/* Background Track Circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-slate-800/80"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />

              {/* Animated Progress Ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="url(#splashGradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-[stroke-dashoffset] duration-75 ease-linear"
              />
            </svg>

            {/* Centered Percentage Number Counter */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white tracking-tighter">
                {progress}%
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                Loading
              </span>
            </div>
          </div>

          {/* Dynamic Loading Status Text */}
          <div className="h-6">
            <p className="text-xs font-semibold text-slate-300 transition-all duration-300">
              {getStatusText(progress)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
