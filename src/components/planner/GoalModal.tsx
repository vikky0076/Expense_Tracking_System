"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FinancialGoal } from "@/types";
import { useFinance } from "@/context/FinanceContext";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: FinancialGoal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
}) => {
  const { addGoal, updateGoal } = useFinance();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("2026-09-30");
  const [category, setCategory] = useState("Savings");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setTargetAmount(goalToEdit.targetAmount.toString());
      setCurrentAmount(goalToEdit.currentAmount.toString());
      setTargetDate(goalToEdit.targetDate);
      setCategory(goalToEdit.category || "Savings");
      setNotes(goalToEdit.notes || "");
    } else {
      setTitle("");
      setTargetAmount("10000");
      setCurrentAmount("0");
      setTargetDate("2026-09-30");
      setCategory("Savings");
      setNotes("");
    }
    setError(null);
  }, [goalToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter goal title.");
      return;
    }
    const numTarget = parseFloat(targetAmount);
    if (isNaN(numTarget) || numTarget <= 0) {
      setError("Please enter a valid target savings amount.");
      return;
    }
    const numCurrent = parseFloat(currentAmount) || 0;

    if (goalToEdit) {
      updateGoal(goalToEdit.id, {
        title: title.trim(),
        targetAmount: numTarget,
        currentAmount: numCurrent,
        targetDate,
        category,
        notes: notes.trim(),
      });
    } else {
      addGoal({
        title: title.trim(),
        targetAmount: numTarget,
        currentAmount: numCurrent,
        targetDate,
        category,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? "Edit Financial Goal" : "Create Financial Savings Goal"}
      description="Set a target savings goal, target date, and track your progress."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <Input
          label="Goal Title"
          placeholder="e.g. Save ₹10,000 for Festival, Emergency Reserve"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Target Amount (₹)"
            type="number"
            step="0.01"
            placeholder="10000.00"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
          <Input
            label="Current Saved Amount (₹)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Target Completion Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
          <Input
            label="Goal Category"
            placeholder="Savings, Event, Vacation..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <Input
          label="Notes / Strategy"
          placeholder="e.g. Save ₹2,500 every week..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {goalToEdit ? "Save Goal" : "Create Goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
