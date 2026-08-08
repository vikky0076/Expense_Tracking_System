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
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <Card className="flex flex-col justify-between p-5 space-y-3 hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">
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
            {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}

            {badgeText && (
              <span className={cn("px-2.5 py-0.5 rounded-full border font-bold text-[11px]", badgeClasses[badgeVariant])}>
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
