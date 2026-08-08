"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFinance } from "@/context/FinanceContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, getMonthLabel } from "@/lib/utils";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { ProofViewerModal } from "@/components/expenses/ProofViewerModal";
import { MemberCard } from "@/components/income/MemberCard";
import { FixedExpenseCard } from "@/components/fixed/FixedExpenseCard";
import { TaskItem } from "@/components/planner/TaskItem";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Wallet,
  Receipt,
  PiggyBank,
  Users,
  CalendarDays,
  CheckSquare,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { Expense } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    selectedMonth,
    selectedMonthExpenses,
    totalContribution,
    totalExpenses,
    remainingBalance,
    savings,
    budgetProgress,
    members,
    fixedExpenses,
    tasks,
    settings,
    deleteExpense,
    toggleMemberPaid,
    updateFixedExpense,
    deleteFixedExpense,
    toggleTaskCompleted,
    deleteTask,
  } = useFinance();

  const currency = settings.currency || "₹";

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeProofUrl, setActiveProofUrl] = useState<string | undefined>(undefined);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider block mb-1">
              {getMonthLabel(selectedMonth)} Financial Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.displayName || user?.username || "Friend"}! 👋
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl">
              Track group contributions, fixed recurring bills, and stay within your monthly budget.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              variant="secondary"
              onClick={() => setIsAddExpenseOpen(true)}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Add Expense
            </Button>
          </div>
        </div>
      </div>

      {/* Top Section: Financial Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Monthly Pool"
          amount={totalContribution}
          currency={currency}
          icon={<Users className="w-5 h-5" />}
          variant="green"
          subtitle={`${members.filter((m) => m.isPaid).length} of ${members.length} members paid`}
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          currency={currency}
          icon={<Receipt className="w-5 h-5" />}
          variant="orange"
          subtitle={`${selectedMonthExpenses.length} transaction records`}
        />
        <SummaryCard
          title="Remaining Balance"
          amount={remainingBalance}
          currency={currency}
          icon={<Wallet className="w-5 h-5" />}
          variant={remainingBalance >= 0 ? "default" : "orange"}
          subtitle={remainingBalance >= 0 ? "Healthy cash reserve" : "Budget threshold exceeded!"}
        />
        <SummaryCard
          title="Total Savings"
          amount={savings}
          currency={currency}
          icon={<PiggyBank className="w-5 h-5" />}
          variant="green"
          subtitle="Calculated net savings"
        />
      </div>

      {/* Budget Progress Bar Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Budget Progress Bar</h3>
            <p className="text-xs text-slate-500">
              Spent {formatCurrency(totalExpenses, currency)} out of {formatCurrency(settings.monthlyBudget || totalContribution || 10000, currency)} target budget
            </p>
          </div>
          <span className="text-sm font-black text-slate-800">
            {formatCurrency(Math.max(0, (settings.monthlyBudget || totalContribution || 10000) - totalExpenses), currency)} Remaining
          </span>
        </div>
        <ProgressBar
          progress={budgetProgress}
          size="lg"
          subLabel={`Budget Used: ${Math.round(budgetProgress)}% • Remaining: ${Math.max(0, 100 - Math.round(budgetProgress))}%`}
        />
      </div>

      {/* 5-Member Group Contribution Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Group Member Contributions</h3>
            <p className="text-xs text-slate-500">Track 5-member monthly pooled funds ({formatCurrency(totalContribution, currency)} total)</p>
          </div>
          <Link href="/income">
            <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Manage Members
            </Button>
          </Link>
        </div>

        {members.length === 0 ? (
          <EmptyState
            title="No group members added yet"
            description="Add contributing group members to pool monthly funds."
            actionLabel="Add Member"
            onAction={() => window.location.assign("/income")}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                currency={currency}
                onEdit={() => {}}
                onDelete={() => {}}
                onTogglePaid={toggleMemberPaid}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Expenses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest expense items for {getMonthLabel(selectedMonth)}</p>
          </div>
          <Link href="/expenses">
            <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              View All Expenses
            </Button>
          </Link>
        </div>

        {selectedMonthExpenses.length === 0 ? (
          <EmptyState
            title="No expenses recorded yet"
            description="Start by adding your first expense transaction."
            actionLabel="Add Expense"
            onAction={() => setIsAddExpenseOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {selectedMonthExpenses.slice(0, 5).map((exp) => (
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
      </div>

      {/* Fixed Expenses & Planner Tasks Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fixed Bills Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              Fixed Recurring Bills
            </h3>
            <Link href="/fixed-expenses">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-emerald-600">
                View All
              </Button>
            </Link>
          </div>
          {fixedExpenses.length === 0 ? (
            <p className="text-xs text-slate-400 bg-white p-4 rounded-2xl border border-slate-200">
              No fixed bills added. Click "View All" to add recurring rent or bills.
            </p>
          ) : (
            <div className="space-y-3">
              {fixedExpenses.slice(0, 3).map((fixed) => (
                <FixedExpenseCard
                  key={fixed.id}
                  fixedExpense={fixed}
                  currency={currency}
                  onEdit={() => {}}
                  onDelete={deleteFixedExpense}
                  onToggleStatus={(id) => {
                    const item = fixedExpenses.find((f) => f.id === id);
                    if (item) {
                      updateFixedExpense(id, {
                        status: item.status === "paid" ? "pending" : "paid",
                      });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Planner Tasks Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-orange-600" />
              Upcoming Planner Tasks
            </h3>
            <Link href="/planner">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-orange-600">
                View Planner
              </Button>
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-xs text-slate-400 bg-white p-4 rounded-2xl border border-slate-200">
              No planner tasks for today. Click "View Planner" to add tasks.
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleCompleted={toggleTaskCompleted}
                  onEdit={() => {}}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Expense Modals */}
      <ExpenseModal
        isOpen={isAddExpenseOpen || Boolean(editingExpense)}
        onClose={() => {
          setIsAddExpenseOpen(false);
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
