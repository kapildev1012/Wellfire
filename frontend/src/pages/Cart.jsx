import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { FaTruck, FaUndo, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    getCartAmount,
    getCartCount,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  const subtotal = getCartAmount();
  const cartCount = getCartCount();
  const freeDeliveryThreshold = 200;
  const isEligibleForFreeDelivery = subtotal >= freeDeliveryThreshold;

  // Discount logic
  const discount =
    subtotal > 2000 ? 100 : subtotal > 1500 ? 50 : subtotal > 1000 ? 30 : 0;
  const bulkDiscount = cartCount >= 115 ? 30 : 0;
  const deliveryFee = isEligibleForFreeDelivery ? 0 : 30;
  const totalAfterDiscount = subtotal - discount - bulkDiscount;
  const tax =
    subtotal > 0 ? +((totalAfterDiscount + deliveryFee) * 0.05).toFixed(2) : 0;

  useEffect(() => {
    if (products.length > 0) {
      const temp = [];
      for (const id in cartItems) {
        for (const size in cartItems[id]) {
          const qty = cartItems[id][size];
          if (qty > 0) temp.push({ _id: id, size, quantity: qty });
        }
      }
      setCartData(temp);
    }
  }, [cartItems, products]);

  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 py-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-900">
        CART
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartData.length === 0 ? (
            <div className="bg-white rounded-2xl border p-6 shadow-xl text-center flex flex-col items-center animate-fade-in">
              <div className="text-[3rem] animate-bounce mb-2">🛒</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Your Cart is Empty!
              </h2>
              <p className="text-sm text-gray-600 max-w-xs mb-4">
                Discover trendy products and get exciting discounts.
              </p>
              <img
                src={assets.empty_cart}
                alt="Empty Cart"
                className="w-44 h-44 object-contain rounded-md border shadow-lg hover:scale-110 transition-transform"
              />
              <button
                onClick={() => navigate("/collection")}
                className="mt-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-full text-sm shadow"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartData.map((item, i) => {
              const p = products.find((prod) => prod._id === item._id);
              if (!p) return null;

              return (
                <div
                  key={i}
                  className="bg-white flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="w-full sm:w-28 h-28 overflow-hidden rounded-xl relative">
                    <img
                      src={p.image[0]}
                      alt={p.name}
                      className="w-full h-full object-contain transition-transform hover:scale-105"
                    />
                    {p.bestseller && (
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        🔥 Bestseller
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h2 className="font-semibold text-lg text-gray-800">
                        {p.name}
                      </h2>
                      <p className="text-sm text-gray-700">Size: {item.size}</p>
                      <p className="text-sm text-gray-700">
                        {currency} {p.price} × {item.quantity} ={" "}
                        <span className="font-bold text-black">
                          {currency} {(p.price * item.quantity).toFixed(2)}
                        </span>
                      </p>
                      <p
                        className={`text-xs mt-1 font-medium ${
                          isEligibleForFreeDelivery
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {isEligibleForFreeDelivery
                          ? "Free Delivery Unlocked"
                          : `Add ₹${
                              freeDeliveryThreshold - subtotal
                            } for Free Delivery`}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3 items-center text-xs">
                      <label className="flex items-center gap-1">
                        <span className="font-medium">Qty:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item._id, item.size, +e.target.value)
                          }
                          className="border rounded-lg px-2 py-1 bg-white text-xs"
                        >
                          {[...Array(10).keys()].map((n) => (
                            <option key={n + 1} value={n + 1}>
                              {n + 1}
                            </option>
                          ))}
                        </select>
                      </label>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-gray-600 hover:bg-red-50 text-xs"
                      >
                        <FaTrash className="text-xs" />
                        Delete
                      </motion.button>
                    </div>

                    <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                      <span>
                        <FaTruck className="inline mr-1" /> Delivery in 30–45
                        mins
                      </span>
                      <span>
                        <FaUndo className="inline mr-1" /> 7-Day Return
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Order Summary */}
        {cartData.length > 0 && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl sticky top-20 h-fit">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{cartCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {currency} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {isEligibleForFreeDelivery
                    ? "Free"
                    : `${currency} ${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>
                  {currency} {tax.toFixed(2)}
                </span>
              </div>

              {/* Discount applied */}
              {discount > 0 && (
                <div className="flex justify-between text-sm font-medium text-green-700">
                  <span>Applied Offer</span>
                  <span>
                    − {currency} {discount}
                  </span>
                </div>
              )}

              {/* Offers Block */}
              <div className="border p-3 rounded-lg bg-gray-50 text-[13px] space-y-2">
                <p className="font-medium text-gray-800 mb-1">
                  Available Offers:
                </p>
                <div className="flex justify-between">
                  <span>₹100 OFF on orders ₹2000+</span>
                  <span
                    className={
                      subtotal >= 2000 ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {subtotal >= 2000 ? "✅ Applied" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>₹50 OFF on orders ₹1500+</span>
                  <span
                    className={
                      subtotal >= 1500 && subtotal < 2000
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {subtotal >= 1500 && subtotal < 2000 ? "✅ Applied" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>₹30 OFF on orders ₹1000+</span>
                  <span
                    className={
                      subtotal >= 1000 && subtotal < 1500
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {subtotal >= 1000 && subtotal < 1500 ? "✅ Applied" : ""}
                  </span>
                </div>
                {subtotal < 1000 && (
                  <p className="text-right text-s text-green-600 italic">
                    Add ₹{1000 - subtotal} more to unlock your first offer
                  </p>
                )}
              </div>

              <hr />
              <div className="flex justify-between font-bold text-base">
                <span>Total Payable</span>
                <span>
                  {currency}{" "}
                  {(totalAfterDiscount + deliveryFee + tax).toFixed(2)}
                </span>
              </div>

              {/* Note */}
              {discount > 0 && (
                <p className="text-green-600 font-semibold text-center mt-2">
                  ₹{discount} OFF applied on your order!
                </p>
              )}

              <button
                onClick={() => navigate("/place-order")}
                className="w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold py-3 mt-4 rounded-full shadow-md transition"
              >
                Place Your Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
