import { motion } from "framer-motion";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const ExploreMenu = ({ category, setCategory }) => {
  const { menu_list } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative flex flex-col items-center bg-gradient-to-r from-purple-800 via-pink-800 to-red-700 text-white shadow-lg overflow-hidden"
    >
      <motion.div
        initial={{ x: -50 }}
        animate={{ x: 10 }}
        transition={{ duration: 2, type: "spring", stiffness: 100 }}
        className="w-full px-6 py-14 flex flex-col items-center"
      >
        <h1 className="text-4xl font-semibold leading-tight text-center mb-6">
          Explore Our Menu
        </h1>
        <p className="text-lg text-gray-200 text-center max-w-2xl">
          Choose from a diverse menu featuring a delectable array of dishes. Our
          mission is to satisfy your cravings and elevate your dining
          experience.
        </p>
        <motion.button
          onClick={() => navigate("/menu")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className="bg-white text-black py-3 px-10 mt-6 rounded-xl shadow-lg transform transition-all hover:bg-gray-200 focus:outline-none"
        >
          View Full Menu
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full relative overflow-hidden mt-6"
      >
        <div className="flex overflow-x-scroll space-x-4 p-4 scrollbar-hide">
          {menu_list.map((item, index) => (
            <motion.div
              key={index}
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center cursor-pointer"
            >
              <img
                src={item.menu_image}
                className={`w-24 h-24 rounded-full border-4 ${
                  category === item.menu_name
                    ? "border-black"
                    : "border-transparent"
                }`}
                alt=""
              />
              <p className="text-sm text-gray-300 mt-2">{item.menu_name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExploreMenu;
