// src/components/IosToast.jsx
import React from "react";
import { FaUserMd } from "react-icons/fa";

const IosToast = ({
  title = "Reminder",
  time,
  message,
  icon: Icon = FaUserMd,
}) => {
  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1">
        <p className="text-[11px] text-zinc-400">Reminder</p>
        <p className="text-sm font-semibold text-white leading-snug">{title}</p>
        {time && <p className="text-xs text-zinc-500">{time}</p>}
        {message && (
          <p className="text-xs text-zinc-400 mt-1 pr-2">{message}</p>
        )}
      </div>
      <div className="ml-4 flex-shrink-0">
        <div className="bg-orange-500 rounded-full p-[6px] shadow-md">
          <Icon className="text-white text-base" />
        </div>
      </div>
    </div>
  );
};

export default IosToast;
