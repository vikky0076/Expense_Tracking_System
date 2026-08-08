"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Settings, RefreshCw, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData } = useFinance();

  const [currency, setCurrency] = useState(settings.currency || "₹");
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget?.toString() || "15000");
  const [isSaved, setIsSaved] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numBudget = parseFloat(monthlyBudget) || 15000;
    updateSettings({
      currency,
      monthlyBudget: numBudget,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600" />
          Application Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize currency symbols, budget limits, and application data
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Currency & Budget Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Default Currency Symbol"
              options={[
                { value: "₹", label: "₹ INR (Indian Rupee)" },
                { value: "$", label: "$ USD (US Dollar)" },
                { value: "€", label: "€ EUR (Euro)" },
                { value: "£", label: "£ GBP (British Pound)" },
              ]}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />

            <Input
              label="Target Monthly Budget Limit"
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {isSaved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Settings Saved Successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Changes persist automatically in local storage.
              </span>
            )}
            <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
              Save Settings
            </Button>
          </div>
        </Card>
      </form>

      {/* Reset Data Section */}
      <Card className="border-rose-200 bg-rose-50/20 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-rose-900">Reset Application Demo Data</h3>
          <p className="text-xs text-rose-600 mt-0.5">
            Reset expenses, fixed bills, member contributions, tasks, and goals to initial default seed state.
          </p>
        </div>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => setIsResetConfirmOpen(true)}
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Reset All Data
        </Button>
      </Card>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetAllData}
        title="Reset All Application Data"
        message="Are you sure you want to reset all transactions, members, fixed bills, and planner tasks back to initial seed data?"
      />
    </div>
  );
}
