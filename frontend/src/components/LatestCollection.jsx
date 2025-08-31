import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { motion } from "framer-motion";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 30)); // take latest 30 for 3 sections
  }, [products]);

  // Filters
  const musicProducts = latestProducts.filter(
    (item) =>
      item.category?.toLowerCase() === "music" ||
      item.subCategory?.toLowerCase() === "music"
  );
  const filmProducts = latestProducts.filter(
    (item) =>
      item.category?.toLowerCase() === "film" ||
      item.subCategory?.toLowerCase() === "film"
  );
  const commercialProducts = latestProducts.filter(
    (item) =>
      item.category?.toLowerCase() === "commercial" ||
      item.subCategory?.toLowerCase() === "commercial"
  );

  // Helper for description
  const shouldShowDescription = (desc) => {
    if (!desc) return false;
    return desc.split(" ").length <= 50; // show only if short
  };

  // Reusable renderer
  const renderSection = (title1, title2, productsList) => (
    <div className="my-16">
      <div className="mb-10 text-left">
        <Title text1={title1} text2={title2} className="text-left" />
        <p className="w-full md:w-3/3 text-base sm:text-lg text-gray-300 mt-2 font-light leading-relaxed">
          <span className="text-red-600 text-2xl sm:text-3xl font-semibold">
            {title2}
          </span>{" "}
          selections designed to feel cinematic and powerful.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {productsList.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row rounded-xl overflow-hidden bg-black border border-gray-800 shadow-lg hover:shadow-red-900/40 transform transition-all duration-500 hover:scale-[1.03]"
          >
            {/* Left: Image */}
            <div className="w-full md:w-4/5">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 md:h-full object-cover md:aspect-[3/4] lg:aspect-[16/9]"
              />
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-red-600 uppercase tracking-wide">
                {item.name}
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-red-600 mt-2 mb-6"></div>

              {/* Info */}
              <p className="text-lg sm:text-xl mb-2">
                <span className="text-gray-400">Price:</span>{" "}
                <span className="font-bold text-white">₹{item.price}</span>
              </p>
              <p className="text-sm sm:text-base mb-1">
                <span className="text-gray-200">Category:</span>{" "}
                <span className="text-red-500">{item.category || "N/A"}</span>
              </p>
              <p className="text-sm sm:text-base mb-4">
                <span className="text-gray-200">Subcategory:</span>{" "}
                <span className="text-red-500">
                  {item.subCategory || "Uncategorized"}
                </span>
              </p>

              {/* Description */}
              {shouldShowDescription(item.description) && (
                <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-4">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      id="collection"
      className="my-10 px-4 sm:px-6 lg:px-20 font-['Poppins',sans-serif] bg-black"
    >
      {renderSection("LATEST", "MUSIC", musicProducts)}
      {renderSection("LATEST", "FILM", filmProducts)}
      {renderSection("LATEST", "COMMERCIAL", commercialProducts)}
    </div>
  );
};

export default LatestCollection;
