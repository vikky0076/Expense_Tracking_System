"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { FixedExpenseCard } from "@/components/fixed/FixedExpenseCard";
import { FixedExpenseModal } from "@/components/fixed/FixedExpenseModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { CalendarDays, PlusCircle } from "lucide-react";
import { FixedExpense } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function FixedExpensesPage() {
  const {
    fixedExpenses,
    paidFixedExpensesTotal,
    pendingFixedExpensesTotal,
    toggleFixedExpenseStatus,
    deleteFixedExpense,
    settings,
  } = useFinance();
  const currency = settings.currency || "₹";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFixed, setEditingFixed] = useState<FixedExpense | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-600" />
            Fixed Recurring Bills & Rent
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Paid Commitment:{" "}
            <span className="font-extrabold text-emerald-700">{formatCurrency(paidFixedExpensesTotal, currency)}</span>
            {" • "}
            Pending Bills:{" "}
            <span className="font-extrabold text-amber-700">{formatCurrency(pendingFixedExpensesTotal, currency)}</span>
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingFixed(null);
            setIsModalOpen(true);
          }}
          icon={<PlusCircle className="w-4 h-4" />}
        >
          Add Fixed Bill
        </Button>
      </div>

      {/* Fixed Bills List */}
      {fixedExpenses.length === 0 ? (
        <EmptyState
          title="No fixed bills added"
          description="Add your recurring monthly bills such as House Rent, Electricity, Internet, and Subscriptions."
          actionLabel="Add Fixed Expense"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fixedExpenses.map((fixed) => (
            <FixedExpenseCard
              key={fixed.id}
              fixedExpense={fixed}
              currency={currency}
              onEdit={(item) => {
                setEditingFixed(item);
                setIsModalOpen(true);
              }}
              onDelete={deleteFixedExpense}
              onToggleStatus={toggleFixedExpenseStatus}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <FixedExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFixed(null);
        }}
        fixedToEdit={editingFixed}
      />
    </div>
  );
}

