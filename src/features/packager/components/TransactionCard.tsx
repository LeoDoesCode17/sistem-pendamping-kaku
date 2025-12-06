// features/packager/components/TransactionCard.tsx
"use client";
import { Transaction } from "@/models/transaction";
import { useEffect, useState } from "react";
import { COUNTDOWN_DURATION, MAX_PREVIEW_ITEMS } from "../constants/countdown";
import { Check, Loader, LoaderCircle } from "lucide-react"; // ⬅️ Tambahan

interface TransactionCardProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
}

export default function TransactionCard({
  transaction,
  onClick,
}: TransactionCardProps) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const created = new Date(transaction.timeCreated!).getTime();
      const elapsed = Math.floor((now - created) / 1000);
      const remaining = COUNTDOWN_DURATION - elapsed;
      setRemainingTime(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [transaction.timeCreated]);

  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${isNegative ? "-" : ""}${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getUrgencyLevel = (seconds: number) => {
    if (seconds < 180) return "urgent";
    if (seconds < 360) return "warning";
    return "normal";
  };

  const convertToTimeString = (time: number): string => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const urgency = getUrgencyLevel(remainingTime);

  const cardColors = {
    urgent: "bg-red-300 border-red-400",
    warning: "bg-yellow-300 border-yellow-400",
    normal: "bg-green-300 border-green-400",
  };

  const timeColors = {
    urgent: "text-red-800",
    warning: "text-yellow-800",
    normal: "text-green-800",
  };

  const previewItems = transaction.orderedMenus.slice(0, MAX_PREVIEW_ITEMS);
  const remainingItemsCount =
    transaction.orderedMenus.length - MAX_PREVIEW_ITEMS;
  const hasMore = remainingItemsCount > 0;

  return (
    <button
      onClick={() => onClick(transaction)}
      className={`${cardColors[urgency]} rounded-xl shadow-lg border-3 overflow-hidden text-left w-full hover:shadow-xl transition-all hover:scale-[1.02] flex flex-col`}
    >
      {/* Header */}
      <div className="px-3 py-2.5 flex items-start justify-between gap-2 flex-shrink-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-800 truncate leading-tight">
            {transaction.code === "" ? "Tanpa Nama" : transaction.code}
          </h3>
          <p className="text-xs text-gray-700 truncate">
            {convertToTimeString(transaction.timeCreated!)},{" "}
            {transaction.category}
          </p>
        </div>

        <div className={`text-2xl font-black ${timeColors[urgency]} flex-shrink-0`}>
          {formatTime(remainingTime)}
        </div>
      </div>

      {/* Items Preview */}
      <div className="bg-white mx-2 mb-2 rounded-lg flex-shrink-0 text-sm">
        {previewItems.map((item, index) => (
          <div
            key={index}
            className="px-3 py-2 border-b last:border-b-0 border-gray-200 flex justify-between items-center"
          >
            <div className="font-semibold text-gray-800 truncate">
              {item.quantity} × {item.menu.name}
            </div>

            {/* Status Icon */}
            {item.isDone ? (
              <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
            ) : (
              // <Loader className="w-4 h-4 text-red-500 " strokeWidth={3} />
              <LoaderCircle className="w-4 h-4 text-red-500 " strokeWidth={3} />

            )}
          </div>
        ))}

        {hasMore && (
          <div className="px-3 py-2 text-center bg-gray-50">
            <span className="text-gray-600 font-medium text-xs">
              +{remainingItemsCount} lagi
            </span>
          </div>
        )}
      </div>

      <div className="flex-grow"></div>
    </button>
  );
}
