"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useAuth } from "@/context/AuthContext";
import { exportExpensesToCSV } from "@/lib/csvExporter";
import { exportExpensesToPDF } from "@/lib/pdfGenerator";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { FileSpreadsheet, FileText, Download, CheckCircle2 } from "lucide-react";
import { formatCurrency, getMonthLabel } from "@/lib/utils";

export default function ExportPage() {
  const { user } = useAuth();
  const {
    expenses,
    selectedMonth,
    availableMonths,
    totalContribution,
    totalExpenses,
    fixedExpensesTotal,
    variableExpensesTotal,
    remainingBalance,
    settings,
  } = useFinance();

  const currency = settings.currency || "₹";
  const [exportScope, setExportScope] = useState<string>("selected");

  // Determine records based on selected scope
  const targetExpenses = exportScope === "all"
    ? expenses
    : expenses.filter((e) => e.date.startsWith(selectedMonth));

  const scopeLabel = exportScope === "all" ? "All Time Records" : getMonthLabel(selectedMonth);

  const handleExportCSV = () => {
    exportExpensesToCSV(targetExpenses, `Expenses_Export_${scopeLabel.replace(/\s+/g, "_")}.csv`);
  };

  const handleExportPDF = () => {
    exportExpensesToPDF({
      monthLabel: scopeLabel,
      userName: user?.displayName || "Rahul",
      totalContribution,
      totalExpenses,
      fixedExpenses: fixedExpensesTotal,
      variableExpenses: variableExpensesTotal,
      remainingBalance,
      expenses: targetExpenses,
      currency,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
          Financial Data Export & Statement Generator
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Export financial records in spreadsheet (CSV) or formatted document (PDF) format.
        </p>
      </div>

      {/* Scope Selector Card */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          1. Select Export Scope & Timeframe
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Timeframe Scope"
            options={[
              { value: "selected", label: `Selected Month (${getMonthLabel(selectedMonth)})` },
              { value: "all", label: "All Recorded Transactions (All Time)" },
            ]}
            value={exportScope}
            onChange={(e) => setExportScope(e.target.value)}
          />

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Selected Records Count
              </span>
              <span className="text-lg font-black text-emerald-900">
                {targetExpenses.length} Expenses
              </span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </Card>

      {/* Summary Preview Box */}
      <Card className="bg-slate-900 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Statement Preview Summary
          </span>
          <span className="text-xs font-semibold text-slate-400">{scopeLabel}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Total Income/Pool</span>
            <span className="text-base font-bold text-white">
              {formatCurrency(totalContribution, currency)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Total Expenses</span>
            <span className="text-base font-bold text-orange-400">
              {formatCurrency(totalExpenses, currency)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Fixed Recurring</span>
            <span className="text-base font-bold text-emerald-400">
              {formatCurrency(fixedExpensesTotal, currency)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Remaining Balance</span>
            <span className="text-base font-bold text-emerald-300">
              {formatCurrency(remainingBalance, currency)}
            </span>
          </div>
        </div>
      </Card>

      {/* Export Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CSV Export Button Card */}
        <Card className="flex flex-col justify-between space-y-4 hover:border-emerald-300">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Export CSV Spreadsheet</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Download raw structured CSV data compatible with Microsoft Excel, Google Sheets, or Numbers.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4" />}
            className="w-full"
          >
            Export CSV File
          </Button>
        </Card>

        {/* PDF Export Button Card */}
        <Card className="flex flex-col justify-between space-y-4 hover:border-orange-300">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Export Formatted PDF Statement</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate a clean, printable PDF financial report complete with header, summary cards, and itemized transaction tables.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleExportPDF}
            icon={<Download className="w-4 h-4" />}
            className="w-full"
          >
            Export PDF Report
          </Button>
        </Card>
      </div>
    </div>
  );
}
