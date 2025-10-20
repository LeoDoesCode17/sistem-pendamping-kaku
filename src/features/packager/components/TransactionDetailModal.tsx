"use client";

import { Transaction } from "@/models/transaction";
import { useEffect, useState } from "react";
import { COUNTDOWN_DURATION } from "../constants/countdown";

interface TransactionDetailModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onComplete: () => void;
  onClose: () => void;
}

export default function TransactionDetailModal({
  isOpen,
  transaction,
  onComplete,
  onClose,
}: TransactionDetailModalProps) {
  const [remainingTime, setRemainingTime] = useState(0);
  useEffect(() => {
    if (!transaction) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const created = new Date(transaction.timeCreated!).getTime();
      const elapsed = Math.floor((now - created) / 1000);
      const remaining = Math.max(0, COUNTDOWN_DURATION - elapsed);
      setRemainingTime(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [transaction]);

  if (!isOpen || !transaction) return;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyLevel = (seconds: number) => {
    if (seconds < 180) return 'urgent';
    if (seconds < 360) return 'warning';
    return 'normal';
  };

  const convertToTimeString = (time: number): string => {
    const date = new Date(time);
    // Convert to hh:mm (24-hour format)
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const urgency = getUrgencyLevel(remainingTime);

  const headerColors = {
    urgent: 'bg-red-300',
    warning: 'bg-yellow-300',
    normal: 'bg-green-300'
  };

  const timeColors = {
    urgent: 'text-red-800',
    warning: 'text-yellow-800',
    normal: 'text-green-800'
  };

  const buttonColors = {
    urgent: 'bg-red-800 hover:bg-red-900',
    warning: 'bg-yellow-700 hover:bg-yellow-800',
    normal: 'bg-green-700 hover:bg-green-800'
  };

  return (
    <div 
      className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${headerColors[urgency]} px-6 py-4 flex items-center justify-between flex-shrink-0`}>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{transaction.code === "" ? "Tanpa Nama" : transaction.code}</h3>
            <p className="text-sm text-gray-700 mt-1">
            {convertToTimeString(transaction.timeCreated!)}, {transaction.category}
            </p>
          </div>
          <div className={`text-5xl font-black ${timeColors[urgency]}`}>
            {formatTime(remainingTime)}
          </div>
        </div>

        {/* Items List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Detail Pesanan ({transaction.orderedMenus.length} items)
          </h4>
          <div className="space-y-3">
            {transaction.orderedMenus.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
              >
                <div className="font-semibold text-gray-800 text-lg">
                  {item.quantity} x {item.menu.name} ({item.menu.abbreviation})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Tutup
          </button>
          <button
            onClick={onComplete}
            className={`flex-1 ${buttonColors[urgency]} text-white font-bold py-4 rounded-xl transition-colors text-lg`}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
