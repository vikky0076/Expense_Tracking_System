"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
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
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { playSuccessSound } from "@/lib/sound";

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
  loading: boolean;
  error: string | null;
  
  // Computed Metrics
  selectedMonthExpenses: Expense[];
  monthlyCash: number; // Sum of PAID member contributions
  pendingContribution: number; // Sum of PENDING member contributions
  totalContribution: number; // Alias for monthlyCash for backward compatibility
  paidFixedExpensesTotal: number; // Sum of PAID fixed bills
  pendingFixedExpensesTotal: number; // Sum of PENDING fixed bills
  fixedExpensesTotal: number; // Sum of PAID fixed bills (counts toward expenses)
  variableExpensesTotal: number; // Sum of normal variable expenses
  totalExpenses: number; // Paid Fixed Bills + Variable Expenses
  remainingBalance: number; // Monthly Cash - Total Expenses
  savings: number; // Math.max(0, remainingBalance)
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
  toggleFixedExpenseStatus: (id: string) => void;

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time Cloud Firestore updates for single source of truth across devices
  useEffect(() => {
    if (isDemo) {
      setExpenses(INITIAL_EXPENSES as any);
      setFixedExpenses(INITIAL_FIXED_EXPENSES as any);
      setMembers(INITIAL_MEMBERS as any);
      setTasks(INITIAL_TASKS as any);
      setGoals(INITIAL_GOALS as any);
      setSettings(INITIAL_SETTINGS);
      setLoading(false);
      return;
    }

    if (!user) {
      setExpenses([]);
      setFixedExpenses([]);
      setMembers([]);
      setTasks([]);
      setGoals([]);
      setSettings({ currency: "₹", monthlyBudget: 0, customCategories: [] });
      setLoading(false);
      return;
    }

    setError(null);
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
          setFixedExpenses(Array.isArray(data.fixedExpenses) ? data.fixedExpenses : []);
          setMembers(Array.isArray(data.members) ? data.members : []);
          setTasks(Array.isArray(data.tasks) ? data.tasks : []);
          setGoals(Array.isArray(data.goals) ? data.goals : []);
          if (data.settings && typeof data.settings === "object") {
            setSettings(data.settings);
          }
        } else {
          // Initialize document once in Firestore for a brand-new user account
          try {
            await setDoc(
              userDocRef,
              {
                uid: user.uid,
                email: user.email,
                username: user.username,
                expenses: [],
                fixedExpenses: [],
                members: [],
                tasks: [],
                goals: [],
                settings: { currency: "₹", monthlyBudget: 0, customCategories: [] },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (e: any) {
            console.error("Error initializing user doc in Firestore:", e);
          }
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setError("Unable to sync data with Cloud Firestore. Please check your network connection.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isDemo]);

  // Helper to persist updates directly to Firestore
  const saveToFirestore = useCallback(
    async (dataToUpdate: Record<string, any>) => {
      if (!user || isDemo) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        // Strip undefined fields unsupported by Firestore
        const sanitizedData = JSON.parse(JSON.stringify(dataToUpdate));
        await setDoc(
          userDocRef,
          {
            ...sanitizedData,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (e: any) {
        console.error("Error saving data to Firestore:", e);
        setError("Failed to save changes to the cloud. Please try again.");
      }
    },
    [user, isDemo]
  );

  // Filter transactions for Selected Month
  const selectedMonthExpenses = useMemo(() => {
    return expenses.filter((exp) => exp.date && exp.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Monthly Cash = SUM of member contributions WHERE status === "paid" (isPaid === true)
  const monthlyCash = useMemo(() => {
    return members.reduce((sum, m) => (m.isPaid ? sum + (m.contributionAmount || 0) : sum), 0);
  }, [members]);

  // Pending Contributions = SUM of member contributions WHERE status === "pending" (isPaid === false)
  const pendingContribution = useMemo(() => {
    return members.reduce((sum, m) => (!m.isPaid ? sum + (m.contributionAmount || 0) : sum), 0);
  }, [members]);

  // Alias for monthlyCash for backward compatibility
  const totalContribution = monthlyCash;

  // Paid Fixed Bills = SUM of fixed bills WHERE status === "paid"
  const paidFixedExpensesTotal = useMemo(() => {
    return fixedExpenses.reduce((sum, fe) => (fe.status === "paid" ? sum + (fe.amount || 0) : sum), 0);
  }, [fixedExpenses]);

  // Pending Fixed Bills = SUM of fixed bills WHERE status === "pending"
  const pendingFixedExpensesTotal = useMemo(() => {
    return fixedExpenses.reduce((sum, fe) => (fe.status !== "paid" ? sum + (fe.amount || 0) : sum), 0);
  }, [fixedExpenses]);

  // Fixed Expenses Total = Paid Fixed Bills (Only PAID bills count toward expenses)
  const fixedExpensesTotal = paidFixedExpensesTotal;

  // Variable Expenses Total (Deduplicating manual fixed tags to prevent double counting)
  const variableExpensesTotal = useMemo(() => {
    return selectedMonthExpenses.reduce((sum, exp) => {
      if (exp.isFixed) return sum;
      return sum + (exp.amount || 0);
    }, 0);
  }, [selectedMonthExpenses]);

  // SINGLE SOURCE OF TRUTH: Total Monthly Expenses = Paid Fixed Bills + Variable Transactions
  const totalExpenses = useMemo(() => {
    return paidFixedExpensesTotal + variableExpensesTotal;
  }, [paidFixedExpensesTotal, variableExpensesTotal]);

  // Remaining Balance = Monthly Cash - Total Expenses
  const remainingBalance = useMemo(() => {
    return monthlyCash - totalExpenses;
  }, [monthlyCash, totalExpenses]);

  // Savings Target Reserve
  const savings = useMemo(() => {
    return Math.max(0, remainingBalance);
  }, [remainingBalance]);

  // Budget Progress Percentage
  const budgetLimit = settings.monthlyBudget || monthlyCash || 1;
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
    const prevTotalExpenses = paidFixedExpensesTotal + prevVariableTotal;

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
  }, [selectedMonth, expenses, paidFixedExpensesTotal, totalExpenses]);

  // Actions
  const addExpense = useCallback(
    (newExpData: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newExp: Expense = {
        ...newExpData,
        id: generateId(),
        userId: user?.uid || "guest",
        createdAt: now,
        updatedAt: now,
      };
      setExpenses((prev) => {
        const updated = [newExp, ...prev];
        saveToFirestore({ expenses: updated });
        return updated;
      });
      playSuccessSound();
    },
    [user, saveToFirestore]
  );

  const updateExpense = useCallback(
    (id: string, updatedData: Partial<Expense>) => {
      setExpenses((prev) => {
        const updated = prev.map((item) =>
          item.id === id
            ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
            : item
        );
        saveToFirestore({ expenses: updated });
        return updated;
      });
      playSuccessSound();
    },
    [saveToFirestore]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveToFirestore({ expenses: updated });
        return updated;
      });
    },
    [saveToFirestore]
  );

  const addFixedExpense = useCallback(
    (newFixedData: Omit<FixedExpense, "id" | "userId" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newFixed: FixedExpense = {
        ...newFixedData,
        id: generateId(),
        userId: user?.uid || "guest",
        createdAt: now,
        updatedAt: now,
      };
      setFixedExpenses((prev) => {
        const updated = [newFixed, ...prev];
        saveToFirestore({ fixedExpenses: updated });
        return updated;
      });
      playSuccessSound();
    },
    [user, saveToFirestore]
  );

  const updateFixedExpense = useCallback(
    (id: string, updatedData: Partial<FixedExpense>) => {
      setFixedExpenses((prev) => {
        const updated = prev.map((item) =>
          item.id === id
            ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
            : item
        );
        saveToFirestore({ fixedExpenses: updated });
        return updated;
      });
      playSuccessSound();
    },
    [saveToFirestore]
  );

  const deleteFixedExpense = useCallback(
    (id: string) => {
      setFixedExpenses((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveToFirestore({ fixedExpenses: updated });
        return updated;
      });
    },
    [saveToFirestore]
  );

  const toggleFixedExpenseStatus = useCallback(
    (id: string) => {
      setFixedExpenses((prev) => {
        const updated = prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: (item.status === "paid" ? "pending" : "paid") as "paid" | "pending",
                updatedAt: new Date().toISOString(),
              }
            : item
        );
        saveToFirestore({ fixedExpenses: updated });
        return updated;
      });
      playSuccessSound();
    },
    [saveToFirestore]
  );

  const addMember = useCallback(
    (newMemData: Omit<Member, "id" | "userId" | "createdAt">) => {
      const newMember: Member = {
        ...newMemData,
        id: generateId(),
        userId: user?.uid || "guest",
        createdAt: new Date().toISOString(),
      };
      setMembers((prev) => {
        const updated = [...prev, newMember];
        saveToFirestore({ members: updated });
        return updated;
      });
      playSuccessSound();
    },
    [user, saveToFirestore]
  );

  const updateMember = useCallback(
    (id: string, updatedData: Partial<Member>) => {
      setMembers((prev) => {
        const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item));
        saveToFirestore({ members: updated });
        return updated;
      });
      playSuccessSound();
    },
    [saveToFirestore]
  );

  const deleteMember = useCallback(
    (id: string) => {
      setMembers((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveToFirestore({ members: updated });
        return updated;
      });
    },
    [saveToFirestore]
  );

  const toggleMemberPaid = useCallback(
    (id: string) => {
      setMembers((prev) => {
        const updated = prev.map((item) => (item.id === id ? { ...item, isPaid: !item.isPaid } : item));
        saveToFirestore({ members: updated });
        return updated;
      });
      playSuccessSound();
    },
    [saveToFirestore]
  );

  const addTask = useCallback(
    (taskData: Omit<PlannerTask, "id" | "userId" | "createdAt">) => {
      const newTask: PlannerTask = {
        ...taskData,
        id: generateId(),
        userId: user?.uid || "guest",
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => {
        const updated = [newTask, ...prev];
        saveToFirestore({ tasks: updated });
        return updated;
      });
      playSuccessSound();
    },
    [user, saveToFirestore]
  );

  const updateTask = useCallback(
    (id: string, updatedData: Partial<PlannerTask>) => {
      setTasks((prev) => {
        const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item));
        saveToFirestore({ tasks: updated });
        return updated;
      });
      playSuccessSound();
    },
    [saveToFirestore]
  );

  const toggleTaskCompleted = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const updated = prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item));
        saveToFirestore({ tasks: updated });
        return updated;
      });
      playSuccessSound();
    },
    [saveToFirestore]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveToFirestore({ tasks: updated });
        return updated;
      });
    },
    [saveToFirestore]
  );

  const addGoal = useCallback(
    (goalData: Omit<FinancialGoal, "id" | "userId" | "createdAt">) => {
      const newGoal: FinancialGoal = {
        ...goalData,
        id: generateId(),
        userId: user?.uid || "guest",
        createdAt: new Date().toISOString(),
      };
      setGoals((prev) => {
        const updated = [...prev, newGoal];
        saveToFirestore({ goals: updated });
        return updated;
      });
      playSuccessSound();
    },
    [user, saveToFirestore]
  );

  const updateGoal = useCallback(
    (id: string, updatedData: Partial<FinancialGoal>) => {
      setGoals((prev) => {
        const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item));
        saveToFirestore({ goals: updated });
        return updated;
      });
      playSuccessSound();
    },
    [saveToFirestore]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      setGoals((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveToFirestore({ goals: updated });
        return updated;
      });
    },
    [saveToFirestore]
  );

  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        saveToFirestore({ settings: updated });
        return updated;
      });
      playSuccessSound();
    },
    [saveToFirestore]
  );

  const resetAllData = useCallback(() => {
    setExpenses([]);
    setFixedExpenses([]);
    setMembers([]);
    setTasks([]);
    setGoals([]);
    setSettings({ currency: "₹", monthlyBudget: 0, customCategories: [] });
    if (user && !isDemo) {
      saveToFirestore({
        expenses: [],
        fixedExpenses: [],
        members: [],
        tasks: [],
        goals: [],
        settings: { currency: "₹", monthlyBudget: 0, customCategories: [] },
      });
    }
  }, [user, isDemo, saveToFirestore]);

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
        loading,
        error,
        selectedMonthExpenses,
        monthlyCash,
        pendingContribution,
        totalContribution,
        paidFixedExpensesTotal,
        pendingFixedExpensesTotal,
        fixedExpensesTotal,
        variableExpensesTotal,
        totalExpenses,
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
        toggleFixedExpenseStatus,
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

