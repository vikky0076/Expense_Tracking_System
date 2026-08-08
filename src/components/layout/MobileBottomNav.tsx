"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Plus,
  PieChart,
  MoreHorizontal,
  FileSpreadsheet,
  CalendarDays,
  Users,
  Settings,
  User,
  X,
  Download,
  CheckSquare,
  CheckCircle2,
} from "lucide-react";
import { cn, getMonthLabel } from "@/lib/utils";
import { useFinance } from "@/context/FinanceContext";
import { exportExpensesToCSV } from "@/lib/csvExporter";
import { playClickSound } from "@/lib/sound";

interface MobileBottomNavProps {
  onOpenAddModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenAddModal }) => {
  const pathname = usePathname();
  const { selectedMonth, selectedMonthExpenses } = useFinance();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const monthLabel = getMonthLabel(selectedMonth);

  const mobileNavItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Expenses", href: "/expenses", icon: Receipt },
    { label: "Add", isAction: true, icon: Plus },
    { label: "Insights", href: "/insights", icon: PieChart },
    { label: "More", isMoreToggle: true, icon: MoreHorizontal },
  ];

  const moreMenuItems = [
    {
      label: "Export CSV & PDF",
      subtitle: "Download spreadsheets & financial reports",
      href: "/export",
      icon: FileSpreadsheet,
      badge: "Export",
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Fixed Bills",
      subtitle: "Recurring subscriptions & bills",
      href: "/fixed-expenses",
      icon: CalendarDays,
    },
    {
      label: "Income & Members",
      subtitle: "Group cash pool & member payments",
      href: "/income",
      icon: Users,
    },
    {
      label: "Planner & Goals",
      subtitle: "Tasks, reminders & savings targets",
      href: "/planner",
      icon: CheckSquare,
    },
    {
      label: "Settings",
      subtitle: "Currency, budget & app preferences",
      href: "/settings",
      icon: Settings,
    },
    {
      label: "My Profile",
      subtitle: "Account info & security",
      href: "/profile",
      icon: User,
    },
  ];

  const handleQuickExportCSV = () => {
    playClickSound();
    exportExpensesToCSV(selectedMonthExpenses, `expenses-${selectedMonth}.csv`);
    setExportSuccessMsg("CSV Spreadsheet exported successfully!");
    setTimeout(() => setExportSuccessMsg(null), 3000);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-lg pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {mobileNavItems.map((item, idx) => {
            if (item.isAction) {
              return (
                <button
                  key="add-btn"
                  onClick={() => {
                    playClickSound();
                    onOpenAddModal();
                  }}
                  className="flex flex-col items-center justify-center -mt-5 focus:outline-none group"
                  aria-label="Add Expense"
                >
                  <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 border-3 border-white group-active:scale-95 transition-transform">
                    <Plus className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 mt-0.5">
                    Add
                  </span>
                </button>
              );
            }

            if (item.isMoreToggle) {
              const isMoreActive =
                isMoreOpen ||
                ["/export", "/fixed-expenses", "/income", "/settings", "/profile"].includes(pathname);

              return (
                <button
                  key="more-btn"
                  onClick={() => {
                    playClickSound();
                    setIsMoreOpen((prev) => !prev);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 text-slate-500",
                    isMoreActive && "text-emerald-600 font-bold"
                  )}
                  aria-label="More options"
                >
                  <MoreHorizontal
                    className={cn(
                      "w-5 h-5 transition-transform",
                      isMoreActive ? "text-emerald-600 scale-110" : "text-slate-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] mt-0.5 tracking-tight font-medium",
                      isMoreActive && "font-bold text-emerald-600"
                    )}
                  >
                    More
                  </span>
                </button>
              );
            }

            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href || idx}
                href={item.href || "#"}
                onClick={() => {
                  playClickSound();
                  setIsMoreOpen(false);
                }}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 text-slate-500",
                  isActive && "text-emerald-600 font-bold"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive ? "text-emerald-600 scale-110" : "text-slate-400"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] mt-0.5 tracking-tight font-medium",
                    isActive && "font-bold text-emerald-600"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile "More" Drawer Slide-up Sheet */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMoreOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative z-10 bg-white rounded-t-3xl border-t border-slate-200 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">All Features & Export</h3>
                <p className="text-xs text-slate-500">Quick access to options and reports</p>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Export Banner Action */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 rounded-2xl text-white shadow-md space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                    Instant Download
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Export CSV for {monthLabel}</h4>
                </div>
                <button
                  onClick={handleQuickExportCSV}
                  className="px-3 py-2 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-black shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform shrink-0"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  Export CSV
                </button>
              </div>
              {exportSuccessMsg && (
                <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  {exportSuccessMsg}
                </div>
              )}
            </div>

            {/* Grid of Navigation Links */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {moreMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      playClickSound();
                      setIsMoreOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-2xl border transition-all",
                      isActive
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-900 font-bold"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                          isActive
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-600 border-slate-200"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "text-[10px] font-extrabold px-2 py-0.5 rounded-full",
                                item.badgeColor || "bg-slate-200 text-slate-700"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
