"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Member } from "@/types";
import { useFinance } from "@/context/FinanceContext";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
}) => {
  const { addMember, updateMember } = useFinance();

  const [name, setName] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [email, setEmail] = useState("");
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setContributionAmount(memberToEdit.contributionAmount.toString());
      setEmail(memberToEdit.email || "");
      setIsPaid(memberToEdit.isPaid);
    } else {
      setName("");
      setContributionAmount("3000");
      setEmail("");
      setIsPaid(true);
    }
    setError(null);
  }, [memberToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter member name.");
      return;
    }
    const numAmount = parseFloat(contributionAmount);
    if (isNaN(numAmount) || numAmount < 0) {
      setError("Please enter a valid contribution amount.");
      return;
    }

    if (memberToEdit) {
      updateMember(memberToEdit.id, {
        name: name.trim(),
        contributionAmount: numAmount,
        email: email.trim() || undefined,
        isPaid,
      });
    } else {
      addMember({
        name: name.trim(),
        contributionAmount: numAmount,
        email: email.trim() || undefined,
        isPaid,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={memberToEdit ? "Edit Member Contribution" : "Add New Group Member"}
      description="Set individual contribution amount and payment status for monthly pool."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <Input
          label="Member Full Name"
          placeholder="e.g. Rahul Sharma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Monthly Contribution Amount (₹)"
          type="number"
          step="0.01"
          placeholder="2500.00"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          required
        />

        <Input
          label="Optional Email Address"
          type="email"
          placeholder="rahul@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Select
          label="Contribution Paid Status"
          options={[
            { value: "true", label: "✅ Paid Contribution" },
            { value: "false", label: "⏳ Pending Contribution" },
          ]}
          value={isPaid ? "true" : "false"}
          onChange={(e) => setIsPaid(e.target.value === "true")}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {memberToEdit ? "Save Changes" : "Add Member"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
