"use client";

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#F59E0B",
  Rent: "#10B981",
  Transport: "#3B82F6",
  Bills: "#F97316",
  Shopping: "#A855F7",
  Education: "#6366F1",
  Entertainment: "#F43F5E",
  Health: "#14B8A6",
  Travel: "#0EA5E9",
  Other: "#64748B",
};

export const CategorySpendingChart: React.FC = () => {
  const { selectedMonthExpenses, settings } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-64 bg-slate-100/50 rounded-2xl animate-pulse" />;

  // Aggregate by category
  const categoryTotals: Record<string, number> = {};
  selectedMonthExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-semibold text-slate-400">
        No category spending recorded for this month
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[entry.name] || "#94A3B8"}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [formatCurrency(Number(value), settings.currency), "Spent"]}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
