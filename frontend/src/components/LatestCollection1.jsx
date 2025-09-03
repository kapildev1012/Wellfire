import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

const CategoryShowcase = ({ category, title }) => {
  const { products } = useContext(ShopContext);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter products by category
  useEffect(() => {
    const filtered = products
      .filter(
        (item) =>
          item.category?.toLowerCase() === category.toLowerCase() ||
          item.subCategory?.toLowerCase() === category.toLowerCase()
      )
      .slice(0, 8);
    setCategoryProducts(filtered);
  }, [products, category]);

  const ProductCard = ({
    product,
    className = "",
    showTitle = true,
    isScrolling = false,
    isVertical = false,
    isRightSide = false,
  }) => (
    <motion.div
      className={`relative overflow-hidden bg-black ${className}`}
      initial={isScrolling ? { opacity: 0, y: 20 } : {}}
      animate={isScrolling ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={isRightSide ? { aspectRatio: "5/2" } : {}}
    >
      <div className="relative w-full h-full group">
        <img
          src={product?.image}
          alt={product?.name || "Product"}
          className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${
            isVertical || isRightSide ? "object-cover" : "object-contain"
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

        {/* Content Overlay */}
        {showTitle && product && (
          <motion.div
            className={`absolute bottom-0 left-0 right-0 ${
              isVertical || isRightSide ? "p-2 sm:p-3" : "p-3 sm:p-4"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3
              className={`uppercase tracking-wider leading-tight mb-1 text-white font-bold ${
                isVertical || isRightSide
                  ? "text-xs sm:text-sm"
                  : "text-sm sm:text-base md:text-lg"
              }`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "800",
              }}
            >
              {product.name}
            </h3>
            <div
              className={`flex items-center gap-2 ${
                isVertical || isRightSide ? "text-xs" : "text-xs sm:text-sm"
              }`}
            >
              <span className="text-gray-400 font-semibold">
                {product.category || "N/A"}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  if (categoryProducts.length === 0) {
    return (
      <div className="w-full">
        {/* Category Title */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl uppercase tracking-widest text-white mb-4"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "800",
            }}
          >
            {title}
          </h2>
         
        </motion.div>

        <div
          className="w-full flex items-center justify-center rounded-lg shadow-2xl border border-black"
          style={{
            aspectRatio: isMobile ? "1/1.2" : "5/2",
            background: "rgba(0, 0, 0, 0.9)",
          }}
        >
          <p
            className="text-white text-lg"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "800" }}
          >
            No {title} products available
          </p>
        </div>
      </div>
    );
  }

  const leftProducts = categoryProducts.slice(0, 2);
  const rightProducts = categoryProducts.slice(2);

  return (
    <div className="w-full">
      {/* Category Title */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl uppercase tracking-widest text-white mb-4"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "800",
          }}
        >
          {title}
        </h2>
        
      </motion.div>

      {/* Main Content */}
      <div
        className="w-full overflow-hidden relative rounded-lg shadow-2xl border border-black"
        style={{
          aspectRatio: isMobile ? "1/1.2" : "5/2",
          background: "rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Desktop Layout */}
        {!isMobile ? (
          <div className="flex h-full">
            {/* Left Side - Two photos side by side (50% width) */}
            <div className="w-1/2 h-full flex">
              {leftProducts.map((product, index) => (
                <div key={`left-${index}`} className="w-1/2 h-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="w-full h-full"
                  >
                    <ProductCard
                      product={product}
                      className="w-full h-full"
                      showTitle={true}
                      isVertical={true}
                    />
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Right Side - Scrolling Photos with 2:5 aspect ratio (50% width) */}
            <div className="w-1/2 h-full overflow-hidden flex flex-col justify-center p-0 gap-0">
              {rightProducts.length > 0 ? (
                <motion.div
                  className="flex flex-col gap-0"
                  animate={{
                    y: [0, -(rightProducts.length * 120)], // Adjusted for spacing
                  }}
                  transition={{
                    duration: rightProducts.length * 2,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  {rightProducts
                    .concat(rightProducts.slice(0, 1))
                    .map((product, index) => (
                      <div
                        key={`scroll-${index}`}
                        className="flex-shrink-0 mb-0"
                      >
                        <ProductCard
                          product={product}
                          className="w-full"
                          showTitle={true}
                          isScrolling={true}
                          isRightSide={true}
                        />
                      </div>
                    ))}
                </motion.div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: "rgba(0, 0, 0, 0.8)",
                  }}
                >
                  <p
                    className="text-white text-sm text-center px-4"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: "600",
                    }}
                  >
                    More {title} coming soon...
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mobile Layout - Bigger sections */
          <div className="flex flex-col h-full">
            {/* Top Section - Left photos side by side (60% height for mobile) */}
            <div className="w-full h-1/2 flex">
              {leftProducts.map((product, index) => (
                <div key={`mobile-left-${index}`} className="w-1/2 h-full">
                  <ProductCard
                    product={product}
                    className="w-full h-full"
                    showTitle={true}
                    isVertical={true}
                  />
                </div>
              ))}
            </div>

            {/* Bottom Section - Scrolling section (40% height for mobile) */}
            <div className="w-full h-1/5 overflow-hidden p-2">
              {rightProducts.length > 0 ? (
                <motion.div
                  className="flex flex-row gap-2"
                  animate={{
                    x: [0, -(rightProducts.length * 120)], // Adjusted for spacing
                  }}
                  transition={{
                    duration: rightProducts.length * 3,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  {rightProducts
                    .concat(rightProducts.slice(0, 1))
                    .map((product, index) => (
                      <div
                        key={`mobile-scroll-${index}`}
                        className="flex-shrink-0 mr-2"
                      >
                        <ProductCard
                          product={product}
                          className="h-full"
                          showTitle={true}
                          isScrolling={true}
                          isRightSide={true}
                        />
                      </div>
                    ))}
                </motion.div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: "rgba(0, 0, 0, 0.8)",
                  }}
                >
                  <p
                    className="text-white text-xs text-center px-2"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: "600",
                    }}
                  >
                    More {title}...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex items-center gap-2">
          {leftProducts.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white opacity-70"
              whileHover={{ scale: 1.3, opacity: 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const VerticalSplitShowcase = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-black">
      {/* Main Title */}
      <motion.div
        className="relative z-20 text-center pt-8 pb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-0"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "900",
            letterSpacing: "0.1em",
          }}
        ></h1>
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 px-4 pb-8 space-y-16">
        {/* Music Section */}
        <div className="w-full">
          <CategoryShowcase category="music" title="MUSIC" />
        </div>

        {/* Film Section */}
        <div className="w-full">
          <CategoryShowcase category="film" title="FILM" />
        </div>

        {/* Commercial Section */}
        <div className="w-full">
          <CategoryShowcase category="commercial" title="COMMERCIAL" />
        </div>
      </div>
    </div>
  );
};

export default VerticalSplitShowcase;
