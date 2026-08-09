"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Plus,
  PieChart,
  Grid,
  FileSpreadsheet,
  CalendarDays,
  Users,
  Settings,
  User,
  X,
  Download,
  CheckSquare,
  CheckCircle2,
  Wallet,
  Target,
  Compass,
  Sparkles,
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
  const router = useRouter();
  const { selectedMonth, selectedMonthExpenses } = useFinance();
  
  const [isRudderOpen, setIsRudderOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const monthLabel = getMonthLabel(selectedMonth);

  // Quick Action items inside the Rudder Arc Speed-Dial Wheel
  const rudderArcActions = [
    {
      id: "add-expense",
      label: "New Expense",
      icon: Plus,
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/40",
      badge: "Primary",
      action: () => {
        onOpenAddModal();
      },
    },
    {
      id: "export-csv",
      label: "Export CSV",
      icon: Download,
      color: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-500/40",
      action: () => {
        exportExpensesToCSV(selectedMonthExpenses, `expenses-${selectedMonth}.csv`);
        setExportSuccessMsg("CSV Spreadsheet exported!");
        setTimeout(() => setExportSuccessMsg(null), 3000);
      },
    },
    {
      id: "fixed-bills",
      label: "Fixed Bills",
      icon: CalendarDays,
      color: "from-indigo-500 to-purple-500",
      shadow: "shadow-indigo-500/40",
      action: () => {
        router.push("/fixed-expenses");
      },
    },
    {
      id: "add-income",
      label: "Income & Pool",
      icon: Wallet,
      color: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/40",
      action: () => {
        router.push("/income");
      },
    },
    {
      id: "planner-goals",
      label: "Planner & Goals",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/40",
      action: () => {
        router.push("/planner");
      },
    },
  ];

  // Arc fan-out positioning coordinates (radii: X, Y offsets for semi-circle arc above FAB)
  const arcCoordinates = [
    { x: -110, y: -40 },  // Left end
    { x: -60,  y: -95 },  // Mid Left
    { x: 0,    y: -115 }, // Top Center
    { x: 60,   y: -95 },  // Mid Right
    { x: 110,  y: -40 },  // Right end
  ];

  const leftNavItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Expenses", href: "/expenses", icon: Receipt },
  ];

  const rightNavItems = [
    { label: "Insights", href: "/insights", icon: PieChart },
    { label: "More", isMoreToggle: true, icon: Grid },
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

  const toggleRudderMenu = () => {
    playClickSound();
    setIsMoreOpen(false);
    setIsRudderOpen((prev) => !prev);
  };

  const handleArcActionClick = (actionFn: () => void) => {
    playClickSound();
    setIsRudderOpen(false);
    actionFn();
  };

  return (
    <>
      {/* Dark Glass Backdrop Overlay when Rudder Arc Menu is active */}
      {isRudderOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsRudderOpen(false)}
        />
      )}

      {/* Floating Rudder Arc Speed-Dial Navigation items (Fanning Radial Arc above FAB) */}
      {isRudderOpen && (
        <div className="md:hidden fixed bottom-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="relative w-0 h-0 flex items-center justify-center">
            {rudderArcActions.map((item, idx) => {
              const pos = arcCoordinates[idx] || { x: 0, y: -90 };
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="absolute pointer-events-auto transition-transform flex flex-col items-center animate-arc-pop"
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    animationDelay: `${idx * 40}ms`,
                  }}
                >
                  <button
                    onClick={() => handleArcActionClick(item.action)}
                    className={cn(
                      "w-12 h-12 rounded-full bg-gradient-to-tr text-white flex items-center justify-center shadow-xl border-2 border-white/20 active:scale-90 hover:scale-110 transition-all duration-200 group relative",
                      item.color,
                      item.shadow
                    )}
                    aria-label={item.label}
                  >
                    <Icon className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-12" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-900 animate-ping" />
                    )}
                  </button>

                  {/* Micro Tooltip Pill */}
                  <span className="mt-1 px-2 py-0.5 text-[9px] font-bold text-slate-100 bg-slate-900/90 backdrop-blur-md rounded-md border border-slate-700/80 shadow-md whitespace-nowrap tracking-tight">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Floating Bottom Navigation Dock with Smooth Concave Center Notch */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 sm:left-8 sm:right-8 max-w-md mx-auto z-40 select-none">
        <div className="relative w-full h-[64px] flex items-center justify-between px-3 drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
          {/* SVG Smooth Capsule Dock with Dipped Notch Curve */}
          <svg
            className="absolute inset-0 w-full h-full text-slate-900/95 backdrop-blur-xl"
            viewBox="0 0 320 64"
            preserveAspectRatio="none"
          >
            <path
              d="M 32 0 L 110 0 C 124 0, 132 26, 160 26 C 188 26, 196 0, 210 0 L 288 0 C 305.6 0, 320 14.3, 320 32 C 320 49.7, 305.6 64, 288 64 L 32 64 C 14.3 64, 0 49.7, 0 32 C 0 14.3, 14.3 0, 32 0 Z"
              fill="currentColor"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />
          </svg>

          {/* Left Navigation Group */}
          <div className="relative z-10 flex items-center space-x-1 sm:space-x-3 pl-1">
            {leftNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    playClickSound();
                    setIsRudderOpen(false);
                    setIsMoreOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 relative group",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      isActive ? "text-emerald-400 scale-110" : "text-slate-400 group-hover:scale-105"
                    )}
                  />
                  <span className="text-[10px] mt-0.5 tracking-tight font-semibold">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Elevated Circular Green FAB (Nestled inside the Concave Notch) */}
          <div className="relative z-20 -mt-7 flex flex-col items-center">
            <button
              onClick={() => {
                playClickSound();
                setIsMoreOpen(false);
                setIsRudderOpen(false);
                onOpenAddModal();
              }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-800 hover:to-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-[0_8px_22px_rgba(4,120,87,0.6)] border-2 border-emerald-400/30 transition-all duration-200 focus:outline-none group"
              aria-label="Add Expense"
            >
              <Plus className="w-7 h-7 stroke-[3] transition-transform group-hover:scale-110" />
            </button>
          </div>

          {/* Right Navigation Group */}
          <div className="relative z-10 flex items-center space-x-1 sm:space-x-3 pr-1">
            {rightNavItems.map((item) => {
              const Icon = item.icon;

              if (item.isMoreToggle) {
                const isMoreActive =
                  isMoreOpen ||
                  ["/export", "/fixed-expenses", "/income", "/settings", "/profile"].includes(pathname);

                return (
                  <button
                    key="more-toggle-btn"
                    onClick={() => {
                      playClickSound();
                      setIsRudderOpen(false);
                      setIsMoreOpen((prev) => !prev);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 relative group",
                      isMoreActive
                        ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                    aria-label="More Features"
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        isMoreActive ? "text-emerald-400 scale-110" : "text-slate-400 group-hover:scale-105"
                      )}
                    />
                    <span className="text-[10px] mt-0.5 tracking-tight font-semibold">
                      More
                    </span>
                  </button>
                );
              }

              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href || item.label}
                  href={item.href || "#"}
                  onClick={() => {
                    playClickSound();
                    setIsRudderOpen(false);
                    setIsMoreOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 relative group",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      isActive ? "text-emerald-400 scale-110" : "text-slate-400 group-hover:scale-105"
                    )}
                  />
                  <span className="text-[10px] mt-0.5 tracking-tight font-semibold">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile "More" Drawer Slide-up Sheet */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMoreOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative z-10 bg-white rounded-t-3xl border-t border-slate-200 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
            {/* Drawer Handle / Header */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-3" />
              <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-600" />
                    All Features & Controls
                  </h3>
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
            </div>

            {/* Quick Export Banner Action */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 rounded-2xl text-white shadow-md space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                    Instant Download
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Export CSV for {monthLabel}</h4>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    exportExpensesToCSV(selectedMonthExpenses, `expenses-${selectedMonth}.csv`);
                    setExportSuccessMsg("CSV exported successfully!");
                    setTimeout(() => setExportSuccessMsg(null), 3000);
                  }}
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

            {/* Developed by VIGNESH Footer Badge */}
            <div className="pt-3 text-center border-t border-slate-100">
              <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 inline-block shadow-xs">
                Developed by VIGNESH
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

