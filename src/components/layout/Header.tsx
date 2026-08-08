"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ChevronDown, TrendingUp, Bell, User } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { selectedMonth, setSelectedMonth, availableMonths } = useFinance();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
      {/* Mobile Logo Title */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-base font-black tracking-tight text-slate-900">
            Fin<span className="text-emerald-600">Track</span>
          </span>
        </Link>

        {/* Month Selector Pill */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent outline-none cursor-pointer pr-4 font-bold text-slate-800 appearance-none"
            >
              {availableMonths.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none -ml-3" />
          </div>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2.5">
        {/* Notification Bell Badge */}
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>

        {/* User Profile Avatar Link */}
        <Link
          href="/profile"
          className="flex items-center gap-2 pl-2 border-l border-slate-200 group"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-300 group-hover:scale-105 transition-transform">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.username ? user.username.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-slate-700 max-w-[100px] truncate">
            {user?.displayName || user?.username || "User"}
          </span>
        </Link>
      </div>
    </header>
  );
};
