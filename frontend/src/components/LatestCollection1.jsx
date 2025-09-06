import axios from "axios";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const CategoryShowcase = ({ category, title }) => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [investmentProducts, setInvestmentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(`🎬 CategoryShowcase component rendered for ${category}`);

  // Test if component is mounting
  useEffect(() => {
    console.log(`🎉 Component ${category} mounted!`);
  }, [category]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch investment products from backend
  useEffect(() => {
    const fetchInvestmentProducts = async () => {
      try {
        console.log(`🔍 Fetching products for ${category}...`);
        setIsLoading(true);

        // Use env backend URL with localhost fallback
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        console.log(`🔗 Using backend URL: ${backendUrl}`);

        const fullUrl = `${backendUrl}/api/investment-product/list`;
        console.log(`📡 Making request to: ${fullUrl}`);

        const response = await axios.get(fullUrl);

        console.log(`📡 API Response for ${category}:`, response.data);
        console.log(`📡 Response status:`, response.status);
        console.log(`📡 Response success:`, response.data.success);
        console.log(`📡 Products array:`, response.data.products);
        console.log(`📡 Products length:`, response.data.products?.length);

        if (response.data.success && response.data.products) {
          setInvestmentProducts(response.data.products);
          console.log(
            `✅ Products loaded for ${category}:`,
            response.data.products.length
          );
        } else {
          console.log(`❌ API returned success: false or no products`);
        }
      } catch (error) {
        console.error(`❌ Error fetching products for ${category}:`, error);
        console.error(`❌ Error details:`, {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      } finally {
        setIsLoading(false);
        console.log(`🏁 Fetch completed, isLoading set to false`);
      }
    };

    fetchInvestmentProducts();
  }, [category]);

  // Filter products by category
  useEffect(() => {
    if (investmentProducts.length === 0) return;

    console.log(
      `🎯 Filtering ${category} products from ${investmentProducts.length} total products`
    );

    const filtered = investmentProducts.filter((item) => {
      const itemCategory = item.category?.toLowerCase() || "";
      const targetCategory = category.toLowerCase();

      console.log(
        `🔍 Checking: ${item.productTitle} (${item.category}) against ${category}`
      );

      // Exact match (case-insensitive)
      return itemCategory === targetCategory;
    });

    console.log(
      `🎯 Found ${filtered.length} products for ${category}:`,
      filtered
    );
    setCategoryProducts(filtered);
  }, [investmentProducts, category]);

  const handleImageClick = (product) => {
    // Scroll to top before opening new content
    window.scrollTo(0, 0);
    
    if (product.youtubeLink) {
      let youtubeUrl = product.youtubeLink;

      // Handle different YouTube link formats
      if (youtubeUrl.includes("youtube.com/watch?v=")) {
        window.open(youtubeUrl, "_blank");
      } else if (youtubeUrl.includes("youtu.be/")) {
        window.open(youtubeUrl, "_blank");
      } else if (youtubeUrl.includes("youtube.com/")) {
        window.open(youtubeUrl, "_blank");
      } else if (youtubeUrl.startsWith("http")) {
        window.open(youtubeUrl, "_blank");
      } else {
        // Try to construct a proper YouTube URL
        const videoId = youtubeUrl
          .replace("youtube.com/watch?v=", "")
          .replace("youtu.be/", "");
        if (videoId && videoId.length > 5) {
          window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
        } else {
          alert("Invalid YouTube link format. Please check the link.");
        }
      }
    } else if (product.videoFile) {
      window.open(product.videoFile, "_blank");
    } else {
      alert("No video content available for this product.");
    }
  };

  const getYouTubeEmbedUrl = (raw) => {
    if (!raw) return null;
    let videoId = null;
    try {
      const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.replace("/", "");
      } else if (url.searchParams.get("v")) {
        videoId = url.searchParams.get("v");
      } else if (url.pathname.includes("/shorts/")) {
        videoId = url.pathname.split("/shorts/")[1];
      }
    } catch (_) {
      // Fallback simple parsing
      if (raw.includes("youtu.be/")) videoId = raw.split("youtu.be/")[1];
      if (raw.includes("watch?v=")) videoId = raw.split("watch?v=")[1];
    }
    if (!videoId) return null;
    const id = videoId.split("&")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${id}`;
  };

  const getYouTubeWatchUrl = (raw) => {
    if (!raw) return null;
    let embed = getYouTubeEmbedUrl(raw);
    if (!embed) return null;
    const id = embed.split("/embed/")[1]?.split("?")[0];
    if (!id) return null;
    return `https://www.youtube.com/watch?v=${id}`;
  };

  const ProductCard = ({
    product,
    className = "",
    showTitle = true,
    isScrolling = false,
    isVertical = false,
    isRightSide = false,
  }) => (
    <motion.div
      className={`relative overflow-hidden bg-black group ${className}`}
      initial={isScrolling ? { opacity: 0, y: 20 } : {}}
      animate={isScrolling ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={isRightSide ? { aspectRatio: "5/2" } : {}}
      onClick={() => handleImageClick(product)}
    >
      <div className="relative w-full h-full group">
        <img
          src={
            product?.coverImage ||
            product?.image ||
            "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={product?.productTitle || product?.name || "Product"}
          className={`w-full h-full transition-transform duration-700 group-hover:scale-110 cursor-pointer ${
            isVertical || isRightSide ? "object-cover" : "object-contain"
          }`}
          onClick={() => handleImageClick(product)}
        />

        {/* Click-through overlay to ensure navigation */}
        {getYouTubeWatchUrl(product.youtubeLink) && (
          <a
            href={getYouTubeWatchUrl(product.youtubeLink)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-20"
            aria-label="Open on YouTube"
          />
        )}

        {/* Category Chip */}
        {product?.category && (
          <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-2 py-1 text-[10px] sm:text-xs rounded-full bg-white/10 text-white border border-white/20 backdrop-blur">
              {product.category}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Content Overlay */}
        {showTitle && product && (
          <motion.div
            className={`absolute bottom-0 left-0 right-0 ${
              isVertical || isRightSide ? "p-2 sm:p-3" : "p-3 sm:p-4"
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
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
              {product.productTitle || product.name}
            </h3>
            <div
              className={`flex items-center gap-2 ${
                isVertical || isRightSide ? "text-xs" : "text-xs sm:text-sm"
              }`}
            >
              <span className="text-gray-400 font-semibold">
                {product.artistName || product.category || "N/A"}
              </span>
              {product.youtubeLink && (
                <span className="text-red-400 font-semibold flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.1-.9C17.8 2.8 12 2.8 12 2.8h0s-5.8 0-8.6.3c-.4 0-1.3.1-2.1.9-.6.7-.8 2.3-.8 2.3S0 8.1 0 10v1.9c0 1.9.2 3.8.2 3.8s.2 1.6.8 2.3c.8.8 1.8.8 2.3.9 1.7.2 7.2.3 8.7.3 0 0 5.8 0 8.6-.3.4 0 1.3-.1 2.1-.9.6-.7.8-2.3.8-2.3s.2-1.9.2-3.8V10c0-1.9-.2-3.8-.2-3.8zM9.6 13.8V7.9l6.1 3-6.1 2.9z" />
                  </svg>
                  Watch
                </span>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  // Video-only card for right-side slider
  const ProductVideoCard = ({ product, className = "" }) => (
    <motion.div
      className={`relative overflow-hidden bg-black group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ aspectRatio: "5/2" }}
      onClick={() => handleImageClick(product)}
    >
      <div className="relative w-full h-full group">
        {/* Category chip */}
        {product?.category && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-1 text-[10px] sm:text-xs rounded-full bg-white/10 text-white border border-white/20 backdrop-blur">
              {product.category}
            </span>
          </div>
        )}
        {/* Show video inline on right column (YouTube embed preferred) */}
        {getYouTubeEmbedUrl(product.youtubeLink) ? (
          <iframe
            src={getYouTubeEmbedUrl(product.youtubeLink)}
            title={product.productTitle || "Video"}
            className="w-full h-full object-cover pointer-events-none"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : product?.videoFile ? (
          <video
            src={product.videoFile}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay
          />
        ) : (
          <img
            src={
              product?.coverImage ||
              product?.image ||
              "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={product?.productTitle || product?.name || "Product"}
            className="w-full h-full object-cover"
          />
        )}

        {/* Click-through overlay to ensure navigation */}
        {(getYouTubeWatchUrl(product.youtubeLink) || product.videoFile) && (
          <a
            href={getYouTubeWatchUrl(product.youtubeLink) || product.videoFile}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-20"
            aria-label="Open video"
          />
        )}

        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Title + YouTube badge */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white">
            <span className="font-semibold truncate max-w-[70%]">
              {product.productTitle || product.name}
            </span>
            {product.youtubeLink && (
              <span className="text-red-400 font-semibold flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.1-.9C17.8 2.8 12 2.8 12 2.8h0s-5.8 0-8.6.3c-.4 0-1.3.1-2.1.9-.6.7-.8 2.3-.8 2.3S0 8.1 0 10v1.9c0 1.9.2 3.8.2 3.8s.2 1.6.8 2.3c.8.8 1.8.8 2.3.9 1.7.2 7.2.3 8.7.3 0 0 5.8 0 8.6-.3.4 0 1.3-.1 2.1-.9.6-.7.8-2.3.8-2.3s.2-1.9.2-3.8V10c0-1.9-.2-3.8-.2-3.8zM9.6 13.8V7.9l6.1 3-6.1 2.9z" />
                </svg>
                Watch
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="w-full">
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

        <div className="w-full flex items-center justify-center rounded-lg shadow-2xl border border-black p-8">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading {title} products...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Debug Information */}
        <div className="mb-4 p-4 bg-gray-800 rounded-lg">
          <p className="text-white text-sm">
            <strong>Debug Info for {category}:</strong>
            <br />
            Category: {category}
            <br />
            Total Products Loaded: {investmentProducts.length}
            <br />
            Available Categories:{" "}
            {[...new Set(investmentProducts.map((p) => p.category))].join(", ")}
            <br />
            Filtered Products for {category}: {categoryProducts.length}
            <br />
            Is Loading: {isLoading.toString()}
            <br />
            Backend URL:{" "}
            {import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}
          </p>

          {/* Test Button */}
          <button
            onClick={async () => {
              console.log("🧪 Manual test button clicked!");
              try {
                const response = await fetch(
                  "http://localhost:4000/api/investment-product/list"
                );
                console.log("🧪 Manual test response:", response);
                const data = await response.json();
                console.log("🧪 Manual test data:", data);
                alert(
                  `Manual test: ${data.products?.length || 0} products found`
                );
              } catch (error) {
                console.error("🧪 Manual test error:", error);
                alert(`Manual test error: ${error.message}`);
              }
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🧪 Test API Manually
          </button>

          {/* Show all products for debugging */}
          <div className="mt-4">
            <p className="text-white text-sm font-bold mb-2">
              All Products ({investmentProducts.length}):
            </p>
            {investmentProducts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {investmentProducts.map((product, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-md bg-white/5 text-white border border-white/10"
                  >
                    {product.productTitle}{" "}
                    <span className="opacity-60">
                      ({product.category || "N/A"})
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-white text-xs mt-1">No products loaded yet</p>
            )}
          </div>

          {/* Show filtered products for debugging */}
          <div className="mt-4">
            <p className="text-white text-sm font-bold mb-2">
              Filtered Products for {category} ({categoryProducts.length}):
            </p>
            {categoryProducts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categoryProducts.map((product, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-md bg-green-500/10 text-green-200 border border-green-500/20"
                  >
                    {product.productTitle}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-white text-xs mt-1">
                No products match this category
              </p>
            )}
          </div>
        </div>

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
  const rightProducts = categoryProducts
    .slice(2)
    .filter((p) => !!p.youtubeLink || !!p.videoFile);

  return (
    <div className="w-full">
      {/* Category Title with View All Button */}
      <motion.div
        className="mb-6 flex justify-between items-center"
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
        <button
          onClick={() => {
            window.scrollTo(0, 0);
            navigate('/Photo');
          }}
          className="text-white hover:text-gray-300 transition-colors duration-300 group"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "600",
          }}
        >
          <span className="text-sm sm:text-base uppercase tracking-wider border-b border-transparent group-hover:border-white transition-all duration-300">
            View All
          </span>
        </button>
      </motion.div>

      {/* Main Content */}
      <div
        className="w-full overflow-hidden relative rounded-lg shadow-2xl border border-black"
        style={{
          aspectRatio: isMobile ? "5/3" : "5/2",
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

            {/* Right Side - Scrolling Photos (50% width) */}
            <div className="w-1/2 h-full overflow-hidden flex flex-col justify-center p-0 gap-0">
              {categoryProducts.length > 0 ? (
                <motion.div
                  className="flex flex-col gap-0"
                  animate={{
                    y: ["0%", "-50%"], // Smooth continuous scroll
                  }}
                  transition={{
                    duration: categoryProducts.length * 3,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  {categoryProducts
                    .concat(categoryProducts)
                    .map((product, index) => (
                      <div
                        key={`scroll-${index}`}
                        className="flex-shrink-0 mb-0"
                      >
                        <ProductCard
                          product={product}
                          className="w-full"
                          isRightSide={true}
                          showTitle={true}
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
          /* Mobile Layout - Only left side photos */
          <div className="flex h-full">
            {/* Only Left photos side by side (full width for mobile) */}
            <div className="w-full h-full flex">
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
          <CategoryShowcase category="Music" title="MUSIC" />
        </div>

        {/* Film Section */}
        <div className="w-full">
          <CategoryShowcase category="Film" title="FILM" />
        </div>

        {/* Commercial Section */}
        <div className="w-full">
          <CategoryShowcase category="Commercial" title="COMMERCIAL" />
        </div>
      </div>
    </div>
  );
};

export default VerticalSplitShowcase;
