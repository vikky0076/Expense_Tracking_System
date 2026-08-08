"use client";

import React from "react";
import { Member } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, XCircle, Edit2, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberCardProps {
  member: Member;
  currency?: string;
  onTogglePaid?: (id: string) => void;
  onEdit?: (member: Member) => void;
  onDelete?: (id: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = React.memo(({
  member,
  currency = "₹",
  onTogglePaid,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition-all group">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold border border-slate-200 shrink-0">
          {member.name ? member.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {member.name}
          </h4>
          <span className="text-xs text-slate-400 truncate block">
            {member.email || "Group Contributor"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <span className="text-sm font-black text-slate-900 block">
            {formatCurrency(member.contributionAmount, currency)}
          </span>

          <button
            onClick={() => onTogglePaid?.(member.id)}
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors mt-0.5",
              member.isPaid
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
            )}
          >
            {member.isPaid ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {member.isPaid ? "Paid" : "Pending"}
          </button>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pl-1 border-l border-slate-100">
            {onEdit && (
              <button
                onClick={() => onEdit(member)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Edit Member"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(member.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

MemberCard.displayName = "MemberCard";
