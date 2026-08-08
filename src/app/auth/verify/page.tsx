"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Mail, CheckCircle2, RefreshCw, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, resendVerificationEmail, logout } = useAuth();

  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckVerified = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        router.push("/welcome");
      } else {
        setError("Your email is not verified yet. Please click the link sent to your inbox.");
      }
    } else {
      router.push("/welcome"); // Demo or bypass fallback
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      await resendVerificationEmail();
      setResent(true);
    } catch (err: any) {
      setError("Please wait a minute before requesting another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Verify Your Email Address</h1>
          <p className="text-xs text-slate-500 mt-1">
            We've sent an account verification link to:
          </p>
          <span className="text-sm font-bold text-slate-900 block mt-1">
            {user?.email || "your email address"}
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        {resent && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
            ✓ A new verification email has been sent! Check your inbox.
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            onClick={handleCheckVerified}
            className="w-full py-3"
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            I've Verified My Email
          </Button>

          <Button
            variant="outline"
            onClick={handleResend}
            disabled={loading}
            className="w-full"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            {loading ? "Sending Email..." : "Resend Verification Email"}
          </Button>

          <Button
            variant="ghost"
            onClick={logout}
            className="w-full text-slate-500 hover:text-slate-700"
            icon={<LogOut className="w-4 h-4" />}
          >
            Sign Out / Change Account
          </Button>
        </div>
      </div>
    </div>
  );
}
