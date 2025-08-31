import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { FaChevronRight, FaGift } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import emptyCartImg from "../assets/empty-cart.png";
import { ShopContext } from "../context/ShopContext";

// Helper to generate random offer time
const getRandomTime = () => Math.floor(Math.random() * (3600 - 300 + 1)) + 300;

const ViewCartBar = () => {
  const {
    getCartCount,
    getCartAmount,
    products,
    cartItems,
    currency = "₹",
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current route

  const [offerTime, setOfferTime] = useState(getRandomTime());
  const [secondsLeft, setSecondsLeft] = useState(offerTime);
  const [showSummary, setShowSummary] = useState(false);

  const totalItems = getCartCount?.() || 0;
  const totalAmount = getCartAmount?.() || 0;

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const newTime = getRandomTime();
          setOfferTime(newTime);
          return newTime;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-close summary when on /cart
  useEffect(() => {
    if (location.pathname === "/cart") {
      setShowSummary(false);
    }
  }, [location.pathname]);

  const formatTime = (secs) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return min >= 1 ? `${min}m ${sec}s left` : `${sec}s left`;
  };

  const timerPercent = ((offerTime - secondsLeft) / offerTime) * 100;
  const timerColor = secondsLeft <= 60 ? "text-orange-400" : "text-green-400";
  const pulseEffect = secondsLeft <= 60 ? "animate-pulse" : "";

  const handleCartClick = (e) => {
    e.stopPropagation();
    navigate("/cart");
  };

  const handleSelectItems = (e) => {
    e.stopPropagation();
    navigate("/collection");
  };

  const getCartImages = () => {
    return Object.keys(cartItems)
      .map((id) => products.find((p) => p._id === id))
      .filter((p) => p?.image)
      .map((p) => p.image)
      .slice(0, 3);
  };

  const images = getCartImages();

  const handleBarClick = () => {
    // 👇 Prevent toggle if on cart page or cart is empty
    if (totalItems > 0 && location.pathname !== "/cart") {
      setShowSummary((prev) => !prev);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        onClick={handleBarClick}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className={`fixed bottom-4 left-4 right-4 z-[999] bg-black/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] px-4 py-3 flex flex-col cursor-pointer block md:hidden ${
          totalItems > 0 ? "hover:bg-black/95 transition-all duration-300" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-3 w-full flex-wrap">
          {totalItems === 0 ? (
            <div className="flex items-center justify-between w-full flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={emptyCartImg}
                  alt="Empty Cart"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-red-400 font-semibold text-sm">
                    Your cart is empty
                  </p>
                  <p className="text-gray-400 text-xs">
                    Add something to Order :)
                  </p>
                </div>
              </div>
              <button
                onClick={handleSelectItems}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-full shadow transition duration-200"
              >
                Select Items
              </button>
            </div>
          ) : (
            <>
              <div className="relative w-[80px] h-10 flex-shrink-0">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="cart item"
                    className={`w-9 h-9 rounded-full object-cover border-2 border-white absolute top-0 transition-transform duration-200 hover:scale-105 ${
                      idx === 0
                        ? "left-0 z-30"
                        : idx === 1
                        ? "left-5 z-20"
                        : "left-10 z-10"
                    }`}
                  />
                ))}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-[15px] font-bold leading-tight truncate">
                  View Cart
                </p>
                <p className="text-xs text-gray-300 truncate">
                  {totalItems} {totalItems === 1 ? "item" : "items"} •{" "}
                  {currency}
                  {totalAmount}
                </p>
              </div>

              <div
                className={`flex items-center gap-2 px-2 py-1 rounded-xl text-xs font-semibold border relative ${
                  secondsLeft <= 60
                    ? "bg-orange-900/20 border-orange-400"
                    : "bg-green-900/20 border-green-400"
                } ${pulseEffect} transition-all duration-300`}
              >
                <div className="relative w-6 h-6" title="Limited-time offer">
                  <svg className="absolute top-0 left-0 w-6 h-6">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke={secondsLeft <= 60 ? "#f97316" : "#22c55e"}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="62.8"
                      strokeDashoffset={`${62.8 - (62.8 * timerPercent) / 100}`}
                      strokeLinecap="round"
                      transform="rotate(-90 12 12)"
                    />
                  </svg>
                  <FaGift
                    className={`absolute top-[4px] left-[4px] text-[13px] ${
                      secondsLeft <= 60 ? "text-orange-400" : "text-green-400"
                    }`}
                  />
                </div>
                <span className={`${timerColor} truncate`}>
                  {formatTime(secondsLeft)}
                </span>
              </div>

              <FaChevronRight className="text-white text-lg flex-shrink-0" />
            </>
          )}
        </div>

        {/* Progress Bar */}
        {totalItems > 0 && (
          <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                secondsLeft <= 60 ? "bg-orange-500" : "bg-green-500"
              }`}
              style={{ width: `${timerPercent}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        )}

        {/* Summary Popup */}
        <AnimatePresence>
          {showSummary && location.pathname !== "/cart" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative mt-3 bg-zinc-900/80 border border-gray-700 rounded-xl px-4 py-5 text-sm text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-lg overflow-hidden"
            >
              {/* Pulse animated ring */}
              <div className="absolute -inset-1 bg-gradient-to-br from-green-500/20 via-transparent to-transparent rounded-xl blur-md animate-pulse pointer-events-none z-0" />

              {/* Offer Timer with Circle */}
              <div className="flex items-center justify-between mb-4 z-10 relative">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <svg className="absolute top-0 left-0 w-8 h-8 rotate-[-90deg]">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="#10B981"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="88"
                        strokeDashoffset={`${88 - (88 * timerPercent) / 100}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <FaGift className="absolute top-[6px] left-[6px] text-green-400 text-[15px]" />
                  </div>
                  <p className="text-green-400 font-semibold text-xs animate-pulse">
                    {formatTime(secondsLeft)} left for this deal!
                  </p>
                </div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wide">
                  Limited Time Offer
                </span>
              </div>

              {/* 1. Item Count + Overlapping Photos */}
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-[15px] font-medium tracking-wide">
                  <b>{totalItems}</b> {totalItems === 1 ? "item" : "items"} in
                  your cart
                </p>

                {/* Overlapping Cart Item Images */}
                <div className="relative flex items-center -space-x-3">
                  {images.slice(0, 5).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Cart Item"
                      className="w-7 h-7 rounded-full border-2 border-white shadow-md object-cover"
                      style={{ zIndex: 5 - idx }}
                    />
                  ))}
                  {images.length > 5 && (
                    <span className="w-7 h-7 rounded-full bg-zinc-800 text-xs text-white flex items-center justify-center border-2 border-white shadow">
                      +{images.length - 5}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs">Cart Total</span>
                <span className="text-green-400 font-semibold text-lg tracking-wider drop-shadow-md">
                  {currency}
                  {totalAmount}
                </span>
              </div>

              {/* Floating Tags */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] mt-4">
                <span className="bg-green-800/30 border border-green-600 px-2 py-1 rounded-full text-green-300 shadow-inner backdrop-blur-sm">
                  Fast Checkout
                </span>
                <span className="bg-orange-900/30 border border-orange-500 px-2 py-1 rounded-full text-orange-300 shadow-inner backdrop-blur-sm">
                  Hot Deal
                </span>

                <span className="bg-sky-900/30 border border-sky-500 px-2 py-1 rounded-full text-sky-200 shadow-inner backdrop-blur-sm">
                  Free Delivery
                </span>
              </div>

              {/* Glowing CTA Button - Bottom */}
              <div className="pt-8 z-10 relative">
                <button
                  onClick={handleCartClick}
                  className="w-full flex justify-center items-center gap-2 text-sm font-bold uppercase bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-green-600/400 transition-all duration-300 animate-[float_1s_ease-in-out_infinite]"
                
                  > Go to Cart <FaChevronRight className="text-white text-sm" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewCartBar;
