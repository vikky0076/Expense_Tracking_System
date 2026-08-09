"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/common/ImageUploader";
import { Expense, ExpenseCategory, PaymentMethod } from "@/types";
import { useFinance } from "@/context/FinanceContext";
import { getTodayDateString } from "@/lib/utils";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
  onViewProof?: (url: string) => void;
}

const CATEGORY_OPTIONS = [
  { value: "Food", label: "🍔 Food & Dining" },
  { value: "Transport", label: "🚗 Transport & Fuel" },
  { value: "Shopping", label: "🛍️ Shopping & Supplies" },
  { value: "Bills", label: "💡 Bills & Utilities" },
  { value: "Rent", label: "🏠 Rent & Housing" },
  { value: "Education", label: "📚 Education & Courses" },
  { value: "Entertainment", label: "🎬 Entertainment & Subscriptions" },
  { value: "Health", label: "💊 Health & Pharmacy" },
  { value: "Travel", label: "✈️ Travel & Vacation" },
  { value: "Other", label: "📦 Other Expense" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "UPI", label: "📱 UPI / QR" },
  { value: "Cash", label: "💵 Cash" },
  { value: "Card", label: "💳 Debit / Credit Card" },
  { value: "Bank Transfer", label: "🏦 Bank Transfer (NEFT/IMPS)" },
  { value: "Other", label: "🌐 Other Method" },
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseToEdit,
  onViewProof,
}) => {
  const { addExpense, updateExpense } = useFinance();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [date, setDate] = useState(getTodayDateString());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [description, setDescription] = useState("");
  const [proofUrl, setProofUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date);
      setPaymentMethod(expenseToEdit.paymentMethod);
      setDescription(expenseToEdit.description || "");
      setProofUrl(expenseToEdit.proofUrl);
    } else {
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate(getTodayDateString());
      setPaymentMethod("UPI");
      setDescription("");
      setProofUrl(undefined);
    }
    setError(null);
  }, [expenseToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter an expense name.");
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, {
        title: title.trim(),
        amount: numAmount,
        category,
        date,
        paymentMethod,
        description: description.trim(),
        proofUrl,
      });
    } else {
      addExpense({
        title: title.trim(),
        amount: numAmount,
        category,
        date,
        paymentMethod,
        description: description.trim(),
        proofUrl,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? "Edit Expense Record" : "Add New Expense"}
      description="Enter transaction details and attach proof if available."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <Input
          label="Expense Name"
          placeholder="e.g. Lunch with team, Fuel refill, Groceries"
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
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
            label="Payment Method"
            options={PAYMENT_METHOD_OPTIONS}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          />
        </div>

        <Input
          label="Optional Description / Notes"
          placeholder="Add extra context or notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <ImageUploader
          value={proofUrl}
          onChange={setProofUrl}
          onViewProof={onViewProof}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {expenseToEdit ? "Save Changes" : "Add Expense"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
