"use client";

import React from "react";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface ExpenseFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  paymentFilter: string;
  setPaymentFilter: (payment: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onResetFilters: () => void;
}

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "All Categories" },
  { value: "Food", label: "Food & Dining" },
  { value: "Transport", label: "Transport & Fuel" },
  { value: "Shopping", label: "Shopping" },
  { value: "Bills", label: "Bills & Utilities" },
  { value: "Rent", label: "Rent & Housing" },
  { value: "Education", label: "Education" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Health", label: "Health & Pharmacy" },
  { value: "Travel", label: "Travel" },
  { value: "Other", label: "Other" },
];

const PAYMENT_OPTIONS = [
  { value: "ALL", label: "All Payment Methods" },
  { value: "UPI", label: "UPI / QR" },
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Debit/Credit Card" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Amount" },
  { value: "lowest", label: "Lowest Amount" },
];

export const ExpenseFilter: React.FC<ExpenseFilterProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  paymentFilter,
  setPaymentFilter,
  sortBy,
  setSortBy,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchQuery !== "" || categoryFilter !== "ALL" || paymentFilter !== "ALL" || sortBy !== "newest";

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft space-y-3 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Bar */}
        <Input
          placeholder="Search expenses by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        />

        {/* Category Filter */}
        <Select
          options={CATEGORY_OPTIONS}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />

        {/* Payment Filter */}
        <Select
          options={PAYMENT_OPTIONS}
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        />

        {/* Sort By */}
        <Select
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">Filtered Results Active</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-rose-600 hover:bg-rose-50 font-semibold"
            icon={<X className="w-3.5 h-3.5" />}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
