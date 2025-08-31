import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import RelatedProducts from "../components/RelatedProducts";
import { ShopContext } from "../context/ShopContext";

function formatTime(seconds) {
  const d = Math.floor(seconds / (24 * 3600));
  const h = Math.floor((seconds % (24 * 3600)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d > 0 ? `${d}d ` : ""}${h}h ${m}m ${s}s`;
}

const Product = () => {
  const { productId } = useParams();
  const {
    products,
    currency,
    addToCart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    cartItems,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [copyTooltip, setCopyTooltip] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const key = `offerEndTime-${productId}`;
    const existing = localStorage.getItem(key);
    let endTime;

    if (existing) {
      endTime = parseInt(existing);
    } else {
      const randomOffset =
        Math.floor(Math.random() * (2 * 24 * 60 * 60 - 2 * 60 * 60 + 1)) +
        2 * 60 * 60;
      endTime = Math.floor(Date.now() / 1000) + randomOffset;
      localStorage.setItem(key, endTime.toString());
    }

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      setTimeLeft(Math.max(endTime - now, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [productId]);

  useEffect(() => {
    const found = products.find((item) => item._id === productId);
    if (found) {
      setProductData(found);
      setSelectedImage(found.image[0]);
      if (found.sizes.length === 1) {
        setSelectedSize(found.sizes[0]);
      }
    }
  }, [productId, products]);

  // ✅ Load quantity from cart if size changes
  useEffect(() => {
    if (!productData || !selectedSize) return;

    const cartQty =
      productData._id in cartItems && cartItems[productData._id][selectedSize]
        ? cartItems[productData._id][selectedSize]
        : 0;

    setQuantity(cartQty || 1);
  }, [selectedSize, cartItems, productData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  if (!productData) return null;

  const isWishlisted = wishlist.includes(productId);
  const originalPrice = Math.round(productData.price / 0.8);

  const toggleWishlist = () => {
    isWishlisted ? removeFromWishlist(productId) : addToWishlist(productId);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyTooltip(true);
    setTimeout(() => setCopyTooltip(false), 2000);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size", { autoClose: 1500 });
      return;
    }

    addToCart(productData._id, selectedSize, quantity);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-white text-gray-800 max-w-screen-xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Image Gallery */}
        <div className="flex flex-col lg:flex-row flex-[1.2] gap-4">
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[400px]">
            {productData.image.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setSelectedImage(img)}
                className="w-16 h-20 sm:w-20 sm:h-24 object-cover border rounded cursor-pointer hover:shadow-md flex-shrink-0 transition-transform duration-300 hover:scale-105"
              />
            ))}
          </div>
          <div className="flex-1 flex justify-center items-center">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full max-w-[300px] sm:max-w-md md:max-w-xl lg:max-w-2xl rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 space-y-6 text-sm sm:text-base">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-gray-800 tracking-tight">
              {productData.name}{" "}
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                ⭐ Bestseller
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="relative inline-flex">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-65 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <p className="text-sm text-green-600 font-medium">
                Live Stock – Selling Fast, buy now before it runs out!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              🔥 End of Sale
            </span>
            <span className="text-sm font-medium text-red-600">
              Offer ends in {formatTime(timeLeft)}
            </span>
          </div>

          {/* Price Section */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-green-700">
              {currency}
              {productData.price}
              <span className="ml-3 text-gray-500 line-through text-sm">
                {currency}
                {originalPrice}
              </span>
            </div>
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
              20% OFF
            </span>
          </div>

          {/* Size Selector */}
          {productData.sizes.length > 0 && (
            <div className="space-y-1">
              <p className="font-medium">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1.5 border rounded text-sm transition ${
                      selectedSize === size
                        ? "border-green-600 text-green-600 font-medium"
                        : "hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span>Quantity:</span>
            <div className="flex items-center border rounded overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
              >
                –
              </button>
              <div className="px-4">{quantity}</div>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-full font-medium w-full sm:w-auto"
            >
              Add to Cart
            </button>

            <button
              onClick={toggleWishlist}
              className={`px-8 py-2 rounded-full font-medium w-full sm:w-auto border ${
                isWishlisted
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
              }`}
            >
              {isWishlisted ? "Wishlisted" : " Wishlist"}
            </button>

            <button
              onClick={copyLink}
              className="bg-white text-black border px-5 py-2 rounded-full hover:bg-gray-100 w-full sm:w-auto"
            >
              {copyTooltip ? "Copied!" : "🔗 Copy Link"}
            </button>
          </div>

          {/* Product Details */}
          <div className="pt-4 border-t text-gray-800 space-y-2 leading-relaxed">
            <p className="text-base font-semibold text-black">Description</p>
            <p>{productData.description}</p>
            <p>
              <strong>Seller:</strong> {productData.seller || "HOTSPOT RETAILS"}
            </p>
            <p>
              <strong>Location:</strong> Hamirpur, Himachal Pradesh
            </p>
            <p>
              <strong>Category:</strong> {productData.category}
            </p>
            <p>
              <strong>Subcategory:</strong> {productData.subCategory}
            </p>
            <hr />
            <p>✅ 100% organic Product</p>
            <p>🚚 Delivery in 30 mins</p>
            <p>💰 Cash on Delivery Available</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16 px-2 md:px-0">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </div>
    </div>
  );
};

export default Product;
