"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  TrendingUp,
  Receipt,
  Wallet,
  CalendarDays,
  Paperclip,
  PieChart,
  CheckSquare,
  Target,
  FileSpreadsheet,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
                Fin<span className="text-emerald-600">Track</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Finance Planner
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="font-bold text-slate-700">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <span>Production-Ready Financial Management System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Track Your Money. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
              Plan Better.
            </span>{" "}
            Stay in Control.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            The simple, modern way to track monthly spending, manage pooled group funds, organize fixed recurring bills, and attach receipt proofs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full px-8 py-3.5 text-base shadow-lg shadow-emerald-600/20" icon={<ArrowRight className="w-5 h-5" />}>
                Get Started
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full px-8 py-3.5 text-base">
                Explore Features
              </Button>
            </a>
          </div>

          {/* Clean Fintech Graphic Mock Preview */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Monthly Budget Overview</h4>
                    <p className="text-xs text-slate-500">Group Cash Pool & Active Expenses</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  Healthy Budget
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl border border-emerald-200/80 shadow-xs">
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Monthly Cash</span>
                  <span className="text-base font-black text-emerald-600 block mt-0.5">Paid Cash</span>
                </div>
                <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl border border-amber-200/80 shadow-xs">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">Total Spent</span>
                  <span className="text-base font-black text-amber-600 block mt-0.5">Tracked Items</span>
                </div>
                <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-purple-50/60 rounded-2xl border border-indigo-200/80 shadow-xs">
                  <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider">Savings Target</span>
                  <span className="text-base font-black text-indigo-600 block mt-0.5">Net Reserve</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything You Need to Manage Money Cleanly
          </h2>
          <p className="text-sm text-slate-500">
            Designed for normal users to stay organized without complicated financial jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Expense Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Log daily transactions with categories, dates, payment methods, and detailed descriptions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Group Cash Pool</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track member pooled contributions, monthly payments, paid/unpaid status, and totals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Fixed Recurring Bills</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Never miss rent, electricity, or internet bills with due date reminders and payment status.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
              <Paperclip className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Expense Proof System</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload receipt screenshots and bills with automatic mobile image compression & lightbox viewer.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Spending Insights</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understand expenditure via bar, line, donut, and ratio charts with automated commentary.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Task Planner</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Schedule tasks for Today, Tomorrow, This Week, and Month with priority levels.
            </p>
          </div>

          {/* Card 7 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Financial Goals</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Set target savings goals, target dates, and track savings progress bars in real-time.
            </p>
          </div>

          {/* Card 8 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Export Reports</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download clean CSV spreadsheets or formatted PDF financial statement reports with one click.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-16 px-4 sm:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-xs text-slate-500">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Set Pool or Budget</h3>
              <p className="text-xs text-slate-500">
                Add member contribution targets or set your monthly spending limit.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Track Every Expense</h3>
              <p className="text-xs text-slate-500">
                Log daily transactions, recurring fixed bills, and attach receipt proofs.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Understand & Export</h3>
              <p className="text-xs text-slate-500">
                View charts, compare months, and export clean PDF or CSV reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Privacy & Security Section */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Financial Data is Private</h2>
        <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          Your records are stored securely with user-scoped database isolation using Firebase Authentication and Firestore Security Rules. Only you can access your financial data.
        </p>
      </section>

      {/* 6. Final CTA Section */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-black tracking-tight">Ready to take control of your expenses?</h2>
          <p className="text-emerald-100 text-sm">
            Create your account today and start managing group contributions and personal expenses.
          </p>
          <Link href="/auth/signup" className="inline-block">
            <Button variant="secondary" size="lg" className="px-8 py-3.5 text-base shadow-lg shadow-orange-500/20" icon={<ChevronRight className="w-5 h-5" />}>
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 text-center text-xs text-slate-400 space-y-1.5">
        <p>© {new Date().getFullYear()} FinTrack App. All rights reserved.</p>
        <p className="text-emerald-600 font-extrabold text-xs">Developed by VIGNESH</p>
      </footer>
    </div>
  );
}
