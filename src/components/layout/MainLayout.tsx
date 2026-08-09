"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { FinanceProvider, useFinance } from "@/context/FinanceContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { DesktopSidebar } from "./DesktopSidebar";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";
import { ExpenseModal } from "@/components/expenses/ExpenseModal";
import { ProofViewerModal } from "@/components/expenses/ProofViewerModal";
import { GlobalSoundListener } from "@/components/common/GlobalSoundListener";
import { SplashScreen } from "@/components/common/SplashScreen";

const PUBLIC_ROUTES = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/magic-link",
  "/auth/verify",
  "/auth/forgot-password",
];

export const MainLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, isDemo } = useAuth();
  const { loading: financeLoading } = useFinance();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [activeProofUrl, setActiveProofUrl] = useState<string | undefined>(undefined);
  const [showSplash, setShowSplash] = useState(true);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isSessionLoading = authLoading || (Boolean(user) && financeLoading);

  // Route Protection Guard
  useEffect(() => {
    if (!authLoading && !user && !isDemo && !isPublicRoute) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, isDemo, isPublicRoute, router]);

  return (
    <>
      {/* Modern Splash Screen with 0 -> 100% Round Loading Counter */}
      {showSplash && (
        <SplashScreen
          minDurationMs={1500}
          onComplete={() => setShowSplash(false)}
        />
      )}

      {isPublicRoute ? (
        <>{children}</>
      ) : isSessionLoading && !showSplash ? (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-500">Securing Session & Syncing Cloud Data...</span>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
          {/* Desktop Left Navigation Sidebar */}
          <DesktopSidebar onOpenAddModal={() => setIsAddExpenseOpen(true)} />

          {/* Main Content Workspace */}
          <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
            <Header />
            <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>

          {/* Mobile Fixed Bottom Navigation */}
          <MobileBottomNav onOpenAddModal={() => setIsAddExpenseOpen(true)} />

          {/* Global Add Expense Modal */}
          <ExpenseModal
            isOpen={isAddExpenseOpen}
            onClose={() => setIsAddExpenseOpen(false)}
            onViewProof={(url) => setActiveProofUrl(url)}
          />

          {/* Global Proof Viewer Lightbox */}
          <ProofViewerModal
            isOpen={Boolean(activeProofUrl)}
            onClose={() => setActiveProofUrl(undefined)}
            proofUrl={activeProofUrl}
          />
        </div>
      )}
    </>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <FinanceProvider>
        <NotificationProvider>
          <GlobalSoundListener>
            <MainLayoutContent>{children}</MainLayoutContent>
          </GlobalSoundListener>
        </NotificationProvider>
      </FinanceProvider>
    </AuthProvider>
  );
};
