"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Expense,
  FixedExpense,
  Member,
  PlannerTask,
  FinancialGoal,
  UserSettings,
} from "@/types";
import {
  INITIAL_EXPENSES,
  INITIAL_FIXED_EXPENSES,
  INITIAL_MEMBERS,
  INITIAL_TASKS,
  INITIAL_GOALS,
  INITIAL_SETTINGS,
} from "@/lib/mockData";
import { getMonthKey, getMonthLabel, generateId } from "@/lib/utils";
import { useAuth } from "./AuthContext";

interface FinanceContextType {
  // State
  selectedMonth: string; // e.g. "2026-08"
  setSelectedMonth: (monthKey: string) => void;
  expenses: Expense[];
  fixedExpenses: FixedExpense[];
  members: Member[];
  tasks: PlannerTask[];
  goals: FinancialGoal[];
  settings: UserSettings;
  
  // Computed Metrics
  selectedMonthExpenses: Expense[];
  totalContribution: number;
  totalExpenses: number;
  fixedExpensesTotal: number;
  variableExpensesTotal: number;
  remainingBalance: number;
  savings: number;
  budgetProgress: number; // 0 to 100+
  previousMonthStats: {
    monthKey: string;
    monthLabel: string;
    totalExpenses: number;
    diffAmount: number;
    diffPercent: number;
    isLower: boolean;
  };
  availableMonths: { key: string; label: string }[];

