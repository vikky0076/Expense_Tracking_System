"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useFinance } from "@/context/FinanceContext";
import { Card } from "@/components/ui/Card";
import { formatCurrency, getMonthLabel } from "@/lib/utils";
import { PieChart, TrendingUp, Sparkles, Scale, Activity } from "lucide-react";
import { SmartInsightsCards } from "@/components/insights/SmartInsightsCards";

// Dynamically load heavy Recharts chart components (SSR disabled for instant page render)
const MonthlySpendingChart = dynamic(
  () => import("@/components/insights/MonthlySpendingChart").then((m) => m.MonthlySpendingChart),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-slate-100/70 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading Chart...</div>,
  }
);

const CategorySpendingChart = dynamic(
  () => import("@/components/insights/CategorySpendingChart").then((m) => m.CategorySpendingChart),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-slate-100/70 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading Chart...</div>,
  }
);

const DailySpendingChart = dynamic(
  () => import("@/components/insights/DailySpendingChart").then((m) => m.DailySpendingChart),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-slate-100/70 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading Chart...</div>,
  }
);

const FixedVsVariableChart = dynamic(
  () => import("@/components/insights/FixedVsVariableChart").then((m) => m.FixedVsVariableChart),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-slate-100/70 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading Chart...</div>,
  }
);

export default function InsightsPage() {
  const {
    selectedMonth,
    totalExpenses,
    fixedExpensesTotal,
    variableExpensesTotal,
    settings,
  } = useFinance();

  const monthLabel = getMonthLabel(selectedMonth);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-700/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-orange-300" />
            <span>Automated Financial Analytics</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Spending Insights & Trends</h1>
          <p className="text-xs text-emerald-100">
            Visual breakdown of fixed vs variable expenses for {monthLabel}.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-emerald-200 tracking-wider">
            Total Month Spend
          </span>
          <p className="text-xl font-black text-white">
            {formatCurrency(totalExpenses, settings.currency)}
          </p>
        </div>
      </div>

      {/* Automated Commentary */}
      <SmartInsightsCards />

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Fixed Recurring Bills</span>
            <p className="text-lg font-black text-slate-900">
              {formatCurrency(fixedExpensesTotal, settings.currency)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Variable Daily Expenses</span>
            <p className="text-lg font-black text-slate-900">
              {formatCurrency(variableExpensesTotal, settings.currency)}
            </p>
          </div>
        </Card>
      </div>

      {/* Interactive Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySpendingChart />
        <FixedVsVariableChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlySpendingChart />
        <DailySpendingChart />
      </div>
    </div>
  );
}
