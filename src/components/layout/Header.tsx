"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronDown, TrendingUp, Bell, User } from "lucide-react";
import { useFinance } from "@/context/FinanceContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { playClickSound } from "@/lib/sound";

export const Header: React.FC = () => {
  const { selectedMonth, setSelectedMonth, availableMonths } = useFinance();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playClickSound();
    setSelectedMonth(e.target.value);
  };

  const handleToggleNotif = () => {
    playClickSound();
    setIsNotifOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
      {/* Mobile Logo Title */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" onClick={playClickSound} className="md:hidden flex items-center gap-2">
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
              onChange={handleMonthChange}
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
      <div className="flex items-center gap-2.5 relative">
        {/* Notification Bell Badge Button */}
        <button
          onClick={handleToggleNotif}
          className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 border border-slate-200/60 transition-all flex items-center justify-center group shadow-2xs"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-slate-700 group-hover:rotate-12 transition-transform duration-200" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white font-black text-[10px] rounded-full flex items-center justify-center ring-2 ring-white shadow-xs pointer-events-none transition-transform group-hover:scale-110">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Header Notification Panel Dropdown */}
        <NotificationPanel
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
        />

        {/* User Profile Avatar Link */}
        <Link
          href="/profile"
          onClick={playClickSound}
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
