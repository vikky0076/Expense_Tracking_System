"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TrendingUp, Eye, EyeOff, User, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signUpWithEmail(username, email, password);
      router.push("/auth/verify");
    } catch (err: any) {
      console.error("Sign Up Error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email address already exists. Try signing in.");
      } else {
        setError(err.message || "Failed to create account. Please check your inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Branding Panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 p-10 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-bold shadow-md">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Fin<span className="text-emerald-200">Track</span>
              </span>
            </Link>

            <h2 className="text-2xl font-black tracking-tight leading-snug">
              Start your financial clarity journey today.
            </h2>
            <p className="text-emerald-100 text-xs mt-3 leading-relaxed">
              Create a free account to track group pooled expenses, recurring bills, proof receipts, and financial planner goals.
            </p>
          </div>

          <div className="relative z-10 space-y-2 pt-6 border-t border-emerald-600/60 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Zero demo data pollution on your account</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Private & user-scoped database isolation</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Enter your details to create a new personal finance account.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Username (3-30 chars)"
              placeholder="e.g. rahul_sharma"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
              autoComplete="username"
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                label="Password (min 8 characters)"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3 mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-bold text-emerald-600 hover:text-emerald-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
