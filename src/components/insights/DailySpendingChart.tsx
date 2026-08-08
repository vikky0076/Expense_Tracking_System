"use client";

import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/utils";

export const DailySpendingChart: React.FC = () => {
  const { selectedMonthExpenses, selectedMonth, settings } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-64 bg-slate-100/50 rounded-2xl animate-pulse" />;

  // Get number of days in selected month
  const [yearStr, monthStr] = selectedMonth.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  const dailyMap: Record<number, number> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    dailyMap[d] = 0;
  }

  selectedMonthExpenses.forEach((exp) => {
    const day = parseInt(exp.date.split("-")[2], 10);
    if (day && dailyMap[day] !== undefined) {
      dailyMap[day] += exp.amount;
    }
  });

  const data = Object.entries(dailyMap).map(([day, amount]) => ({
    day: `Day ${day}`,
    Amount: amount,
  }));

  return (
    <div className="w-full h-72 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} interval={4} />
          <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: any) => [formatCurrency(Number(value), settings.currency), "Daily Spend"]}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              fontSize: "12px",
              fontWeight: 600,
            }}
          />
          <Line
            type="monotone"
            dataKey="Amount"
            stroke="#F97316"
            strokeWidth={3}
            dot={{ r: 3, fill: "#F97316", strokeWidth: 1 }}
            activeDot={{ r: 6, fill: "#EA580C" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