  // Actions
  addExpense: (expense: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  addFixedExpense: (fixed: Omit<FixedExpense, "id" | "userId" | "createdAt" | "updatedAt">) => void;
  updateFixedExpense: (id: string, fixed: Partial<FixedExpense>) => void;
  deleteFixedExpense: (id: string) => void;

  addMember: (member: Omit<Member, "id" | "userId" | "createdAt">) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  toggleMemberPaid: (id: string) => void;

  addTask: (task: Omit<PlannerTask, "id" | "userId" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<PlannerTask>) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;

  addGoal: (goal: Omit<FinancialGoal, "id" | "userId" | "createdAt">) => void;
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => void;
  deleteGoal: (id: string) => void;

  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetAllData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemo } = useAuth();
  const currentMonthKey = getMonthKey();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ currency: "₹", monthlyBudget: 0, customCategories: [] });

  // Key prefix scoped to user ID or demo state
  const storagePrefix = user ? `fintrack_${user.uid}_` : "fintrack_guest_";

  // Initialize data per user account (NO DEMO DATA for real users!)
  useEffect(() => {
    if (isDemo) {
      // If explicit Demo Mode is active, populate rich demo dataset
      setExpenses(INITIAL_EXPENSES as any);
      setFixedExpenses(INITIAL_FIXED_EXPENSES as any);
      setMembers(INITIAL_MEMBERS as any);
      setTasks(INITIAL_TASKS as any);
      setGoals(INITIAL_GOALS as any);
      setSettings(INITIAL_SETTINGS);
      return;
    }

    if (!user) {
      setExpenses([]);
      setFixedExpenses([]);
      setMembers([]);
      setTasks([]);
      setGoals([]);
      setSettings({ currency: "₹", monthlyBudget: 0, customCategories: [] });
      return;
    }

    // Real user state - load user-scoped records or default to clean EMPTY arrays (₹0)
    try {
      const storedExp = localStorage.getItem(`${storagePrefix}expenses`);
      const storedFixed = localStorage.getItem(`${storagePrefix}fixed_expenses`);
      const storedMembers = localStorage.getItem(`${storagePrefix}members`);
      const storedTasks = localStorage.getItem(`${storagePrefix}tasks`);
      const storedGoals = localStorage.getItem(`${storagePrefix}goals`);
      const storedSettings = localStorage.getItem(`${storagePrefix}settings`);

      setExpenses(storedExp ? JSON.parse(storedExp) : []);
      setFixedExpenses(storedFixed ? JSON.parse(storedFixed) : []);
      setMembers(storedMembers ? JSON.parse(storedMembers) : []);
      setTasks(storedTasks ? JSON.parse(storedTasks) : []);
      setGoals(storedGoals ? JSON.parse(storedGoals) : []);
      setSettings(storedSettings ? JSON.parse(storedSettings) : { currency: "₹", monthlyBudget: 0, customCategories: [] });
    } catch (e) {
      console.error("Failed to parse user local data:", e);
      setExpenses([]);
      setFixedExpenses([]);
      setMembers([]);
      setTasks([]);
      setGoals([]);
      setSettings({ currency: "₹", monthlyBudget: 0, customCategories: [] });
    }
  }, [user, isDemo, storagePrefix]);

  // Persist changes to LocalStorage scoped by user ID
  useEffect(() => {
    if (user && !isDemo) {
      localStorage.setItem(`${storagePrefix}expenses`, JSON.stringify(expenses));
    }
  }, [expenses, user, isDemo, storagePrefix]);

  useEffect(() => {
    if (user && !isDemo) {
      localStorage.setItem(`${storagePrefix}fixed_expenses`, JSON.stringify(fixedExpenses));
    }
  }, [fixedExpenses, user, isDemo, storagePrefix]);

  useEffect(() => {
    if (user && !isDemo) {
      localStorage.setItem(`${storagePrefix}members`, JSON.stringify(members));
    }
  }, [members, user, isDemo, storagePrefix]);

  useEffect(() => {
    if (user && !isDemo) {
      localStorage.setItem(`${storagePrefix}tasks`, JSON.stringify(tasks));
    }
  }, [tasks, user, isDemo, storagePrefix]);

  useEffect(() => {
    if (user && !isDemo) {
      localStorage.setItem(`${storagePrefix}goals`, JSON.stringify(goals));
    }
  }, [goals, user, isDemo, storagePrefix]);

  useEffect(() => {
    if (user && !isDemo) {
      localStorage.setItem(`${storagePrefix}settings`, JSON.stringify(settings));
    }
  }, [settings, user, isDemo, storagePrefix]);

  // Derived Expenses for Selected Month
  const selectedMonthExpenses = expenses.filter((exp) => exp.date.startsWith(selectedMonth));

  // Calculate Total Member Contributions
  const totalContribution = members.reduce((sum, m) => sum + (m.contributionAmount || 0), 0);

  // Calculate Total Expenses for Month
  const totalExpenses = selectedMonthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  // Fixed vs Variable
  const fixedExpensesTotal = fixedExpenses.reduce((sum, fe) => sum + (fe.amount || 0), 0);
  const variableExpensesTotal = Math.max(0, totalExpenses - fixedExpensesTotal);

  // Remaining Balance & Savings
  const remainingBalance = totalContribution - totalExpenses;
  const savings = Math.max(0, remainingBalance);

  // Budget Progress
  const budgetLimit = settings.monthlyBudget || totalContribution || 1;
  const budgetProgress = budgetLimit > 0 ? Math.min(150, Math.round((totalExpenses / budgetLimit) * 100)) : 0;

  // Compute Available Months dynamically
  const monthKeysSet = new Set<string>();
  monthKeysSet.add(currentMonthKey);
  expenses.forEach((e) => {
    if (e.date && e.date.length >= 7) {
      monthKeysSet.add(e.date.substring(0, 7));
    }
  });

  const availableMonths = Array.from(monthKeysSet)
    .sort()
    .reverse()
    .map((key) => ({
      key,
      label: getMonthLabel(key),
    }));

  // Previous Month Comparison
  const [yearStr, monthStr] = selectedMonth.split("-");
  const currentDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonthKey = getMonthKey(prevDate);
  const prevMonthLabel = getMonthLabel(prevMonthKey);

  const prevMonthExpenses = expenses.filter((exp) => exp.date.startsWith(prevMonthKey));
  const prevTotalExpenses = prevMonthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const diffAmount = Math.abs(totalExpenses - prevTotalExpenses);
  const diffPercent = prevTotalExpenses > 0 ? Math.round((diffAmount / prevTotalExpenses) * 100) : 0;
  const isLower = totalExpenses <= prevTotalExpenses;

  const previousMonthStats = {
    monthKey: prevMonthKey,
    monthLabel: prevMonthLabel,
    totalExpenses: prevTotalExpenses,
    diffAmount,
    diffPercent,
    isLower,
  };

  // Actions
  const addExpense = (newExpData: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newExp: Expense = {
      ...newExpData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: now,
      updatedAt: now,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const updateExpense = (id: string, updatedData: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const addFixedExpense = (newFixedData: Omit<FixedExpense, "id" | "userId" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newFixed: FixedExpense = {
      ...newFixedData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: now,
      updatedAt: now,
    };
    setFixedExpenses((prev) => [newFixed, ...prev]);
  };

  const updateFixedExpense = (id: string, updatedData: Partial<FixedExpense>) => {
    setFixedExpenses((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteFixedExpense = (id: string) => {
    setFixedExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const addMember = (newMemData: Omit<Member, "id" | "userId" | "createdAt">) => {
    const newMember: Member = {
      ...newMemData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const updateMember = (id: string, updatedData: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleMemberPaid = (id: string) => {
    setMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPaid: !item.isPaid } : item))
    );
  };

  const addTask = (taskData: Omit<PlannerTask, "id" | "userId" | "createdAt">) => {
    const newTask: PlannerTask = {
      ...taskData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updatedData: Partial<PlannerTask>) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  const addGoal = (goalData: Omit<FinancialGoal, "id" | "userId" | "createdAt">) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updatedData: Partial<FinancialGoal>) => {
    setGoals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetAllData = () => {
    setExpenses([]);
    setFixedExpenses([]);
    setMembers([]);
    setTasks([]);
    setGoals([]);
    setSettings({ currency: "₹", monthlyBudget: 0, customCategories: [] });
    if (user && !isDemo) {
      localStorage.removeItem(`${storagePrefix}expenses`);
      localStorage.removeItem(`${storagePrefix}fixed_expenses`);
      localStorage.removeItem(`${storagePrefix}members`);
      localStorage.removeItem(`${storagePrefix}tasks`);
      localStorage.removeItem(`${storagePrefix}goals`);
      localStorage.removeItem(`${storagePrefix}settings`);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        expenses,
        fixedExpenses,
        members,
        tasks,
        goals,
        settings,
        selectedMonthExpenses,
        totalContribution,
        totalExpenses,
        fixedExpensesTotal,
        variableExpensesTotal,
        remainingBalance,
        savings,
        budgetProgress,
        previousMonthStats,
        availableMonths,
        addExpense,
        updateExpense,
        deleteExpense,
        addFixedExpense,
        updateFixedExpense,
        deleteFixedExpense,
        addMember,
        updateMember,
        deleteMember,
        toggleMemberPaid,
        addTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
        addGoal,
        updateGoal,
        deleteGoal,
        updateSettings,
        resetAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
