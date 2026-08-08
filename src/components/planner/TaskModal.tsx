"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { PlannerTask, PriorityLevel, TaskTimeframe } from "@/types";
import { useFinance } from "@/context/FinanceContext";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: PlannerTask | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const { addTask, updateTask } = useFinance();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00 AM");
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [category, setCategory] = useState("Finance");
  const [timeframe, setTimeframe] = useState<TaskTimeframe>("today");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setDate(taskToEdit.date);
      setTime(taskToEdit.time || "10:00 AM");
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category || "Finance");
      setTimeframe(taskToEdit.timeframe || "today");
    } else {
      setTitle("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setTime("10:00 AM");
      setPriority("medium");
      setCategory("Finance");
      setTimeframe("today");
    }
    setError(null);
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter task title.");
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        date,
        time,
        priority,
        category,
        timeframe,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        date,
        time,
        priority,
        category,
        completed: false,
        timeframe,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? "Edit Task" : "Create New Planner Task"}
      description="Plan daily financial chores, bill payments, and reminders."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <Input
          label="Task Title"
          placeholder="e.g. Pay electricity bill, Review budget"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Time (e.g. 1:00 PM)"
            placeholder="1:00 PM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Select
            label="Timeframe"
            options={[
              { value: "today", label: "Today" },
              { value: "tomorrow", label: "Tomorrow" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ]}
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as TaskTimeframe)}
          />
          <Select
            label="Priority"
            options={[
              { value: "high", label: "🔴 High" },
              { value: "medium", label: "🟠 Medium" },
              { value: "low", label: "🟢 Low" },
            ]}
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
          />
          <Input
            label="Category"
            placeholder="Bills, Shopping..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <Input
          label="Description / Details"
          placeholder="Add extra notes or reminder details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {taskToEdit ? "Save Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
