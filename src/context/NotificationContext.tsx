"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { NotificationItem, ReminderTiming } from "@/types";
import { useFinance } from "./FinanceContext";
import { useAuth } from "./AuthContext";
import { playSuccessSound } from "@/lib/sound";
import { generateId } from "@/lib/utils";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  permissionState: NotificationPermission | "unsupported";
  requestBrowserPermission: () => Promise<boolean>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemo } = useAuth();
  const { fixedExpenses, settings } = useFinance();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported">("default");

  const storagePrefix = user ? `fintrack_${user.uid}_` : "fintrack_guest_";
  const reminderTiming: ReminderTiming = settings.reminderTiming || "1_day";

  // Check browser notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionState(Notification.permission);
    } else {
      setPermissionState("unsupported");
    }
  }, []);

  // Load user notifications from LocalStorage
  useEffect(() => {
    if (!user && !isDemo) {
      setNotifications([]);
      return;
    }
    try {
      const stored = localStorage.getItem(`${storagePrefix}notifications`);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications([]);
      }
    } catch (e) {
      setNotifications([]);
    }
  }, [user, isDemo, storagePrefix]);

  // Save notifications to LocalStorage on change
  useEffect(() => {
    if (user && !isDemo) {
      localStorage.setItem(`${storagePrefix}notifications`, JSON.stringify(notifications));
    }
  }, [notifications, user, isDemo, storagePrefix]);

  // Automated Fixed Bill Due-Date Inspector & Reminder Generator
  useEffect(() => {
    if (!fixedExpenses || fixedExpenses.length === 0) return;

    const today = new Date();
    const currentDay = today.getDate();
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    let timingDays = 1;
    if (reminderTiming === "same_day") timingDays = 0;
    if (reminderTiming === "3_days") timingDays = 3;
    if (reminderTiming === "7_days") timingDays = 7;

    const newGeneratedNotifs: NotificationItem[] = [];

    fixedExpenses.forEach((bill) => {
      if (bill.status === "paid") return; // Skip paid bills

      const daysDiff = bill.dueDate - currentDay;
      const dedupeKey = `fintrack_notif_sent_${bill.id}_${monthKey}_${timingDays}`;

      // Check if alert was already sent for this cycle
      const alreadySent = localStorage.getItem(dedupeKey);
      if (alreadySent) return;

      let isTrigger = false;
      let title = "";
      let message = "";
      let type: NotificationItem["type"] = "bill_upcoming";

      if (daysDiff === 0) {
        isTrigger = true;
        type = "bill_due";
        title = `⚠️ Bill Due Today: ${bill.title}`;
        message = `${bill.title} (₹${bill.amount.toLocaleString()}) is due today! Mark as paid when complete.`;
      } else if (daysDiff > 0 && daysDiff <= timingDays) {
        isTrigger = true;
        type = "bill_upcoming";
        title = `⏰ Upcoming Bill: ${bill.title}`;
        message = `${bill.title} (₹${bill.amount.toLocaleString()}) is due in ${daysDiff} day${daysDiff > 1 ? "s" : ""} (on ${bill.dueDate}th).`;
      }

      if (isTrigger) {
        const notif: NotificationItem = {
          id: generateId(),
          userId: user?.uid || "guest",
          title,
          message,
          type,
          date: new Date().toISOString(),
          read: false,
          billId: bill.id,
          createdAt: new Date().toISOString(),
        };

        newGeneratedNotifs.push(notif);
        localStorage.setItem(dedupeKey, "true");

        // Trigger browser push notification if permission is granted
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          try {
            new window.Notification(title, {
              body: message,
              icon: "/favicon.ico",
            });
          } catch (e) {
            // Ignore push errors
          }
        }
      }
    });

    if (newGeneratedNotifs.length > 0) {
      setNotifications((prev) => [...newGeneratedNotifs, ...prev]);
    }
  }, [fixedExpenses, reminderTiming, user]);

  // Request browser notification permission explicitly
  const requestBrowserPermission = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermissionState("unsupported");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      return permission === "granted";
    } catch (e) {
      return false;
    }
  };

  // Actions
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    playSuccessSound();
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        permissionState,
        requestBrowserPermission,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
