"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Plus,
  PieChart,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  onOpenAddModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenAddModal }) => {
  const pathname = usePathname();

  const mobileNavItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Expenses", href: "/expenses", icon: Receipt },
    { label: "Add", isAction: true, icon: Plus },
    { label: "Insights", href: "/insights", icon: PieChart },
    { label: "Planner", href: "/planner", icon: CheckSquare },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-lg pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {mobileNavItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key="add-btn"
                onClick={onOpenAddModal}
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

          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href || idx}
              href={item.href || "#"}
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
  );
};
