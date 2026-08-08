import React from "react";
import { cn } from "@/lib/utils";

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-slate-200/80 rounded-xl", className)} />
  );
};

export const ExpenseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3.5">
        <LoadingSkeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <LoadingSkeleton className="w-32 h-4" />
          <LoadingSkeleton className="w-20 h-3" />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <LoadingSkeleton className="w-16 h-5 ml-auto" />
        <LoadingSkeleton className="w-12 h-3 ml-auto" />
      </div>
    </div>
  );
};
