"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TrendingUp, Eye, EyeOff, Sparkles, Lock, Mail, ArrowRight, ShieldCheck, PlayCircle } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { user, isDemo, loginAsDemo, signInWithUsernameOrEmail, signInWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Automatically redirect if user or demo mode becomes active
  useEffect(() => {
    if (user || isDemo) {
      router.push("/dashboard");
    }
  }, [user, isDemo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Please enter your username/email and password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signInWithUsernameOrEmail(identifier.trim(), password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Sign In Error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.message?.includes("Invalid username")) {
        setError("Account not found or password incorrect. If you haven't created an account, click 'Create Account' below.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait a few minutes before trying again.");
      } else {
        setError(err.message || "Failed to sign in. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    loginAsDemo();
    router.push("/dashboard");
  };

  const handleGoogleClick = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google authentication popup was closed before completing sign-in.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Google authentication popup was blocked by your browser. Please allow popups or try again.");
      } else {
        setError(err.message || "Failed to sign in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Marketing Side (Desktop) */}
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
              Welcome back to your personal finance command center.
            </h2>
            <p className="text-emerald-100 text-xs mt-3 leading-relaxed">
              Track 5-member pooled contributions, recurring bills, proof receipts, and instant financial reports.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-emerald-600/60 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-200 shrink-0" />
            <p className="text-[11px] text-emerald-100">
              Your financial records are strictly protected with user-scoped Firebase Auth & Firestore security rules.
            </p>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-base font-black text-slate-900">
              Fin<span className="text-emerald-600">Track</span>
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Your Account</h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Enter your Username or Email to continue to your dashboard.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username or Email"
              placeholder="e.g. rahul_sharma or rahul@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              autoComplete="username"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <Link href="/auth/magic-link" className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                Sign in with Magic Link
              </Link>
              <Link href="/auth/forgot-password" className="text-slate-500 hover:text-slate-800 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">Or options</span>
          </div>

          <div className="space-y-2.5">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDemoClick}
              disabled={loading}
              className="w-full py-2.5 text-xs font-bold shadow-xs"
              icon={<PlayCircle className="w-4 h-4" />}
            >
              Explore Interactive Demo (1-Click Login)
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleClick}
              disabled={loading}
              className="w-full py-2.5 text-xs font-bold"
            >
              {loading ? "Connecting to Google..." : "Google Authentication"}
            </Button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account yet?{" "}
            <Link href="/auth/signup" className="font-bold text-emerald-600 hover:text-emerald-700">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
