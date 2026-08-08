"use client";

import React, { useState } from "react";
import { FinancialGoal } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Target, Calendar, Edit2, Trash2 } from "lucide-react";

interface FinancialGoalCardProps {
  goal: FinancialGoal;
  currency?: string;
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (id: string) => void;
}

export const FinancialGoalCard: React.FC<FinancialGoalCardProps> = ({
  goal,
  currency = "₹",
  onEdit,
  onDelete,
}) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const progressPercent = goal.targetAmount > 0
    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
    : 0;

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-card transition-all space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {goal.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Target: {formatDate(goal.targetDate)}
                </span>
                <span>•</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  {goal.category}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(goal)}
              icon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress details */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-500">Saved Progress</span>
            <span className="text-slate-900 font-black">
              {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
            </span>
          </div>
          <ProgressBar progress={progressPercent} size="md" />
        </div>

        {goal.notes && (
          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
            "{goal.notes}"
          </p>
        )}
      </div>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => onDelete(goal.id)}
        title="Delete Financial Goal"
        message={`Are you sure you want to delete savings goal "${goal.title}"?`}
      />
    </>
  );
};
