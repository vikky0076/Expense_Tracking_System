import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "FinTrack — Premium Expense Tracker & Finance Planner",
  description: "Production-ready expense tracking, group contribution manager, and personal finance planner.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={`${plusJakartaSans.className} font-sans antialiased text-slate-900 bg-slate-50`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
