import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-24 right-5 z-50 sm:hidden">
      <a
        href="https://wa.me/917650965133"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-xl border border-white transform hover:scale-105 transition duration-300 animate-[float_2s_ease-in-out_infinite]"
      >
        <FaWhatsapp className="text-white text-2xl" />
        <span className="text-white font-bold text-sm">Support</span>
      </a>

      {/* Tailwind custom animation with inline style */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default WhatsAppButton;
