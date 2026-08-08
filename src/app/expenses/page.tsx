"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { ExpenseFilter } from "@/components/expenses/ExpenseFilter";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { ProofViewerModal } from "@/components/expenses/ProofViewerModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Receipt, Download } from "lucide-react";
import { Expense } from "@/types";
import { formatCurrency, getMonthLabel } from "@/lib/utils";
import { exportExpensesToCSV } from "@/lib/csvExporter";

export default function ExpensesPage() {
  const { selectedMonthExpenses, selectedMonth, deleteExpense, settings } = useFinance();
  const currency = settings.currency || "₹";

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeProofUrl, setActiveProofUrl] = useState<string | undefined>(undefined);

  // Apply filters
  let filtered = selectedMonthExpenses.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "ALL" || exp.category === categoryFilter;
    const matchesPayment = paymentFilter === "ALL" || exp.paymentMethod === paymentFilter;

    return matchesSearch && matchesCategory && matchesPayment;
  });

  // Apply sorting
  filtered.sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === "highest") return b.amount - a.amount;
    if (sortBy === "lowest") return a.amount - b.amount;
    return 0;
  });

  const totalFilteredAmount = filtered.reduce((sum, e) => sum + e.amount, 0);

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("ALL");
    setPaymentFilter("ALL");
    setSortBy("newest");
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            Transactions & Expenses
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Managing records for {getMonthLabel(selectedMonth)} • Total Filtered:{" "}
            <span className="font-bold text-slate-800">{formatCurrency(totalFilteredAmount, currency)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => exportExpensesToCSV(filtered, `expenses-${selectedMonth}.csv`)}
            icon={<Download className="w-4 h-4 text-emerald-600" />}
            title="Export CSV spreadsheet for filtered expenses"
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Filter Component */}
      <ExpenseFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilters={resetFilters}
      />

      {/* Expense List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description={
            searchQuery || categoryFilter !== "ALL" || paymentFilter !== "ALL"
              ? "No expenses matched your filter criteria. Try clearing search parameters."
              : `No expenses recorded for ${getMonthLabel(selectedMonth)}. Start by adding your first expense!`
          }
          actionLabel="Add New Expense"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((exp) => (
            <ExpenseCard
              key={exp.id}
              expense={exp}
              currency={currency}
              onEdit={(item) => setEditingExpense(item)}
              onDelete={deleteExpense}
              onViewProof={(url) => setActiveProofUrl(url)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ExpenseModal
        isOpen={isAddModalOpen || Boolean(editingExpense)}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingExpense(null);
        }}
        expenseToEdit={editingExpense}
        onViewProof={(url) => setActiveProofUrl(url)}
      />

      <ProofViewerModal
        isOpen={Boolean(activeProofUrl)}
        onClose={() => setActiveProofUrl(undefined)}
        proofUrl={activeProofUrl}
      />
    </div>
  );
}
