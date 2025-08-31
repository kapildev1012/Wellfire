import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const delivery_fee = subtotal > 0 && subtotal < 200 ? 30 : 0;
  const tax = +((subtotal + delivery_fee) * 0.05).toFixed(2);
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee + tax;

  const discount =
    subtotal > 2000 ? 100 : subtotal > 1500 ? 50 : subtotal > 1000 ? 30 : 0;

  return (
    <div className="w-full bg-white p-4 rounded-2xl shadow-md">
      {/* Title */}
      <div className="text-2xl mb-4">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-2 text-sm text-gray-800">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between">
          <p>Tax (5%)</p>
          <p>
            {currency} {tax.toFixed(2)}
          </p>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-700 font-medium">
            <span>Offer Applied</span>
            <span>
              - {currency} {discount.toFixed(2)}
            </span>
          </div>
        )}

        <hr className="my-2" />

        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>
            {currency} {(total - discount).toFixed(2)}
          </span>
        </div>

        {/* Offer Section */}
        <div className="mt-4 bg-green-50 border border-green-600 rounded-lg p-3 text-xs text-green-900">
          <p className="font-semibold mb-1">💡 Available Offers:</p>
          <ul className="list-disc list-inside space-y-1">
            <li className={subtotal > 1000 ? "line-through text-gray-600" : ""}>
              Spend ₹1000+ and get ₹30 OFF
            </li>
            <li className={subtotal > 1500 ? "line-through text-gray-600" : ""}>
              Spend ₹1500+ and get ₹50 OFF
            </li>
            <li className={subtotal > 2000 ? "line-through text-gray-600" : ""}>
              Spend ₹2000+ and get ₹100 OFF
            </li>
          </ul>
        </div>

        {/* Info Section */}
        <hr className="my-4" />
        <div className="text-xs text-gray-600 space-y-1">
          <p>100% Secure Payment</p>
          <p>Delivery estimated in 30 minutes</p>
          <p>Easy returns & refunds</p>
          <p>Tax Included: 5%</p>
          <p>Customer support: +91-99999-99999</p>
        </div>

        {/* Rating Section */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Rate Your Cart Experience
          </p>
          <RatingStars />
        </div>
      </div>
    </div>
  );
};

const RatingStars = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (value) => {
    setRating(value);
    setSubmitted(true);
  };

  return (
    <>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-xl transition-transform duration-200 ${
              (hover || rating) >= star
                ? "text-yellow-500 scale-110"
                : "text-gray-400"
            }`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          >
            ★
          </button>
        ))}
      </div>
      {submitted && (
        <p className="text-green-600 text-xs mt-1 animate-fade-in">
          Thank you for rating {rating} star{rating > 1 ? "s" : ""}!
        </p>
      )}
    </>
  );
};

export default CartTotal;
