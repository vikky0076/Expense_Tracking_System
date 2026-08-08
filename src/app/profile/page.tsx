"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { playClickSound, playSuccessSound } from "@/lib/sound";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Edit2,
  KeyRound,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user, logout, sendPasswordReset, resendVerificationEmail } = useAuth();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleOpenEdit = () => {
    playClickSound();
    setNewUsername(user?.username || user?.displayName || "");
    setError(null);
    setIsEditOpen(true);
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newUsername.trim().toLowerCase();

    // 1. Validation rules
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(clean)) {
      setError("Username must be 3-30 characters and contain only letters, numbers, or underscores.");
      return;
    }

    if (clean === user?.username) {
      setIsEditOpen(false);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 2. Uniqueness check in Firestore
      const newRef = doc(db, "usernames", clean);
      const snap = await getDoc(newRef);
      if (snap.exists() && snap.data().uid !== user?.uid) {
        setError("This username is already taken by another account.");
        setLoading(false);
        return;
      }

      // 3. Update Firebase Auth displayName
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: clean });
      }

      // 4. Update Firestore user doc & username mapping
      if (user?.uid) {
        await setDoc(doc(db, "users", user.uid), { username: clean }, { merge: true });
        
        // Remove old username index if existed
        if (user.username && user.username !== clean) {
          try {
            await deleteDoc(doc(db, "usernames", user.username.toLowerCase()));
          } catch (e) {
            // Ignore if index missing
          }
        }

        await setDoc(newRef, {
          uid: user.uid,
          email: user.email,
        });
      }

      // Update local state display
      if (user) {
        user.username = clean;
        user.displayName = clean;
      }

      playSuccessSound();
      setSuccessMsg("Username updated successfully!");
      setIsEditOpen(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error("Failed to update username:", err);
      setError(err.message || "Failed to update username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    playClickSound();
    if (!user?.email) return;
    try {
      await sendPasswordReset(user.email);
      playSuccessSound();
      setSuccessMsg(`Password reset link sent to ${user.email}!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e) {
      setError("Failed to send password reset email.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-emerald-700/20 flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-orange-300" />
            <span>Account Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">User Profile & Account</h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            Manage your account credentials, security settings, and username.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Main Profile Details Card */}
      <Card className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-2xl border-2 border-emerald-300 shadow-sm shrink-0">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {user?.displayName || user?.username || "User"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">@{user?.username || "username"}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Active Account
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenEdit}
            icon={<Edit2 className="w-4 h-4" />}
          >
            Edit Username
          </Button>
        </div>

        {/* Detailed Fields List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Username</span>
                <span className="text-sm font-bold text-slate-900">@{user?.username || "Not set"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Email Address</span>
                <span className="text-sm font-bold text-slate-900">{user?.email || "user@example.com"}</span>
              </div>
            </div>
            {user?.emailVerified ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
            ) : (
              <button
                onClick={resendVerificationEmail}
                className="text-[10px] font-bold text-orange-600 hover:underline"
              >
                Verify Email
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Member Since</span>
                <span className="text-sm font-bold text-slate-900">{formatDate(user?.createdAt || new Date().toISOString())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handlePasswordReset}
            className="flex-1 py-3 text-xs"
            icon={<KeyRound className="w-4 h-4 text-emerald-600" />}
          >
            Send Password Reset Link
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              playClickSound();
              logout();
            }}
            className="py-3 text-xs text-rose-600 hover:bg-rose-50"
            icon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Edit Username Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Username"
      >
        <form onSubmit={handleUpdateUsername} className="space-y-4">
          <p className="text-xs text-slate-500">
            Your username must be 3-30 characters long and contain only letters, numbers, or underscores.
          </p>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Input
            label="New Username"
            placeholder="e.g. rahul_sharma"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Checking..." : "Save Username"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
