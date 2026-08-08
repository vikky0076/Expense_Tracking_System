"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { isSoundEnabled, setSoundEnabled as setLocalSoundEnabled, playClickSound, playSuccessSound } from "@/lib/sound";
import { ReminderTiming } from "@/types";
import { Volume2, VolumeX, Bell, Wallet, RefreshCw, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData } = useFinance();

  const [currency, setCurrency] = useState(settings.currency || "₹");
  const [budgetInput, setBudgetInput] = useState(String(settings.monthlyBudget || 0));
  const [soundActive, setSoundActive] = useState<boolean>(isSoundEnabled());
  const [reminderTiming, setReminderTiming] = useState<ReminderTiming>(settings.reminderTiming || "1_day");

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    const budget = parseFloat(budgetInput) || 0;
    updateSettings({
      currency,
      monthlyBudget: budget,
      soundEnabled: soundActive,
      reminderTiming,
    });
    setLocalSoundEnabled(soundActive);

    playSuccessSound();
    setSavedMessage("Settings saved successfully!");
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleToggleSound = () => {
    const nextState = !soundActive;
    setSoundActive(nextState);
    setLocalSoundEnabled(nextState);
    if (nextState) {
      playSuccessSound();
    }
  };

  const handleResetData = () => {
    resetAllData();
    setIsResetConfirmOpen(false);
    setSavedMessage("All data reset successfully!");
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-emerald-700/20 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Application Settings</h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
          Configure currency preference, monthly budget threshold, Web Audio sounds, and bill reminder timing.
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {savedMessage}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Currency & Financial Preferences */}
        <Card className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Financial Preferences</h3>
              <p className="text-xs text-slate-500">Configure default currency symbol and target monthly budget</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Currency Symbol"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: "₹", label: "Indian Rupee (₹)" },
                { value: "$", label: "US Dollar ($)" },
                { value: "€", label: "Euro (€)" },
                { value: "£", label: "British Pound (£)" },
              ]}
            />

            <Input
              label="Monthly Target Budget Threshold"
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="e.g. 25000"
            />
          </div>
        </Card>

        {/* Notifications & Reminders */}
        <Card className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Fixed Bill Reminders</h3>
              <p className="text-xs text-slate-500">Choose when upcoming bill due notifications should be generated</p>
            </div>
          </div>

          <Select
            label="Default Bill Reminder Timing"
            value={reminderTiming}
            onChange={(e) => setReminderTiming(e.target.value as ReminderTiming)}
            options={[
              { value: "same_day", label: "On the Due Date (Same Day)" },
              { value: "1_day", label: "1 Day Before Due Date (Recommended)" },
              { value: "3_days", label: "3 Days Before Due Date" },
              { value: "7_days", label: "7 Days Before Due Date" },
            ]}
          />
        </Card>

        {/* Sound Feedback Settings */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                {soundActive ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Subtle Web Audio Feedback</h3>
                <p className="text-xs text-slate-500">Play soft, zero-latency feedback sounds on clicks and actions</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                soundActive ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  soundActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="px-8 py-3 font-bold">
            Save Preference Changes
          </Button>
        </div>
      </form>

      {/* Danger Zone: Data Reset */}
      <Card className="border-rose-200 bg-rose-50/40 space-y-3">
        <h3 className="text-base font-bold text-rose-900">Danger Zone — Reset Data</h3>
        <p className="text-xs text-rose-700 leading-relaxed">
          Resetting will clear all your local expenses, fixed bills, member contributions, tasks, and goals. This action cannot be undone.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsResetConfirmOpen(true)}
          className="border-rose-300 text-rose-600 hover:bg-rose-100 py-2.5 text-xs font-bold"
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Reset All Account Data
        </Button>
      </Card>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Financial Data?"
        message="Are you sure you want to delete all expenses, fixed bills, member records, and planner goals? This cannot be undone."
        confirmLabel="Yes, Reset Everything"
      />
    </div>
  );
}
