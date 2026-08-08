"use client";

import React, { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationItem } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  Volume2,
  BellRing,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { playClickSound } from "@/lib/sound";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    permissionState,
    requestBrowserPermission,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [requestingPerm, setRequestingPerm] = useState(false);

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    return true;
  });

  const handleRequestPermission = async () => {
    playClickSound();
    setRequestingPerm(true);
    await requestBrowserPermission();
    setRequestingPerm(false);
  };

  const getNotifIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "bill_due":
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case "bill_upcoming":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden"
      />

      <div className="fixed md:absolute right-2 md:right-0 top-16 md:top-12 z-50 w-[calc(100vw-1rem)] max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[550px]">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              <p className="text-[10px] text-slate-400 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread reminders` : "All notifications read"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-1.5 rounded-lg text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Read All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Permission Request Prompt Banner */}
        {permissionState === "default" && (
          <div className="p-3.5 bg-orange-50/80 border-b border-orange-200/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-orange-900">
              <BellRing className="w-4 h-4 text-orange-600 shrink-0 animate-bounce" />
              <span>Allow browser notifications for bill reminders?</span>
            </div>
            <button
              onClick={handleRequestPermission}
              disabled={requestingPerm}
              className="px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] shadow-xs shrink-0 transition-all"
            >
              {requestingPerm ? "Enabling..." : "Allow"}
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-xs font-bold bg-white">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3 py-1 rounded-xl transition-all",
              activeTab === "all" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={cn(
              "px-3 py-1 rounded-xl transition-all",
              activeTab === "unread" ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-medium text-slate-500">No notifications found.</p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={cn(
                  "p-3.5 flex items-start gap-3 transition-colors cursor-pointer group",
                  !n.read ? "bg-emerald-50/40 hover:bg-emerald-50/70" : "hover:bg-slate-50"
                )}
              >
                <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0 mt-0.5">
                  {getNotifIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={cn("text-xs font-bold truncate", !n.read ? "text-slate-900" : "text-slate-700")}>
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">
                    {formatDate(n.date)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Panel Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
            <button
              onClick={clearAllNotifications}
              className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
};
