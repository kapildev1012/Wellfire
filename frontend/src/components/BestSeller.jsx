import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 10)); // show top 10 bestsellers
  }, [products]);

  return (
    <div className="my-10 px-4">
      {/* Title and Subtitle */}
      <div className="text-center py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-full sm:w-3/4 md:w-1/2 m-auto text-sm sm:text-base text-gray-600 mt-2">
          Discover the most loved and trending products by our customers.
          Handpicked top sellers just for you!
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.length > 0 ? (
          bestSeller.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              rating={item.rating} // optional if your model supports it
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No bestsellers available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default BestSeller;
