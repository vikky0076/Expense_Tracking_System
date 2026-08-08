"use client";

import React, { useState } from "react";
import { PlannerTask } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CheckSquare, Square, Clock, Edit2, Trash2 } from "lucide-react";

interface TaskItemProps {
  task: PlannerTask;
  onToggleCompleted: (id: string) => void;
  onEdit: (task: PlannerTask) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompleted,
  onEdit,
  onDelete,
}) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const priorityStyles = {
    high: "bg-rose-50 text-rose-700 border-rose-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl p-4 border transition-all flex items-center justify-between gap-3 ${
          task.completed
            ? "border-slate-200 bg-slate-50/60 opacity-75"
            : "border-slate-200/80 shadow-soft hover:shadow-card hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3.5 overflow-hidden">
          <button
            onClick={() => onToggleCompleted(task.id)}
            className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0 p-1"
          >
            {task.completed ? (
              <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
            ) : (
              <Square className="w-5 h-5 text-slate-300" />
            )}
          </button>

          <div className="overflow-hidden">
            <h4
              className={`text-sm font-bold text-slate-900 truncate ${
                task.completed ? "line-through text-slate-400 font-normal" : ""
              }`}
            >
              {task.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              {task.time && (
                <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {task.time}
                </span>
              )}
              <span>•</span>
              <span className="font-medium">{formatDate(task.date)}</span>
              <span>•</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                  priorityStyles[task.priority]
                }`}
              >
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className="text-xs text-slate-500 mt-1 truncate">{task.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => onDelete(task.id)}
        title="Delete Planner Task"
        message={`Are you sure you want to delete task "${task.title}"?`}
      />
    </>
  );
};
