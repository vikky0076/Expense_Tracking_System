"use client";

import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { TaskItem } from "@/components/planner/TaskItem";
import { TaskModal } from "@/components/planner/TaskModal";
import { FinancialGoalCard } from "@/components/planner/FinancialGoalCard";
import { GoalModal } from "@/components/planner/GoalModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckSquare, Target, PlusCircle, Calendar } from "lucide-react";
import { PlannerTask, FinancialGoal, TaskTimeframe } from "@/types";

export default function PlannerPage() {
  const { tasks, goals, toggleTaskCompleted, deleteTask, deleteGoal, settings } = useFinance();
  const currency = settings.currency || "₹";

  const [activeTimeframe, setActiveTimeframe] = useState<TaskTimeframe | "all">("today");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<PlannerTask | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (activeTimeframe === "all") return true;
    return t.timeframe === activeTimeframe;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-orange-600" />
            Financial Planner & Task Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize daily bill reminders, chores, and long-term savings goals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Add Task
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
            icon={<Target className="w-4 h-4" />}
          >
            New Savings Goal
          </Button>
        </div>
      </div>

      {/* 1. FINANCIAL SAVINGS GOALS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Financial Savings Goals
            </h2>
            <p className="text-xs text-slate-500">Track target savings milestones</p>
          </div>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            title="No savings goals set"
            description="Create your first savings goal e.g. Save ₹10,000 for emergency or festival celebrations."
            actionLabel="Add Savings Goal"
            onAction={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <FinancialGoalCard
                key={goal.id}
                goal={goal}
                currency={currency}
                onEdit={(g) => {
                  setEditingGoal(g);
                  setIsGoalModalOpen(true);
                }}
                onDelete={deleteGoal}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. DAILY & WEEKLY TASK PLANNER SECTION */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Task & Reminder Planner
            </h2>
            <p className="text-xs text-slate-500">Schedule daily payments, reviews, and tasks</p>
          </div>

          {/* Timeframe Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl self-start sm:self-auto">
            {(["today", "tomorrow", "week", "month", "all"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                  activeTimeframe === tf
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tf === "all" ? "All Tasks" : tf}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <EmptyState
            title="No planner tasks for this timeframe"
            description="Add reminders to stay ahead of electricity bills, rent payments, and budget reviews."
            actionLabel="Create Planner Task"
            onAction={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleCompleted={toggleTaskCompleted}
                onEdit={(t) => {
                  setEditingTask(t);
                  setIsTaskModalOpen(true);
                }}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        goalToEdit={editingGoal}
      />
    </div>
  );
}
