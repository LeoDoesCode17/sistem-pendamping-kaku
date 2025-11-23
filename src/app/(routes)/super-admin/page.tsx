// features/cashier/pages/OrderTypePage.tsx
"use client";

import {
  UtensilsCrossed,
} from "lucide-react";
import { useRouter } from "next/navigation";
import RippleButton from "@/features/ui/Button/RippleButton";
import { useEffect, useState } from "react";

interface OrderType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function SuperAdmin() {
  const router = useRouter();

  const orderTypes: OrderType[] = [
    {
      id: "register-user",
      name: "Register User",
      icon: <UtensilsCrossed size={32} />,
    },
    { id: "list-user", name: "List User", icon: <UtensilsCrossed size={32} /> },
    {
      id: "outlet-management",
      name: "Outlet Management",
      icon: <UtensilsCrossed size={32} />,
    },
  ];
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href); // Full URL
  }, []);

  const handleOrderTypeClick = (type: string) => {
    router.push(`${currentUrl}/${type}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#8B0000] text-center mb-8">
        Pilih Aksi
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {orderTypes.map((type) => (
          <RippleButton
            key={type.id}
            aria-label={`Pilih ${type.name}`}
            onClick={() => handleOrderTypeClick(type.id)}
            rippleColorClass="bg-white/25"
            surfaceClassName={[
              "bg-[#8B0000] text-cream rounded-2xl p-5 min-h-[140px]",
              "flex flex-col items-center justify-center gap-3",
              "transition-transform duration-150",
              "shadow-md hover:shadow-lg hover:bg-[#A52A2A]",
              "active:scale-[0.98]",
            ].join(" ")}
          >
            <div className="bg-maroon2 rounded-full p-3">{type.icon}</div>
            <span className="text-xl font-semibold">{type.name}</span>
          </RippleButton>
        ))}
      </div>
    </div>
  );
}
