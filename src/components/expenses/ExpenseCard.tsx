"use client";

import React, { useState } from "react";
import { Expense } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Home,
  GraduationCap,
  Film,
  Pill,
  Plane,
  Package,
  Paperclip,
  Edit2,
  Trash2,
} from "lucide-react";

interface ExpenseCardProps {
  expense: Expense;
  currency?: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onViewProof: (url: string) => void;
}

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Food":
      return <Utensils className="w-5 h-5 text-amber-600" />;
    case "Transport":
      return <Car className="w-5 h-5 text-blue-600" />;
    case "Shopping":
      return <ShoppingBag className="w-5 h-5 text-purple-600" />;
    case "Bills":
      return <Zap className="w-5 h-5 text-orange-600" />;
    case "Rent":
      return <Home className="w-5 h-5 text-emerald-600" />;
    case "Education":
      return <GraduationCap className="w-5 h-5 text-indigo-600" />;
    case "Entertainment":
      return <Film className="w-5 h-5 text-rose-600" />;
    case "Health":
      return <Pill className="w-5 h-5 text-teal-600" />;
    case "Travel":
      return <Plane className="w-5 h-5 text-sky-600" />;
    default:
      return <Package className="w-5 h-5 text-slate-600" />;
  }
};

export const getCategoryBg = (category: string) => {
  switch (category) {
    case "Food":
      return "bg-amber-50 border-amber-200";
    case "Transport":
      return "bg-blue-50 border-blue-200";
    case "Shopping":
      return "bg-purple-50 border-purple-200";
    case "Bills":
      return "bg-orange-50 border-orange-200";
    case "Rent":
      return "bg-emerald-50 border-emerald-200";
    case "Education":
      return "bg-indigo-50 border-indigo-200";
    case "Entertainment":
      return "bg-rose-50 border-rose-200";
    case "Health":
      return "bg-teal-50 border-teal-200";
    case "Travel":
      return "bg-sky-50 border-sky-200";
    default:
      return "bg-slate-100 border-slate-200";
  }
};

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  currency = "₹",
  onEdit,
  onDelete,
  onViewProof,
}) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
        {/* Category Icon & Main Title */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${getCategoryBg(
              expense.category
            )}`}
          >
            {getCategoryIcon(expense.category)}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {expense.title}
              </h4>
              {expense.proofUrl && (
                <button
                  onClick={() => onViewProof(expense.proofUrl!)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  title="Click to view receipt proof"
                >
                  <Paperclip className="w-3 h-3" />
                  Proof
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span className="font-medium">{formatDate(expense.date)}</span>
              <span>•</span>
              <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                {expense.paymentMethod}
              </span>
              <span>•</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {expense.category}
              </span>
            </div>
          </div>
        </div>

        {/* Amount & Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="text-base font-black text-slate-900 block leading-none">
              {formatCurrency(expense.amount, currency)}
            </span>
            {expense.description && (
              <span className="text-[10px] text-slate-400 truncate max-w-[150px] inline-block">
                {expense.description}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(expense)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Edit Expense"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
              title="Delete Expense"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => onDelete(expense.id)}
        title="Delete Expense Record"
        message={`Are you sure you want to delete "${expense.title}" (${formatCurrency(
          expense.amount,
          currency
        )})? This action cannot be undone.`}
      />
    </>
  );
};
