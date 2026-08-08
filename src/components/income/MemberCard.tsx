"use client";

import React, { useState } from "react";
import { Member } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CheckCircle2, Clock, Edit2, Trash2, User } from "lucide-react";

interface MemberCardProps {
  member: Member;
  currency?: string;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  currency = "₹",
  onEdit,
  onDelete,
  onTogglePaid,
}) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-200 shrink-0">
              {member.name ? member.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {member.name}
              </h4>
              {member.email && (
                <p className="text-xs text-slate-400 font-medium truncate max-w-[140px]">
                  {member.email}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => onTogglePaid(member.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              member.isPaid
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
            }`}
          >
            {member.isPaid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Paid
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                Unpaid
              </>
            )}
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Monthly Contribution
            </span>
            <span className="text-base font-black text-slate-900">
              {formatCurrency(member.contributionAmount, currency)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(member)}
              icon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2"
              title="Delete Member"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => onDelete(member.id)}
        title="Remove Member"
        message={`Are you sure you want to remove "${member.name}" from group contributions?`}
      />
    </>
  );
};
