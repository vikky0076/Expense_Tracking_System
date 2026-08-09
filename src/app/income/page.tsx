"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { MemberCard } from "@/components/income/MemberCard";
import { MemberModal } from "@/components/income/MemberModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Users, PlusCircle, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Member } from "@/types";
import { formatCurrency, getMonthLabel } from "@/lib/utils";

export default function IncomePage() {
  const {
    members,
    monthlyCash,
    pendingContribution,
    toggleMemberPaid,
    deleteMember,
    selectedMonth,
    availableMonths,
    settings,
  } = useFinance();

  const currency = settings.currency || "₹";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const paidCount = members.filter((m) => m.isPaid).length;

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            Group Income & Member Contributions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Group member cash for {getMonthLabel(selectedMonth)}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          icon={<PlusCircle className="w-4 h-4" />}
        >
          Add Member
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-emerald-50/50 border-emerald-200">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block mb-1">
            Monthly Cash
          </span>
          <h3 className="text-2xl font-black text-emerald-900">
            {formatCurrency(monthlyCash, currency)}
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            Collected from {paidCount} paid members
          </p>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Paid Member Cash
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {formatCurrency(monthlyCash, currency)}
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {paidCount} of {members.length} members paid
          </p>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Pending Contributions
            </span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {formatCurrency(pendingContribution, currency)}
          </h3>
          <p className="text-xs text-orange-600 font-medium mt-1">
            {members.length - paidCount} members pending
          </p>
        </Card>
      </div>

      {/* Member Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">Active Member Contributions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              currency={currency}
              onEdit={(item) => {
                setEditingMember(item);
                setIsModalOpen(true);
              }}
              onDelete={deleteMember}
              onTogglePaid={toggleMemberPaid}
            />
          ))}
        </div>
      </div>

      {/* Monthly Contribution History Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Contribution History Log</h3>
            <p className="text-xs text-slate-500">Historical cash records by month</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Automated Tracking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3 rounded-l-xl">Month</th>
                <th className="p-3">Monthly Cash (Paid)</th>
                <th className="p-3">Members Count</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {availableMonths.map((m) => (
                <tr key={m.key} className="hover:bg-slate-50/50 font-semibold text-slate-800">
                  <td className="p-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {m.label}
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    {formatCurrency(monthlyCash, currency)}
                  </td>
                  <td className="p-3">{members.length} Members</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Period
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMember(null);
        }}
        memberToEdit={editingMember}
      />
    </div>
  );
}

