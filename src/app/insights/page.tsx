"use client";

import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { MonthlySpendingChart } from "@/components/insights/MonthlySpendingChart";
import { CategorySpendingChart } from "@/components/insights/CategorySpendingChart";
import { DailySpendingChart } from "@/components/insights/DailySpendingChart";
import { FixedVsVariableChart } from "@/components/insights/FixedVsVariableChart";
import { SmartInsightsCards } from "@/components/insights/SmartInsightsCards";
import { Card } from "@/components/ui/Card";
import { PieChart, BarChart3, TrendingUp, Sparkles, Scale } from "lucide-react";
import { getMonthLabel } from "@/lib/utils";

export default function InsightsPage() {
  const { selectedMonth } = useFinance();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <PieChart className="w-6 h-6 text-emerald-600" />
          Financial Analytics & Smart Insights
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Visual spending breakdowns and automated commentary for {getMonthLabel(selectedMonth)}
        </p>
      </div>

      {/* Smart Automated Textual Insights */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Automated Financial Summary</span>
        </div>
        <SmartInsightsCards />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Monthly Spending Trend Bar Chart */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Monthly Spending Trend
              </h3>
              <p className="text-[10px] text-slate-400">Total expenses per month</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Bar Chart
            </span>
          </div>
          <MonthlySpendingChart />
        </Card>

        {/* 2. Category Spending Donut Chart */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-amber-500" />
                Category Spending Breakdown
              </h3>
              <p className="text-[10px] text-slate-400">Category allocation for {getMonthLabel(selectedMonth)}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Donut Chart
            </span>
          </div>
          <CategorySpendingChart />
        </Card>

        {/* 3. Daily Spending Velocity Line Chart */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Daily Spending Progression
              </h3>
              <p className="text-[10px] text-slate-400">Day-by-day expenditure throughout the month</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              Line Chart
            </span>
          </div>
          <DailySpendingChart />
        </Card>

        {/* 4. Fixed vs Variable Donut Chart */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                Fixed vs Variable Expenses
              </h3>
              <p className="text-[10px] text-slate-400">Recurring fixed bills vs flexible variable spending</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Ratio Chart
            </span>
          </div>
          <FixedVsVariableChart />
        </Card>
      </div>
    </div>
  );
}
