"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Application Error</h2>
          <p className="text-xs text-slate-500">
            A global application error occurred. Please click below to refresh the workspace.
          </p>
          <Button variant="primary" onClick={reset} className="w-full" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh Application
          </Button>
        </div>
      </body>
    </html>
  );
}
