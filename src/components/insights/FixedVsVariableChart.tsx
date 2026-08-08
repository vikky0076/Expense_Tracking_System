"use client";

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/utils";

export const FixedVsVariableChart: React.FC = () => {
  const { fixedExpensesTotal, variableExpensesTotal, settings } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-64 bg-slate-100/50 rounded-2xl animate-pulse" />;

  const data = [
    { name: "Fixed Recurring Bills", value: fixedExpensesTotal, color: "#10B981" },
    { name: "Variable Expenses", value: variableExpensesTotal, color: "#F97316" },
  ];

  return (
    <div className="w-full h-72 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [formatCurrency(Number(value), settings.currency), "Total"]}
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
