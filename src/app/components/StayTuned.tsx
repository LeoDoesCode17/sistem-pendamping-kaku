"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function StayTunedPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Change to your release date
  const releaseDate = new Date("2025-12-31T00:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = releaseDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseDate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">
        Coming Soon
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        We’re working hard to give you the best experience.
        <br />
        <span className="font-semibold text-gray-700">Stay tuned!</span>
      </p>

      {/* Countdown */}
      <div className="flex gap-6 text-center mb-12">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label}>
            <div className="text-4xl font-bold">{item.value}</div>
            <div className="text-sm text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Social Media */}
      <div className="flex space-x-6 text-gray-500 text-2xl">
        <a href="#" className="hover:text-blue-600 transition">
          <FaFacebook />
        </a>
        <a href="#" className="hover:text-pink-500 transition">
          <FaInstagram />
        </a>
        <a href="#" className="hover:text-blue-400 transition">
          <FaTwitter />
        </a>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company Name
      </footer>
    </div>
  );
}
