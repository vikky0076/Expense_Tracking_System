"use client";

import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Wallet,
} from "lucide-react";

export const SmartInsightsCards: React.FC = () => {
  const {
    totalExpenses,
    previousMonthStats,
    selectedMonthExpenses,
    remainingBalance,
    fixedExpensesTotal,
    monthlyCash,
    settings,
  } = useFinance();

  const currency = settings.currency || "₹";

  // Calculate highest spending category
  const categoryTotals: Record<string, number> = {};
  selectedMonthExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  let topCategory = "N/A";
  let topCategoryAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topCategoryAmount) {
      topCategory = cat;
      topCategoryAmount = amt;
    }
  });

  // Fixed expenses ratio
  const fixedRatio = monthlyCash > 0 ? Math.round((fixedExpensesTotal / monthlyCash) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Month Comparison Insight */}
      <Card className="flex items-start gap-3.5">
        <div className={`p-3 rounded-2xl border shrink-0 ${
          previousMonthStats.isLower 
            ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
            : "bg-orange-50 text-orange-600 border-orange-200"
        }`}>
          {previousMonthStats.isLower ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Monthly Spending Comparison
          </h4>
          <p className="text-sm font-bold text-slate-900 mt-1">
            {previousMonthStats.diffAmount === 0 ? (
              "Spending is equal to last month."
            ) : previousMonthStats.isLower ? (
              <>
                You spent <span className="text-emerald-600 font-extrabold">{formatCurrency(previousMonthStats.diffAmount, currency)} ({previousMonthStats.diffPercent}%) less</span> than {previousMonthStats.monthLabel}.
              </>
            ) : (
              <>
                Your spending increased by <span className="text-orange-600 font-extrabold">{formatCurrency(previousMonthStats.diffAmount, currency)} ({previousMonthStats.diffPercent}%)</span> compared with {previousMonthStats.monthLabel}.
              </>
            )}
          </p>
        </div>
      </Card>

      {/* 2. Top Category Insight */}
      <Card className="flex items-start gap-3.5">
        <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
          <PieChart className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Top Spending Category
          </h4>
          <p className="text-sm font-bold text-slate-900 mt-1">
            {topCategoryAmount > 0 ? (
              <>
                <span className="text-amber-700 font-extrabold">{topCategory}</span> is your highest spending category at {formatCurrency(topCategoryAmount, currency)}.
              </>
            ) : (
              "No category expenses recorded yet for this period."
            )}
          </p>
        </div>
      </Card>

      {/* 3. Remaining Balance Status */}
      <Card className="flex items-start gap-3.5">
        <div className={`p-3 rounded-2xl border shrink-0 ${
          remainingBalance >= 0
            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
            : "bg-rose-50 text-rose-600 border-rose-200"
        }`}>
          {remainingBalance >= 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Budget & Balance Health
          </h4>
          <p className="text-sm font-bold text-slate-900 mt-1">
            {remainingBalance >= 0 ? (
              <>
                You have <span className="text-emerald-600 font-extrabold">{formatCurrency(remainingBalance, currency)}</span> remaining this month. You're currently within budget!
              </>
            ) : (
              <>
                Monthly contributions exceeded by <span className="text-rose-600 font-extrabold">{formatCurrency(Math.abs(remainingBalance), currency)}</span>!
              </>
            )}
          </p>
        </div>
      </Card>

      {/* 4. Fixed Expenses Ratio */}
      <Card className="flex items-start gap-3.5 md:col-span-2 lg:col-span-3">
        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Fixed Recurring Bills Weight
          </h4>
          <p className="text-sm font-bold text-slate-900 mt-1">
            Your fixed recurring expenses ({formatCurrency(fixedExpensesTotal, currency)}) represent{" "}
            <span className="text-indigo-600 font-extrabold">{fixedRatio}%</span> of your monthly contribution budget.
          </p>
        </div>
      </Card>
    </div>
  );
};
