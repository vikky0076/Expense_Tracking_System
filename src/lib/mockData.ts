import { Expense, FixedExpense, Member, PlannerTask, FinancialGoal, UserSettings } from "@/types";

export const INITIAL_MEMBERS: Member[] = [
  { id: "m1", name: "Rahul Sharma", contributionAmount: 3500, isPaid: true, email: "rahul@example.com", createdAt: "2026-08-01" },
  { id: "m2", name: "Priya Patel", contributionAmount: 3000, isPaid: true, email: "priya@example.com", createdAt: "2026-08-01" },
  { id: "m3", name: "Amit Kumar", contributionAmount: 3000, isPaid: true, email: "amit@example.com", createdAt: "2026-08-01" },
  { id: "m4", name: "Sneha Reddy", contributionAmount: 2800, isPaid: false, email: "sneha@example.com", createdAt: "2026-08-01" },
  { id: "m5", name: "Vikram Singh", contributionAmount: 2700, isPaid: true, email: "vikram@example.com", createdAt: "2026-08-01" },
];

export const INITIAL_FIXED_EXPENSES: FixedExpense[] = [
  { id: "fe1", title: "House Rent", amount: 5000, category: "Rent", dueDate: 5, frequency: "Monthly", status: "paid", notes: "Owner account transfer", createdAt: "2026-08-01", updatedAt: "2026-08-01" },
  { id: "fe2", title: "Electricity Bill", amount: 1250, category: "Bills", dueDate: 10, frequency: "Monthly", status: "pending", notes: "State Electricity Board", createdAt: "2026-08-01", updatedAt: "2026-08-01" },
  { id: "fe3", title: "High-Speed Fiber Internet", amount: 899, category: "Bills", dueDate: 15, frequency: "Monthly", status: "paid", notes: "Airtel Xstream", createdAt: "2026-08-01", updatedAt: "2026-08-01" },
  { id: "fe4", title: "Apartment Maintenance", amount: 1200, category: "Bills", dueDate: 1, frequency: "Monthly", status: "paid", notes: "Society Maintenance", createdAt: "2026-08-01", updatedAt: "2026-08-01" },
  { id: "fe5", title: "Streaming & Music Subscriptions", amount: 649, category: "Entertainment", dueDate: 20, frequency: "Monthly", status: "pending", notes: "Netflix & Spotify Premium", createdAt: "2026-08-01", updatedAt: "2026-08-01" },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: "ex1", title: "Grocery & Vegetables", amount: 1450, category: "Food", date: "2026-08-07", paymentMethod: "UPI", description: "Weekly vegetables and dairy items", proofUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23ecfdf5'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='%23059669' font-family='sans-serif' font-size='20' font-weight='bold'>Grocery Receipt - Aug 7</text><text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle' fill='%23047857' font-family='sans-serif' font-size='16'>Amount: ₹1,450 (UPI Verified)</text></svg>", isFixed: false, createdAt: "2026-08-07T10:30:00Z", updatedAt: "2026-08-07T10:30:00Z" },
  { id: "ex2", title: "Team Lunch at Bistro", amount: 820, category: "Food", date: "2026-08-06", paymentMethod: "Card", description: "Lunch with Rahul & Priya", proofUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23fff7ed'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='%23ea580c' font-family='sans-serif' font-size='20' font-weight='bold'>Bistro Cafe Bill</text><text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle' fill='%23c2410c' font-family='sans-serif' font-size='16'>Paid via Card: ₹820</text></svg>", isFixed: false, createdAt: "2026-08-06T13:15:00Z", updatedAt: "2026-08-06T13:15:00Z" },
  { id: "ex3", title: "House Rent", amount: 5000, category: "Rent", date: "2026-08-05", paymentMethod: "Bank Transfer", description: "Monthly Apartment Rent for August", isFixed: true, createdAt: "2026-08-05T09:00:00Z", updatedAt: "2026-08-05T09:00:00Z" },
  { id: "ex4", title: "Fuel & Cab Travel", amount: 450, category: "Transport", date: "2026-08-04", paymentMethod: "UPI", description: "Cab ride to client office", isFixed: false, createdAt: "2026-08-04T18:20:00Z", updatedAt: "2026-08-04T18:20:00Z" },
  { id: "ex5", title: "Airtel Fiber Internet", amount: 899, category: "Bills", date: "2026-08-03", paymentMethod: "UPI", description: "Monthly Internet Bill", isFixed: true, createdAt: "2026-08-03T11:00:00Z", updatedAt: "2026-08-03T11:00:00Z" },
  { id: "ex6", title: "Medicine & Health Checkup", amount: 650, category: "Health", date: "2026-08-02", paymentMethod: "Cash", description: "Prescription medicines", isFixed: false, createdAt: "2026-08-02T16:00:00Z", updatedAt: "2026-08-02T16:00:00Z" },
  { id: "ex7", title: "Apartment Maintenance", amount: 1200, category: "Bills", date: "2026-08-01", paymentMethod: "UPI", description: "August maintenance fee", isFixed: true, createdAt: "2026-08-01T08:00:00Z", updatedAt: "2026-08-01T08:00:00Z" },

  // Previous Month (July 2026) for month comparison testing
  { id: "ex-prev-1", title: "July House Rent", amount: 5000, category: "Rent", date: "2026-07-05", paymentMethod: "Bank Transfer", description: "July rent payment", isFixed: true, createdAt: "2026-07-05T09:00:00Z", updatedAt: "2026-07-05T09:00:00Z" },
  { id: "ex-prev-2", title: "July Groceries", amount: 2100, category: "Food", date: "2026-07-12", paymentMethod: "UPI", description: "July food supplies", isFixed: false, createdAt: "2026-07-12T10:00:00Z", updatedAt: "2026-07-12T10:00:00Z" },
  { id: "ex-prev-3", title: "Electricity & Gas", amount: 1400, category: "Bills", date: "2026-07-15", paymentMethod: "UPI", description: "July utility bills", isFixed: true, createdAt: "2026-07-15T14:00:00Z", updatedAt: "2026-07-15T14:00:00Z" },
];

export const INITIAL_TASKS: PlannerTask[] = [
  { id: "t1", title: "Pay Electricity Bill", description: "Clear pending state board bill before 10th", date: "2026-08-09", time: "10:00 AM", priority: "high", category: "Bills", completed: false, timeframe: "today", createdAt: "2026-08-08" },
  { id: "t2", title: "Review August Budget with Members", description: "Check pending member contributions", date: "2026-08-09", time: "05:00 PM", priority: "medium", category: "Finance", completed: false, timeframe: "today", createdAt: "2026-08-08" },
  { id: "t3", title: "Buy Household Supplies", description: "Stock up on laundry detergent and tissue boxes", date: "2026-08-10", time: "02:00 PM", priority: "low", category: "Shopping", completed: false, timeframe: "tomorrow", createdAt: "2026-08-08" },
  { id: "t4", title: "Renew Streaming Subscription", description: "Check auto-debit status", date: "2026-08-14", time: "11:00 AM", priority: "low", category: "Entertainment", completed: true, timeframe: "week", createdAt: "2026-08-08" },
];

export const INITIAL_GOALS: FinancialGoal[] = [
  { id: "g1", title: "Emergency Contingency Fund", targetAmount: 25000, currentAmount: 18500, targetDate: "2026-10-31", category: "Savings", notes: "3 months liquid reserve", createdAt: "2026-08-01" },
  { id: "g2", title: "Group Diwali Celebration Fund", targetAmount: 10000, currentAmount: 6500, targetDate: "2026-09-30", category: "Event", notes: "Targeting ₹10,000 by end of September", createdAt: "2026-08-01" },
];

export const INITIAL_SETTINGS: UserSettings = {
  currency: "₹",
  monthlyBudget: 15000,
  customCategories: [],
};
