"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/utils";

export const MonthlySpendingChart: React.FC = () => {
  const { expenses, availableMonths, settings } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-64 bg-slate-100/50 rounded-2xl animate-pulse" />;

  // Aggregate monthly data
  const data = availableMonths
    .slice()
    .reverse()
    .map((m) => {
      const monthExpenses = expenses.filter((e) => e.date.startsWith(m.key));
      const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        month: m.label.split(" ")[0], // e.g. "August"
        fullMonth: m.label,
        Amount: total,
      };
    });

  return (
    <div className="w-full h-72 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: any) => [formatCurrency(Number(value), settings.currency), "Expenses"]}
            labelFormatter={(label, items) => items[0]?.payload?.fullMonth || label}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          />
          <Bar dataKey="Amount" fill="#10B981" radius={[8, 8, 0, 0]} maxBarSize={45} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
