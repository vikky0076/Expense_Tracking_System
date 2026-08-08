export type ExpenseCategory = 
  | 'Food' 
  | 'Transport' 
  | 'Shopping' 
  | 'Bills' 
  | 'Rent' 
  | 'Education' 
  | 'Entertainment' 
  | 'Health' 
  | 'Travel' 
  | 'Other';

export type PaymentMethod = 
  | 'Cash' 
  | 'UPI' 
  | 'Card' 
  | 'Bank Transfer' 
  | 'Other';

export interface Expense {
  id: string;
  userId?: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  description?: string;
  proofUrl?: string; // base64 or firebase storage URL
  isFixed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FixedExpense {
  id: string;
  userId?: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  dueDate: number; // Day of month e.g. 15 for 15th
  frequency: 'Monthly' | 'Quarterly' | 'Yearly';
  status: 'paid' | 'pending';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  userId?: string;
  name: string;
  contributionAmount: number;
  isPaid: boolean;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface ContributionHistoryRecord {
  monthKey: string; // e.g. "2026-08"
  monthLabel: string; // e.g. "August 2026"
  totalContribution: number;
  members: {
    id: string;
    name: string;
    amount: number;
    isPaid: boolean;
  }[];
}

export type TaskTimeframe = 'today' | 'tomorrow' | 'week' | 'month';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface PlannerTask {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  priority: PriorityLevel;
  category: string;
  completed: boolean;
  timeframe: TaskTimeframe;
  createdAt: string;
}

export interface FinancialGoal {
  id: string;
  userId?: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  notes?: string;
  createdAt: string;
}

export type ReminderTiming = 'same_day' | '1_day' | '3_days' | '7_days';

export interface UserSettings {
  currency: string; // '₹', '$', '€', '£'
  monthlyBudget: number;
  customCategories: string[];
  soundEnabled?: boolean;
  reminderTiming?: ReminderTiming;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  emailVerified: boolean;
  isDemo?: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'bill_due' | 'bill_upcoming' | 'completed' | 'system';
  date: string;
  read: boolean;
  billId?: string;
  createdAt: string;
}
