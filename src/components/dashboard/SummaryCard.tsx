import React from "react";
import { Card } from "@/components/ui/Card";
import { cn, formatCurrency } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  amount: number;
  currency?: string;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: "default" | "green" | "orange" | "slate";
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  currency = "₹",
  icon,
  subtitle,
  trend,
  variant = "default",
}) => {
  const iconVariantStyles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    slate: "bg-slate-100 text-slate-800 border-slate-200",
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(amount, currency)}
          </h3>
        </div>
        <div
          className={cn(
            "p-3 rounded-2xl border shadow-xs flex items-center justify-center shrink-0",
            iconVariantStyles[variant]
          )}
        >
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                "font-bold px-2 py-0.5 rounded-full text-[10px]",
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-orange-50 text-orange-700 border border-orange-200"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
