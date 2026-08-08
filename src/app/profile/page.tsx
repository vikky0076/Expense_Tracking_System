"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, LogOut, ShieldCheck, LogIn, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const { user, isDemo, signInWithGoogle, loginAsDemo, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-600" />
          User Profile & Authentication
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your account session and Firebase security rules
        </p>
      </div>

      {/* User Details Card */}
      <Card className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl border-2 border-emerald-300 shrink-0">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {user?.displayName || "Rahul (Demo User)"}
              </h2>
              {isDemo ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  Demo Mode
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Firebase Authenticated
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email || "demo@fintrack.app"}</p>
            <p className="text-[10px] text-slate-400 mt-1">UID: {user?.uid}</p>
          </div>
        </div>

        {/* Security & Access Notice */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-800 block">🔒 Data Isolation & Firebase Security Rules</span>
          <p>
            Each user's financial records, group contributions, and fixed bills are securely scoped to their unique Firebase Auth account ID.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {isDemo ? (
            <Button
              variant="primary"
              onClick={signInWithGoogle}
              icon={<LogIn className="w-4 h-4" />}
            >
              Sign In with Google / Firebase
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={loginAsDemo}
              icon={<Sparkles className="w-4 h-4 text-orange-500" />}
            >
              Switch to Instant Demo Mode
            </Button>
          )}

          <Button
            variant="danger"
            onClick={logout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
