import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  // sorting logic
  const sortProduct = (list) => {
    const sorted = [...list];
    if (sortType === "low-high") sorted.sort((a, b) => a.price - b.price);
    else if (sortType === "high-low") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // search filter
  useEffect(() => {
    let filtered = [...products];
    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilterProducts(sortProduct(filtered));
  }, [products, search, showSearch, sortType]);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Navigation (example, replace with your Nav component) */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <nav className="flex gap-8 text-sm">
          <a href="/" className="hover:text-gray-300">
            Home
          </a>
          <a href="/about" className="hover:text-gray-300">
            About
          </a>
          <a href="/services" className="hover:text-gray-300">
            Services
          </a>
          <a href="/work" className="hover:text-gray-300">
            Work
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-sm hover:text-gray-300">
            Login
          </a>
          <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700">
            Sign Up
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Product Count + Sort */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <p className="text-sm text-gray-400">
            Showing <strong>{filterProducts.length}</strong> products
          </p>
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="bg-black border border-gray-700 px-3 py-2 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <Link
                to={`/product/${item._id || index}`}
                key={index}
                className="bg-black border border-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition block"
              >
                <img
                  src={item.image || assets.placeholder}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={assets.user}
                      alt="artist"
                      className="w-8 h-8 rounded-full border border-gray-600"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-400">${item.price}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 gap-4 text-gray-400">
                    <button className="hover:text-white">👍</button>
                    <button className="hover:text-white">👎</button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 text-sm">
              No products found
            </p>
          )}
        </div>

        {/* Latest Collection */}
       
      </main>
    </div>
  );
};

export default Collection;
