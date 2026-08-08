import { Expense } from "@/types";
import { formatDate } from "./utils";

export function exportExpensesToCSV(
  expenses: Expense[],
  filename: string = "expenses-report.csv"
): void {
  if (!expenses || expenses.length === 0) return;

  const headers = ["Date", "Expense Name", "Category", "Amount", "Payment Method", "Description"];

  const rows = expenses.map((exp) => [
    formatDate(exp.date),
    `"${(exp.title || "").replace(/"/g, '""')}"`,
    `"${exp.category}"`,
    exp.amount.toFixed(2),
    `"${exp.paymentMethod}"`,
    `"${(exp.description || "").replace(/"/g, '""')}"`,
  ]);

  // Include UTF-8 BOM (\uFEFF) for Excel & Mobile file parser compatibility
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
