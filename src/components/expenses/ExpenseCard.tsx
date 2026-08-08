"use client";

import React from "react";
import { Expense } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Home,
  GraduationCap,
  Film,
  HeartPulse,
  Plane,
  MoreHorizontal,
  Paperclip,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  expense: Expense;
  currency?: string;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  onViewProof?: (proofUrl: string) => void;
}

const categoryIcons: Record<string, { icon: any; bg: string; text: string }> = {
  Food: { icon: Utensils, bg: "bg-amber-50 border-amber-200", text: "text-amber-600" },
  Transport: { icon: Car, bg: "bg-blue-50 border-blue-200", text: "text-blue-600" },
  Shopping: { icon: ShoppingBag, bg: "bg-purple-50 border-purple-200", text: "text-purple-600" },
  Bills: { icon: Receipt, bg: "bg-rose-50 border-rose-200", text: "text-rose-600" },
  Rent: { icon: Home, bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-600" },
  Education: { icon: GraduationCap, bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-600" },
  Entertainment: { icon: Film, bg: "bg-pink-50 border-pink-200", text: "text-pink-600" },
  Health: { icon: HeartPulse, bg: "bg-teal-50 border-teal-200", text: "text-teal-600" },
  Travel: { icon: Plane, bg: "bg-sky-50 border-sky-200", text: "text-sky-600" },
  Other: { icon: MoreHorizontal, bg: "bg-slate-50 border-slate-200", text: "text-slate-600" },
};

export const ExpenseCard: React.FC<ExpenseCardProps> = React.memo(({
  expense,
  currency = "₹",
  onEdit,
  onDelete,
  onViewProof,
}) => {
  const catInfo = categoryIcons[expense.category] || categoryIcons.Other;
  const CategoryIcon = catInfo.icon;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card hover:border-slate-300 transition-all group">
      {/* Left Icon & Information */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={cn("w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0", catInfo.bg, catInfo.text)}>
          <CategoryIcon className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {expense.title}
            </h4>
            {expense.proofUrl && (
              <button
                onClick={() => onViewProof?.(expense.proofUrl!)}
                className="p-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1 text-[10px] font-bold"
                title="View Receipt Proof"
              >
                <Paperclip className="w-3 h-3" />
                <span className="hidden sm:inline">Proof</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-0.5">
            <span className="font-medium text-slate-600">{expense.category}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(expense.date)}</span>
            </div>
            {expense.paymentMethod && (
              <>
                <span className="hidden sm:inline">•</span>
                <div className="hidden sm:flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span>{expense.paymentMethod}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Amount & Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <span className="text-sm sm:text-base font-black text-slate-900 block">
            -{formatCurrency(expense.amount, currency)}
          </span>
          {expense.description && (
            <span className="text-[10px] text-slate-400 block max-w-[120px] truncate">
              {expense.description}
            </span>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pl-1 border-l border-slate-100">
            {onEdit && (
              <button
                onClick={() => onEdit(expense)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Edit Expense"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(expense.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Expense"
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

ExpenseCard.displayName = "ExpenseCard";
