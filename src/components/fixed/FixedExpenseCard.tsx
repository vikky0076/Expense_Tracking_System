"use client";

import React, { useState } from "react";
import { FixedExpense } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Calendar, CheckCircle2, Clock, Edit2, Trash2 } from "lucide-react";
import { getCategoryIcon, getCategoryBg } from "@/components/expenses/ExpenseCard";

interface FixedExpenseCardProps {
  fixedExpense: FixedExpense;
  currency?: string;
  onEdit: (item: FixedExpense) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const FixedExpenseCard: React.FC<FixedExpenseCardProps> = ({
  fixedExpense,
  currency = "₹",
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const isPaid = fixedExpense.status === "paid";

  return (
    <>
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${getCategoryBg(
                fixedExpense.category
              )}`}
            >
              {getCategoryIcon(fixedExpense.category)}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {fixedExpense.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Due: {fixedExpense.dueDate}th of month
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {fixedExpense.frequency}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleStatus(fixedExpense.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              isPaid
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
            }`}
          >
            {isPaid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Paid
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                Pending
              </>
            )}
          </button>
        </div>

        {/* Notes snippet if exists */}
        {fixedExpense.notes && (
          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
            "{fixedExpense.notes}"
          </p>
        )}

        {/* Footer info & Edit/Delete actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
              Recurring Amount
            </span>
            <span className="text-lg font-black text-slate-900">
              {formatCurrency(fixedExpense.amount, currency)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(fixedExpense)}
              icon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2"
              title="Delete Fixed Expense"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => onDelete(fixedExpense.id)}
        title="Delete Fixed Expense"
        message={`Are you sure you want to delete "${fixedExpense.title}" (${formatCurrency(
          fixedExpense.amount,
          currency
        )}) from recurring fixed bills?`}
      />
    </>
  );
};
