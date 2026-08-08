"use client";

import React from "react";
import { FixedExpense } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Calendar, CheckCircle2, Clock, Edit2, Trash2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface FixedExpenseCardProps {
  fixedExpense: FixedExpense;
  currency?: string;
  onEdit?: (fixedExpense: FixedExpense) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export const FixedExpenseCard: React.FC<FixedExpenseCardProps> = React.memo(({
  fixedExpense,
  currency = "₹",
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const isPaid = fixedExpense.status === "paid";

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition-all group">
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={cn(
            "w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0",
            isPaid ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-amber-50 border-amber-200 text-amber-600"
          )}
        >
          <Calendar className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {fixedExpense.title}
            </h4>
            <button
              type="button"
              onClick={() => onToggleStatus?.(fixedExpense.id)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 transition-colors",
                isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              )}
              title="Click to toggle Paid/Pending status"
            >
              {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {isPaid ? "Paid" : "Pending"}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              <span>{fixedExpense.category}</span>
            </div>
            <span>•</span>
            <span>Due: {fixedExpense.dueDate}th of month</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm sm:text-base font-black text-slate-900">
          {formatCurrency(fixedExpense.amount, currency)}
        </span>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pl-1 border-l border-slate-100">
            {onEdit && (
              <button
                onClick={() => onEdit(fixedExpense)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Edit Fixed Bill"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(fixedExpense.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Fixed Bill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

FixedExpenseCard.displayName = "FixedExpenseCard";
