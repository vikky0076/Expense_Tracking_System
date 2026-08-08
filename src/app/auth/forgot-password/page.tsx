"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { KeyRound, Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch (err: any) {
      // Don't reveal specific account enumeration info
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Reset Your Password</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-900">Reset Email Sent!</h3>
            <p className="text-xs text-emerald-700">
              If an account is associated with <span className="font-bold">{email}</span>, password reset instructions have been sent to your inbox.
            </p>
            <Link href="/auth/signin">
              <Button variant="primary" size="sm" className="mt-2 text-xs">
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? "Sending link..." : "Send Password Reset Link"}
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link href="/auth/signin" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
