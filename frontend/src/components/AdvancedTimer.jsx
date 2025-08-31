import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsClockHistory } from "react-icons/bs";
import { FaBoxOpen, FaCheckCircle } from "react-icons/fa";

const AdvancedTimer = ({ orderDate, status }) => {
  const timerDuration = 30 * 60 * 1000; // 30 minutes in ms
  const placedTime = new Date(orderDate).getTime();
  const now = Date.now();

  const isDelivered = status === "Delivered";
  const isConfirmed = [
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ].includes(status);
  const isExpired = now >= placedTime + timerDuration;

  const [remaining, setRemaining] = useState(
    isDelivered || isExpired ? 0 : placedTime + timerDuration - now
  );

  useEffect(() => {
    if (isDelivered || isExpired) return;

    const interval = setInterval(() => {
      const newRemaining = placedTime + timerDuration - Date.now();
      setRemaining(Math.max(newRemaining, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [placedTime, isDelivered, isExpired]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const formattedTime = `${minutes}m ${seconds}s`;
  const progress = Math.floor((remaining / timerDuration) * 100);

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 w-full max-w-md mx-auto rounded-2xl shadow-md p-4 sm:p-5 my-5 text-sm text-gray-200 border border-blue-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-gray-800 p-2 rounded-full shadow-md">
          <BsClockHistory className="text-white text-xl sm:text-2xl" />
        </div>
        <div className="text-base sm:text-lg font-semibold text-white">
          Order Status Tracker
        </div>
      </div>

      {/* Timer or Final Message */}
      {!isDelivered && remaining > 0 && !isConfirmed ? (
        <>
          <p className="text-green-400 font-medium mb-2">
             {formattedTime} left until confirmation ends
          </p>
          <div className="w-full h-2 rounded-full bg-gray-500 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-300">
            Your order has been placed and is awaiting confirmation. Hang tight!
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-white font-semibold text-sm sm:text-base mb-2">
            <FaCheckCircle className="text-green-400 text-lg" />
            {isDelivered ? "Order Delivered Successfully" : "Order Confirmed"}
          </div>
          <p className="text-xs sm:text-sm text-gray-300">
            {isDelivered
              ? "This order has been delivered. Thank you for shopping with us!"
              : "This order has been confirmed and is being processed."}
          </p>
        </>
      )}
    </motion.div>
  );
};

export default AdvancedTimer;
