// features/cashier/components/OrderFilterBar.tsx
"use client";

import { useState } from "react";
import { MyFilterOptions } from "../types/order-history";
import { OrderType } from "@/features/orders/types/order";
import { TransactionCategory } from "@/types/transaction-category";

interface MyOrderFilterBarProps {
  onFilterChange: (filters: MyFilterOptions) => void;
}

export default function MyOrderFilterBar({
  onFilterChange,
}: MyOrderFilterBarProps) {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    applyFilters(type, startDate, endDate);
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    applyFilters(selectedType, start, end);
  };

  const applyFilters = (
    type: string,
    start: string,
    end: string
  ) => {
    const filters: MyFilterOptions = {};
    filters.transactionCategory = type;
    if (type !== "ALL") {
      console.log("Selected type: ", type);
    }
    if (start && end) {
      console.log("Start time: ", start);
      console.log("End time: ", end);
      filters.dateRange = {
        start: start,
        end: end,
      };
    }
    console.log("Type: ", filters.transactionCategory)
    console.log("Filters applied data range: ", filters.dateRange?.start, " - ", filters.dateRange?.end);
    onFilterChange(filters);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Tanggal:
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e.target.value, endDate)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon text-black"
          />
          <span className="text-gray-500">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange(startDate, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon text-black"
          />
        </div>

        {/* Order Type Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Tipe Order:
          </label>
          <select
            value={selectedType}
            onChange={(e) =>
              handleTypeChange(e.target.value as OrderType | "all")
            }
            className="px-3 py-2 border border-gray-300 text-black rounded-lg text-sm focus:outline-none focus:border-maroon"
          >
            <option key={"ALL"} value={"ALL"}>
              ALL
            </option>
            {Object.values(TransactionCategory).map((transactionCategory) => (
              <option key={transactionCategory} value={transactionCategory}>
                {transactionCategory}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
