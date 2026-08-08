"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles, Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function MagicLinkPage() {
  const router = useRouter();
  const { sendMagicLink, verifyMagicLinkCallback } = useAuth();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle incoming magic link callback from email URL
  useEffect(() => {
    const handleCallback = async () => {
      const storedEmail = window.localStorage.getItem("emailForSignIn");
      if (storedEmail) {
        setVerifying(true);
        try {
          const success = await verifyMagicLinkCallback(storedEmail);
          if (success) {
            router.push("/dashboard");
          }
        } catch (err: any) {
          setError("This sign-in link is invalid or has expired. Please request a new one.");
        } finally {
          setVerifying(false);
        }
      }
    };
    handleCallback();
  }, [router, verifyMagicLinkCallback]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await sendMagicLink(email.trim());
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send sign-in link. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-sm w-full space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Validating Sign-In Link...</h3>
          <p className="text-xs text-slate-500">Please wait while we log you in securely.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Sign In with Magic Link</h1>
          <p className="text-xs text-slate-500 mt-1">
            No password required! We will send a secure sign-in link to your email.
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
            <h3 className="text-sm font-bold text-emerald-900">Sign-in Link Sent!</h3>
            <p className="text-xs text-emerald-700">
              We've sent a secure sign-in link to <span className="font-bold">{email}</span>. Click the link in your email to instantly log in.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSent(false)}
              className="mt-2 text-xs"
            >
              Send to Another Email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendLink} className="space-y-4">
            <Input
              label="Your Email Address"
              type="email"
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Button
              type="submit"
              variant="secondary"
              disabled={loading}
              className="w-full py-3"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? "Sending Magic Link..." : "Send Magic Link"}
            </Button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link href="/auth/signin" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
            ← Back to Standard Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
