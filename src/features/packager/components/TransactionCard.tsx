"use client";
import { Transaction } from "@/models/transaction";
import { useEffect, useState } from "react";
import { COUNTDOWN_DURATION, MAX_PREVIEW_ITEMS } from "../constants/countdown";

interface TransactionCardProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
}

export default function TransactionCard({
  transaction,
  onClick,
}: TransactionCardProps) {
  const [remainingTime, setRemainingTime] = useState(0);

  // this must be optimized
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const created = new Date(transaction.timeCreated!).getTime();
      const elapsed = Math.floor((now - created) / 1000);
      const remaining = Math.max(0, COUNTDOWN_DURATION - elapsed);
      setRemainingTime(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [transaction.timeCreated]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getUrgencyLevel = (seconds: number) => {
    if (seconds < 180) return "urgent"; // < 3 menit - Merah
    if (seconds < 360) return "warning"; // 3-6 menit - Kuning
    return "normal"; // > 6 menit - Hijau
  };

  const convertToTimeString = (time: number): string => {
    const date = new Date(time);
    // Convert to hh:mm (24-hour format)
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
      className={`${cardColors[urgency]} rounded-2xl shadow-xl border-4 overflow-hidden text-left w-full hover:shadow-2xl transition-all hover:scale-[1.02] flex flex-col min-h-[280px]`}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {transaction.code === "" ? "Tanpa Nama" : transaction.code}
          </h3>
          <p className="text-sm text-gray-700">
            {convertToTimeString(transaction.timeCreated!)}, {transaction.category}
          </p>
        </div>
        <div className={`text-4xl font-black ${timeColors[urgency]}`}>
          {formatTime(remainingTime)}
        </div>
      </div>

      {/* Items Preview (Max 3) */}
      <div className="bg-white mx-4 mb-4 rounded-lg flex-shrink-0">
        {previewItems.map((item, index) => (
          <div
            key={index}
            className="px-4 py-3 border-b last:border-b-0 border-gray-200"
          >
            <div className="font-semibold text-gray-800">
              {item.quantity} x {item.menu.name} ({item.menu.abbreviation})
            </div>
          </div>
        ))}

        {/* Show "... X items lagi" jika lebih dari 3 */}
        {hasMore && (
          <div className="px-4 py-3 text-center bg-gray-50">
            <span className="text-gray-600 font-semibold">
              ... {remainingItemsCount} item lagi
            </span>
          </div>
        )}
      </div>

      {/* Spacer - untuk push konten ke atas */}
      <div className="flex-grow"></div>
    </button>
  );
}
