"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from "react";
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
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
  const currentMonthKey = useMemo(() => getMonthKey(), []);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ currency: "₹", monthlyBudget: 0, customCategories: [] });

  const storagePrefix = user ? `fintrack_${user.uid}_` : "fintrack_guest_";
  const isLoadedRef = useRef<boolean>(false);

  // Initialize data per user account (Firebase Cloud Sync + LocalStorage fallback)
  useEffect(() => {
    isLoadedRef.current = false;

    if (isDemo) {
      setExpenses(INITIAL_EXPENSES as any);
      setFixedExpenses(INITIAL_FIXED_EXPENSES as any);
      setMembers(INITIAL_MEMBERS as any);
      setTasks(INITIAL_TASKS as any);
      setGoals(INITIAL_GOALS as any);
      setSettings(INITIAL_SETTINGS);
      isLoadedRef.current = true;
      return;
    }

    if (!user) {
      setExpenses([]);
      setFixedExpenses([]);
      setMembers([]);
      setTasks([]);
      setGoals([]);
      setSettings({ currency: "₹", monthlyBudget: 0, customCategories: [] });
      isLoadedRef.current = true;
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      // 1. Instant local cache load
      let localExp: Expense[] = [];
      let localFixed: FixedExpense[] = [];
      let localMem: Member[] = [];
      let localTask: PlannerTask[] = [];
      let localGoal: FinancialGoal[] = [];
      let localSet: UserSettings = { currency: "₹", monthlyBudget: 0, customCategories: [] };

      try {
        const storedExp = localStorage.getItem(`${storagePrefix}expenses`);
        const storedFixed = localStorage.getItem(`${storagePrefix}fixed_expenses`);
        const storedMembers = localStorage.getItem(`${storagePrefix}members`);
        const storedTasks = localStorage.getItem(`${storagePrefix}tasks`);
        const storedGoals = localStorage.getItem(`${storagePrefix}goals`);
        const storedSettings = localStorage.getItem(`${storagePrefix}settings`);

        if (storedExp) localExp = JSON.parse(storedExp);
        if (storedFixed) localFixed = JSON.parse(storedFixed);
        if (storedMembers) localMem = JSON.parse(storedMembers);
        if (storedTasks) localTask = JSON.parse(storedTasks);
        if (storedGoals) localGoal = JSON.parse(storedGoals);
        if (storedSettings) localSet = JSON.parse(storedSettings);

        if (isMounted) {
          setExpenses(localExp);
          setFixedExpenses(localFixed);
          setMembers(localMem);
          setTasks(localTask);
          setGoals(localGoal);
          setSettings(localSet);
        }
      } catch (e) {
        console.warn("Local storage parse error:", e);
      }

      // 2. Fetch ground truth from Cloud Firestore across devices
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists() && isMounted) {
          const data = docSnap.data();
          if (Array.isArray(data.expenses)) {
            setExpenses(data.expenses);
            localStorage.setItem(`${storagePrefix}expenses`, JSON.stringify(data.expenses));
          }
          if (Array.isArray(data.fixedExpenses)) {
            setFixedExpenses(data.fixedExpenses);
            localStorage.setItem(`${storagePrefix}fixed_expenses`, JSON.stringify(data.fixedExpenses));
          }
          if (Array.isArray(data.members)) {
            setMembers(data.members);
            localStorage.setItem(`${storagePrefix}members`, JSON.stringify(data.members));
          }
          if (Array.isArray(data.tasks)) {
            setTasks(data.tasks);
            localStorage.setItem(`${storagePrefix}tasks`, JSON.stringify(data.tasks));
          }
          if (Array.isArray(data.goals)) {
            setGoals(data.goals);
            localStorage.setItem(`${storagePrefix}goals`, JSON.stringify(data.goals));
          }
          if (data.settings && typeof data.settings === "object") {
            setSettings(data.settings);
            localStorage.setItem(`${storagePrefix}settings`, JSON.stringify(data.settings));
          }
        } else if (!docSnap.exists() && isMounted) {
          // Push initial local data to Cloud Firestore for new cloud account
          await setDoc(userDocRef, {
            expenses: localExp,
            fixedExpenses: localFixed,
            members: localMem,
            tasks: localTask,
            goals: localGoal,
            settings: localSet,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }
      } catch (err) {
        console.warn("Firestore cloud fetch warning (using local cache):", err);
      } finally {
        if (isMounted) {
          isLoadedRef.current = true;
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user, isDemo, storagePrefix]);

  // Helper to persist state to LocalStorage and Cloud Firestore
  const syncToCloudAndLocal = useCallback(
    async (
      updatedExp: Expense[],
      updatedFixed: FixedExpense[],
      updatedMem: Member[],
      updatedTask: PlannerTask[],
      updatedGoal: FinancialGoal[],
      updatedSet: UserSettings
    ) => {
      if (!user || isDemo) return;

      // 1. LocalStorage
      try {
        localStorage.setItem(`${storagePrefix}expenses`, JSON.stringify(updatedExp));
        localStorage.setItem(`${storagePrefix}fixed_expenses`, JSON.stringify(updatedFixed));
        localStorage.setItem(`${storagePrefix}members`, JSON.stringify(updatedMem));
        localStorage.setItem(`${storagePrefix}tasks`, JSON.stringify(updatedTask));
        localStorage.setItem(`${storagePrefix}goals`, JSON.stringify(updatedGoal));
        localStorage.setItem(`${storagePrefix}settings`, JSON.stringify(updatedSet));
      } catch (e) {
        console.warn("LocalStorage write warning:", e);
      }

      // 2. Cloud Firestore across devices
      if (isLoadedRef.current) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(
            userDocRef,
            {
              expenses: updatedExp,
              fixedExpenses: updatedFixed,
              members: updatedMem,
              tasks: updatedTask,
              goals: updatedGoal,
              settings: updatedSet,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (e) {
          console.warn("Firestore cloud sync write error:", e);
        }
      }
    },
    [user, isDemo, storagePrefix]
  );

  // Sync to Cloud & Local when state changes after initial load
  useEffect(() => {
    if (isLoadedRef.current && user && !isDemo) {
      syncToCloudAndLocal(expenses, fixedExpenses, members, tasks, goals, settings);
    }
  }, [expenses, fixedExpenses, members, tasks, goals, settings, user, isDemo, syncToCloudAndLocal]);

  // Filter transactions for Selected Month
  const selectedMonthExpenses = useMemo(() => {
    return expenses.filter((exp) => exp.date && exp.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Total Member Contributions for Month
  const totalContribution = useMemo(() => {
    return members.reduce((sum, m) => sum + (m.contributionAmount || 0), 0);
  }, [members]);

  // Calculate Fixed Expenses for the Selected Month
  const fixedExpensesTotal = useMemo(() => {
    return fixedExpenses.reduce((sum, fe) => sum + (fe.amount || 0), 0);
  }, [fixedExpenses]);

  // Calculate Variable/Normal Expenses (Deduplicating manual fixed tags to prevent double counting)
  const variableExpensesTotal = useMemo(() => {
    return selectedMonthExpenses.reduce((sum, exp) => {
      if (exp.isFixed) return sum; // Skip if manually tagged as fixed to prevent double counting
      return sum + (exp.amount || 0);
    }, 0);
  }, [selectedMonthExpenses]);

  // SINGLE SOURCE OF TRUTH: Total Monthly Expenses = Fixed Bills + Variable Transactions
  const totalExpenses = useMemo(() => {
    return fixedExpensesTotal + variableExpensesTotal;
  }, [fixedExpensesTotal, variableExpensesTotal]);

  // Remaining Balance = Total Member Pool - Total Expenses
  const remainingBalance = useMemo(() => {
    return totalContribution - totalExpenses;
  }, [totalContribution, totalExpenses]);

  // Savings Target Reserve
  const savings = useMemo(() => {
    return Math.max(0, remainingBalance);
  }, [remainingBalance]);

  // Budget Progress Percentage
  const budgetLimit = settings.monthlyBudget || totalContribution || 1;
  const budgetProgress = useMemo(() => {
    if (budgetLimit <= 0) return 0;
    return Math.min(150, Math.round((totalExpenses / budgetLimit) * 100));
  }, [totalExpenses, budgetLimit]);

  // Dynamically compute available month selector choices
  const availableMonths = useMemo(() => {
    const monthKeysSet = new Set<string>();
    monthKeysSet.add(currentMonthKey);
    expenses.forEach((e) => {
      if (e.date && e.date.length >= 7) {
        monthKeysSet.add(e.date.substring(0, 7));
      }
    });

    return Array.from(monthKeysSet)
      .sort()
      .reverse()
      .map((key) => ({
        key,
        label: getMonthLabel(key),
      }));
  }, [expenses, currentMonthKey]);

  // Month-over-Month comparison statistics
  const previousMonthStats = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split("-");
    const currentDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const prevMonthKey = getMonthKey(prevDate);
    const prevMonthLabel = getMonthLabel(prevMonthKey);

    const prevMonthExpenses = expenses.filter((exp) => exp.date && exp.date.startsWith(prevMonthKey));
    const prevVariableTotal = prevMonthExpenses.reduce((sum, exp) => (exp.isFixed ? sum : sum + (exp.amount || 0)), 0);
    const prevTotalExpenses = fixedExpensesTotal + prevVariableTotal;

    const diffAmount = Math.abs(totalExpenses - prevTotalExpenses);
    const diffPercent = prevTotalExpenses > 0 ? Math.round((diffAmount / prevTotalExpenses) * 100) : 0;
    const isLower = totalExpenses <= prevTotalExpenses;

    return {
      monthKey: prevMonthKey,
      monthLabel: prevMonthLabel,
      totalExpenses: prevTotalExpenses,
      diffAmount,
      diffPercent,
      isLower,
    };
  }, [selectedMonth, expenses, fixedExpensesTotal, totalExpenses]);

  // Actions (Memoized using useCallback to prevent child re-renders)
  const addExpense = useCallback((newExpData: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newExp: Expense = {
      ...newExpData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: now,
      updatedAt: now,
    };
    setExpenses((prev) => [newExp, ...prev]);
  }, [user]);

  const updateExpense = useCallback((id: string, updatedData: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addFixedExpense = useCallback((newFixedData: Omit<FixedExpense, "id" | "userId" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newFixed: FixedExpense = {
      ...newFixedData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: now,
      updatedAt: now,
    };
    setFixedExpenses((prev) => [newFixed, ...prev]);
  }, [user]);

  const updateFixedExpense = useCallback((id: string, updatedData: Partial<FixedExpense>) => {
    setFixedExpenses((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
  }, []);

  const deleteFixedExpense = useCallback((id: string) => {
    setFixedExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addMember = useCallback((newMemData: Omit<Member, "id" | "userId" | "createdAt">) => {
    const newMember: Member = {
      ...newMemData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
  }, [user]);

  const updateMember = useCallback((id: string, updatedData: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleMemberPaid = useCallback((id: string) => {
    setMembers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPaid: !item.isPaid } : item))
    );
  }, []);

  const addTask = useCallback((taskData: Omit<PlannerTask, "id" | "userId" | "createdAt">) => {
    const newTask: PlannerTask = {
      ...taskData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, [user]);

  const updateTask = useCallback((id: string, updatedData: Partial<PlannerTask>) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }, []);

  const toggleTaskCompleted = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addGoal = useCallback((goalData: Omit<FinancialGoal, "id" | "userId" | "createdAt">) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: generateId(),
      userId: user?.uid || "guest",
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
  }, [user]);

  const updateGoal = useCallback((id: string, updatedData: Partial<FinancialGoal>) => {
    setGoals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetAllData = useCallback(() => {
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
  }, [user, isDemo, storagePrefix]);

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
