import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { products } = useContext(ShopContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let tempProducts = products.filter(
      (product) =>
        product.category &&
        product.category.toLowerCase() === categoryName.toLowerCase()
    );

    if (searchTerm) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(tempProducts);
    setLoading(false);
  }, [categoryName, products, searchTerm]);

  const formattedCategory =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div className="p-4 sm:px-6">
      <Title text1={formattedCategory} text2="Products" />

      {/* Search input */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
        />
      </div>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="mt-12 text-center text-gray-500">
          <img
            src={
              assets.empty ||
              "https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            }
            alt="No products"
            className="mx-auto w-24 sm:w-32 mb-4 opacity-70"
          />
          <p className="text-sm sm:text-base">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mt-6 transition-all duration-300">
          {filteredProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name || "No Name"}
              id={item._id || index}
              price={item.price || 0}
              image={item.image || assets.placeholder}
              rating={item.rating || 0}
              quantity={item.quantity || 0}
              subCategory={item.subCategory || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
