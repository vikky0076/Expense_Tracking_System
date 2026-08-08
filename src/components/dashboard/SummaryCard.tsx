"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  amount: number;
  currency?: string;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  badgeText?: string;
  badgeVariant?: "success" | "warning" | "danger" | "neutral";
  progress?: number; // 0 to 100
}

export const SummaryCard: React.FC<SummaryCardProps> = React.memo(({
  title,
  amount,
  currency = "₹",
  subtitle,
  icon: Icon,
  iconBgColor = "bg-emerald-50 border-emerald-200",
  iconColor = "text-emerald-600",
  badgeText,
  badgeVariant = "neutral",
  progress,
}) => {
  const badgeClasses = {
    success: "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
    warning: "bg-amber-100 text-amber-800 border-amber-300 font-bold",
    danger: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
    neutral: "bg-slate-100 text-slate-800 border-slate-300 font-bold",
  };

  return (
    <Card className="flex flex-col justify-between p-5 space-y-3 hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
            {title}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(amount, currency)}
          </h3>
        </div>

        <div className={cn("p-3 rounded-2xl border flex items-center justify-center shrink-0", iconBgColor, iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badgeText || progress !== undefined) && (
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            {subtitle ? (
              <span className="text-slate-500 font-semibold truncate max-w-[140px]">{subtitle}</span>
            ) : (
              <span />
            )}

            {badgeText && (
              <span className={cn("px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wider shrink-0", badgeClasses[badgeVariant])}>
                {badgeText}
              </span>
            )}
          </div>

          {progress !== undefined && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  progress > 100 ? "bg-rose-500" : progress > 85 ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
});

SummaryCard.displayName = "SummaryCard";

