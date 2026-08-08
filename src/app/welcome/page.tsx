"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFinance } from "@/context/FinanceContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles, Wallet, Users, CalendarDays, ArrowRight, Check } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { updateSettings, addMember, addFixedExpense } = useFinance();

  const [step, setStep] = useState<"choose" | "budget" | "member" | "fixed">("choose");
  const [budgetInput, setBudgetInput] = useState("15000");

  // Member form state
  const [memberName, setMemberName] = useState("");
  const [memberAmount, setMemberAmount] = useState("3000");

  // Fixed bill form state
  const [fixedTitle, setFixedTitle] = useState("");
  const [fixedAmount, setFixedAmount] = useState("5000");

  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(budgetInput) || 15000;
    updateSettings({ monthlyBudget: amount });
    setSavedMessage("Monthly budget configured!");
    setTimeout(() => {
      setSavedMessage(null);
      setStep("choose");
    }, 1500);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    addMember({
      name: memberName.trim(),
      contributionAmount: parseFloat(memberAmount) || 2500,
      isPaid: true,
    });
    setSavedMessage(`Added ${memberName}!`);
    setMemberName("");
    setTimeout(() => {
      setSavedMessage(null);
      setStep("choose");
    }, 1500);
  };

  const handleAddFixed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fixedTitle.trim()) return;
    addFixedExpense({
      title: fixedTitle.trim(),
      amount: parseFloat(fixedAmount) || 5000,
      category: "Rent",
      dueDate: 5,
      frequency: "Monthly",
      status: "pending",
    });
    setSavedMessage(`Added ${fixedTitle}!`);
    setFixedTitle("");
    setTimeout(() => {
      setSavedMessage(null);
      setStep("choose");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-orange-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome to FinTrack, {user?.displayName || user?.username || "Friend"}! 🎉
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your account is ready with a clean slate (₹0 balance). What would you like to set up first?
          </p>
        </div>

        {savedMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            {savedMessage}
          </div>
        )}

        {/* Step Chooser */}
        {step === "choose" && (
          <div className="space-y-3">
            <button
              onClick={() => setStep("budget")}
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Set Monthly Budget Limit</h4>
                  <p className="text-xs text-slate-500">Configure your target monthly spending threshold</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setStep("member")}
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Add Group Members</h4>
                  <p className="text-xs text-slate-500">Track 5-member pooled monthly contributions</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setStep("fixed")}
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Add Fixed Recurring Bills</h4>
                  <p className="text-xs text-slate-500">Add rent, electricity, or internet bills</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </button>

            <div className="pt-4 text-center">
              <Button
                variant="primary"
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 shadow-md shadow-emerald-600/20"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* Budget Form Step */}
        {step === "budget" && (
          <form onSubmit={handleSaveBudget} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Set Target Monthly Budget</h3>
            <Input
              label="Target Budget Amount (₹)"
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              required
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep("choose")}>Back</Button>
              <Button type="submit" variant="primary">Save Budget</Button>
            </div>
          </form>
        )}

        {/* Member Form Step */}
        {step === "member" && (
          <form onSubmit={handleAddMember} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add First Contributing Member</h3>
            <Input
              label="Member Full Name"
              placeholder="e.g. Rahul Sharma"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              required
            />
            <Input
              label="Monthly Contribution (₹)"
              type="number"
              value={memberAmount}
              onChange={(e) => setMemberAmount(e.target.value)}
              required
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep("choose")}>Back</Button>
              <Button type="submit" variant="primary">Add Member</Button>
            </div>
          </form>
        )}

        {/* Fixed Bill Step */}
        {step === "fixed" && (
          <form onSubmit={handleAddFixed} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Recurring Fixed Expense</h3>
            <Input
              label="Bill Title"
              placeholder="e.g. House Rent, Airtel Fiber"
              value={fixedTitle}
              onChange={(e) => setFixedTitle(e.target.value)}
              required
            />
            <Input
              label="Amount (₹)"
              type="number"
              value={fixedAmount}
              onChange={(e) => setFixedAmount(e.target.value)}
              required
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep("choose")}>Back</Button>
              <Button type="submit" variant="primary">Add Fixed Bill</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
