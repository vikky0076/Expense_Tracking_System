"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, getMonthLabel } from "@/lib/utils";
import { exportExpensesToCSV } from "@/lib/csvExporter";
import { FileSpreadsheet, FileText, Download, CheckCircle2 } from "lucide-react";

export default function ExportPage() {
  const {
    selectedMonth,
    selectedMonthExpenses,
    fixedExpensesTotal,
    variableExpensesTotal,
    monthlyCash,
    totalExpenses,
    remainingBalance,
    settings,
  } = useFinance();

  const monthLabel = getMonthLabel(selectedMonth);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadedStatus, setDownloadedStatus] = useState<string | null>(null);

  const handleExportCSV = () => {
    exportExpensesToCSV(selectedMonthExpenses, monthLabel);
    setDownloadedStatus("CSV Spreadsheet exported successfully!");
    setTimeout(() => setDownloadedStatus(null), 3000);
  };

  const handleExportPDF = async () => {
    setDownloadingPDF(true);
    try {
      // Dynamic import jsPDF generator only when requested
      const { exportExpensesToPDF } = await import("@/lib/pdfGenerator");
      exportExpensesToPDF({
        monthLabel,
        expenses: selectedMonthExpenses,
        fixedExpenses: fixedExpensesTotal,
        variableExpenses: variableExpensesTotal,
        totalContribution: monthlyCash,
        totalExpenses,
        remainingBalance,
        currency: settings.currency,
      });
      setDownloadedStatus("PDF Statement exported successfully!");
    } catch (e) {
      console.error("Failed to generate PDF statement:", e);
    } finally {
      setDownloadingPDF(false);
      setTimeout(() => setDownloadedStatus(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-emerald-700/20 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Export Financial Records</h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
          Download formatted PDF statements or raw CSV spreadsheet records for {monthLabel}.
        </p>
      </div>

      {downloadedStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {downloadedStatus}
        </div>
      )}

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export Option */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">CSV Spreadsheet Export</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Export all {selectedMonthExpenses.length} transaction records for {monthLabel} into an Excel-compatible CSV spreadsheet file.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="w-full py-3 text-xs font-bold"
            icon={<Download className="w-4 h-4 text-emerald-600" />}
          >
            Download CSV Spreadsheet
          </Button>
        </Card>

        {/* PDF Statement Export Option */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Formatted PDF Financial Statement</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Generate a clean, print-ready PDF statement with group member contributions, fixed bills, itemized expenses, and net balances.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleExportPDF}
            disabled={downloadingPDF}
            className="w-full py-3 text-xs font-bold"
            icon={<Download className="w-4 h-4" />}
          >
            {downloadingPDF ? "Generating PDF..." : "Download PDF Statement"}
          </Button>
        </Card>
      </div>

      {/* Monthly Summary Preview Table */}
      <Card className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Statement Preview — {monthLabel}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-500">Monthly Cash</span>
            <span className="text-base font-black text-slate-900 block mt-0.5">
              {formatCurrency(monthlyCash, settings.currency)}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-500">Total Month Spend</span>
            <span className="text-base font-black text-slate-900 block mt-0.5">
              {formatCurrency(totalExpenses, settings.currency)}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-500">Net Reserve Balance</span>
            <span className="text-base font-black text-emerald-600 block mt-0.5">
              {formatCurrency(remainingBalance, settings.currency)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

