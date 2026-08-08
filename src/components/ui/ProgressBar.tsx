"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0 to 100+
  label?: string;
  subLabel?: string;
  showPercentage?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  subLabel,
  showPercentage = true,
  className,
  size = "md",
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Determine indicator color based on financial threshold
  let barColor = "bg-emerald-500 shadow-emerald-500/30";
  let textColor = "text-emerald-600";
  let statusBadge = "Healthy";

  if (progress > 95) {
    barColor = "bg-rose-500 shadow-rose-500/30";
    textColor = "text-rose-600";
    statusBadge = "Budget Exceeded";
  } else if (progress > 75) {
    barColor = "bg-orange-500 shadow-orange-500/30";
    textColor = "text-orange-600";
    statusBadge = "Approaching Limit";
  }

  const heightStyles = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          {label ? (
            <span className="text-slate-700 font-medium">{label}</span>
          ) : (
            <span className="text-slate-500">Budget Progress</span>
          )}
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", 
              progress > 95 ? "bg-rose-50 text-rose-600 border-rose-200" :
              progress > 75 ? "bg-orange-50 text-orange-600 border-orange-200" :
              "bg-emerald-50 text-emerald-600 border-emerald-200"
            )}>
              {statusBadge}
            </span>
            {showPercentage && <span className={cn("font-bold", textColor)}>{Math.round(progress)}%</span>}
          </div>
        </div>
      )}
      <div className={cn("w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80 shadow-inner", heightStyles[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out shadow-sm", barColor)}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {subLabel && <p className="mt-1 text-xs text-slate-500 font-medium">{subLabel}</p>}
    </div>
  );
};
