"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Users,
  PieChart,
  CheckSquare,
  FileSpreadsheet,
  Settings,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Fixed Bills", href: "/fixed-expenses", icon: CalendarDays },
  { label: "Income & Members", href: "/income", icon: Users },
  { label: "Insights", href: "/insights", icon: PieChart },
  { label: "Planner & Goals", href: "/planner", icon: CheckSquare },
  { label: "Export", href: "/export", icon: FileSpreadsheet },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const DesktopSidebar: React.FC<{ onOpenAddModal: () => void }> = ({ onOpenAddModal }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 min-h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
              Fin<span className="text-emerald-600">Track</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
              Personal Finance
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Add Action Button */}
      <div className="px-4 py-4">
        <button
          onClick={onOpenAddModal}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Menu Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-emerald-600" : "text-slate-400"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Badge at Bottom */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-slate-200"
        >
          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm border border-orange-200 shrink-0">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-xs font-bold text-slate-800 truncate">
              {user?.displayName || user?.username || "User"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {user?.email || "user@fintrack.app"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
