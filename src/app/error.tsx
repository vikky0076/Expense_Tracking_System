"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
      <p className="text-xs text-slate-500 max-w-md">
        An unexpected error occurred while loading this page. You can try refreshing or returning to the dashboard.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" onClick={reset} icon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="primary" icon={<Home className="w-4 h-4" />}>
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
