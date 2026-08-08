"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FixedExpense, ExpenseCategory } from "@/types";
import { useFinance } from "@/context/FinanceContext";

interface FixedExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixedToEdit?: FixedExpense | null;
}

const CATEGORY_OPTIONS = [
  { value: "Rent", label: "🏠 House Rent" },
  { value: "Bills", label: "💡 Electricity & Utilities" },
  { value: "Food", label: "🛒 Monthly Groceries" },
  { value: "Transport", label: "🚗 Transport / Pass" },
  { value: "Entertainment", label: "🎬 Subscriptions (Netflix/Spotify)" },
  { value: "Shopping", label: "🛍️ Maintenance & Supplies" },
  { value: "Other", label: "📦 Other Recurring" },
];

const FREQUENCY_OPTIONS = [
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly (Every 3 months)" },
  { value: "Yearly", label: "Yearly" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "⏳ Pending Payment" },
  { value: "paid", label: "✅ Already Paid" },
];

export const FixedExpenseModal: React.FC<FixedExpenseModalProps> = ({
  isOpen,
  onClose,
  fixedToEdit,
}) => {
  const { addFixedExpense, updateFixedExpense } = useFinance();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Rent");
  const [dueDate, setDueDate] = useState("5");
  const [frequency, setFrequency] = useState<"Monthly" | "Quarterly" | "Yearly">("Monthly");
  const [status, setStatus] = useState<"paid" | "pending">("pending");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fixedToEdit) {
      setTitle(fixedToEdit.title);
      setAmount(fixedToEdit.amount.toString());
      setCategory(fixedToEdit.category);
      setDueDate(fixedToEdit.dueDate.toString());
      setFrequency(fixedToEdit.frequency);
      setStatus(fixedToEdit.status);
      setNotes(fixedToEdit.notes || "");
    } else {
      setTitle("");
      setAmount("");
      setCategory("Rent");
      setDueDate("5");
      setFrequency("Monthly");
      setStatus("pending");
      setNotes("");
    }
    setError(null);
  }, [fixedToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter bill title.");
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid recurring amount.");
      return;
    }
    const numDueDate = parseInt(dueDate, 10);
    if (isNaN(numDueDate) || numDueDate < 1 || numDueDate > 31) {
      setError("Due date must be between 1 and 31.");
      return;
    }

    if (fixedToEdit) {
      updateFixedExpense(fixedToEdit.id, {
        title: title.trim(),
        amount: numAmount,
        category,
        dueDate: numDueDate,
        frequency,
        status,
        notes: notes.trim(),
      });
    } else {
      addFixedExpense({
        title: title.trim(),
        amount: numAmount,
        category,
        dueDate: numDueDate,
        frequency,
        status,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={fixedToEdit ? "Edit Fixed Recurring Expense" : "Add Fixed Recurring Expense"}
      description="Add recurring monthly bills like Rent, Electricity, Internet, Subscriptions."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <Input
          label="Recurring Bill Title"
          placeholder="e.g. House Rent, Airtel Internet, Electricity"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Input
            label="Due Day of Month (1-31)"
            type="number"
            min="1"
            max="31"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          />
          <Select
            label="Frequency"
            options={FREQUENCY_OPTIONS}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as any)}
          />
        </div>

        <Select
          label="Payment Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        />

        <Input
          label="Notes / Payment Details"
          placeholder="Owner bank account, account number, auto-debit note..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {fixedToEdit ? "Save Changes" : "Add Fixed Expense"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
