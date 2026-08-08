"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFinance } from "@/context/FinanceContext";
import { useAuth } from "@/context/AuthContext";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { FixedExpenseCard } from "@/components/fixed/FixedExpenseCard";
import { MemberCard } from "@/components/income/MemberCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { ProofViewerModal } from "@/components/expenses/ProofViewerModal";
import { formatCurrency, getMonthLabel } from "@/lib/utils";
import { exportExpensesToCSV } from "@/lib/csvExporter";
import {
  Wallet,
  Receipt,
  Users,
  PiggyBank,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Download,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    selectedMonth,
    selectedMonthExpenses,
    fixedExpenses,
    members,
    monthlyCash,
    pendingContribution,
    totalExpenses,
    pendingFixedExpensesTotal,
    remainingBalance,
    savings,
    budgetProgress,
    settings,
    deleteExpense,
    deleteFixedExpense,
    toggleFixedExpenseStatus,
    toggleMemberPaid,
  } = useFinance();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [activeProofUrl, setActiveProofUrl] = useState<string | undefined>(undefined);

  const currency = settings.currency || "₹";
  const monthLabel = getMonthLabel(selectedMonth);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-emerald-700/20">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-orange-300" />
            <span>Welcome back, {user?.displayName || user?.username || "Friend"}!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Financial Dashboard — {monthLabel}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Real-time breakdown of your group contributions, fixed recurring bills, and variable daily expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => exportExpensesToCSV(selectedMonthExpenses, `expenses-${selectedMonth}.csv`)}
            className="bg-white/10 hover:bg-white/20 border-white/30 text-white shadow-xs px-4 py-3 text-xs sm:text-sm font-bold"
            icon={<Download className="w-4 h-4 text-emerald-200" />}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsAddExpenseOpen(true)}
            className="shadow-md shadow-orange-500/25 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold"
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Top Section: Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Monthly Cash"
          amount={monthlyCash}
          currency={currency}
          icon={Users}
          iconBgColor="bg-emerald-50 border-emerald-200"
          iconColor="text-emerald-600"
          badgeText={`${members.filter((m) => m.isPaid).length}/${members.length} Paid`}
          badgeVariant="success"
          subtitle={`Pending: ${formatCurrency(pendingContribution, currency)}`}
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          currency={currency}
          icon={Receipt}
          iconBgColor="bg-rose-50 border-rose-200"
          iconColor="text-rose-600"
          badgeText={`${selectedMonthExpenses.length} Items`}
          badgeVariant="neutral"
          subtitle={`Pending Bills: ${formatCurrency(pendingFixedExpensesTotal, currency)}`}
        />
        <SummaryCard
          title="Remaining Balance"
          amount={remainingBalance}
          currency={currency}
          icon={Wallet}
          iconBgColor={remainingBalance >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}
          iconColor={remainingBalance >= 0 ? "text-emerald-600" : "text-rose-600"}
          badgeText={remainingBalance >= 0 ? "Healthy Reserve" : "Budget Over-spent"}
          badgeVariant={remainingBalance >= 0 ? "success" : "danger"}
        />
        <SummaryCard
          title="Total Savings"
          amount={savings}
          currency={currency}
          icon={PiggyBank}
          iconBgColor="bg-amber-50 border-amber-200"
          iconColor="text-amber-600"
          badgeText="Net Target"
          badgeVariant="warning"
        />
      </div>

      {/* Budget Progress Bar Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft space-y-3">
        <ProgressBar
          progress={budgetProgress}
          label="Monthly Budget Progress"
          subLabel={`Spent ${formatCurrency(totalExpenses, currency)} out of ${formatCurrency(settings.monthlyBudget || monthlyCash || 10000, currency)} target budget`}
          showPercentage={true}
        />
      </div>

      {/* Main Grid: Recent Transactions & Fixed Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Expenses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <Link href="/expenses" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View All ({selectedMonthExpenses.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {selectedMonthExpenses.length === 0 ? (
            <Card className="p-8 text-center space-y-3">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No expenses logged for {monthLabel} yet.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddExpenseOpen(true)}
                icon={<PlusCircle className="w-4 h-4" />}
              >
                Log First Expense
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedMonthExpenses.slice(0, 5).map((exp) => (
                <ExpenseCard
                  key={exp.id}
                  expense={exp}
                  currency={currency}
                  onDelete={(id) => deleteExpense(id)}
                  onViewProof={(url) => setActiveProofUrl(url)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Fixed Recurring Bills & Member Contributions */}
        <div className="space-y-6">
          {/* Fixed Bills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Fixed Recurring Bills</h3>
              <Link href="/fixed-expenses" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                Manage
              </Link>
            </div>

            {fixedExpenses.length === 0 ? (
              <Card className="p-6 text-center text-xs text-slate-500">
                No fixed bills configured.
              </Card>
            ) : (
              <div className="space-y-2.5">
                {fixedExpenses.slice(0, 3).map((fixed) => (
                  <FixedExpenseCard
                    key={fixed.id}
                    fixedExpense={fixed}
                    currency={currency}
                    onDelete={(id) => deleteFixedExpense(id)}
                    onToggleStatus={(id) => toggleFixedExpenseStatus(id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Member Pool Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Group Members</h3>
              <Link href="/income" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                View Cash
              </Link>
            </div>

            {members.length === 0 ? (
              <Card className="p-6 text-center text-xs text-slate-500">
                No members added yet.
              </Card>
            ) : (
              <div className="space-y-2.5">
                {members.slice(0, 3).map((mem) => (
                  <MemberCard
                    key={mem.id}
                    member={mem}
                    currency={currency}
                    onTogglePaid={(id) => toggleMemberPaid(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <ExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onViewProof={(url) => setActiveProofUrl(url)}
      />

      {/* Proof Lightbox */}
      <ProofViewerModal
        isOpen={Boolean(activeProofUrl)}
        onClose={() => setActiveProofUrl(undefined)}
        proofUrl={activeProofUrl}
      />
    </div>
  );
}

