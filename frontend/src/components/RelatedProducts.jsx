import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!category || !subCategory || !currentProductId || products.length === 0)
      return;

    let filtered = products
      .filter((item) => {
        const matchCategory =
          item.category?.toLowerCase().trim() ===
          category?.toLowerCase().trim();
        const matchSubCategory =
          item.subCategory?.toLowerCase().trim() ===
          subCategory?.toLowerCase().trim();
        const notSameProduct = item._id !== currentProductId;

        return matchCategory && matchSubCategory && notSameProduct;
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0)); // optional: sort by rating

    // Fallback to same category if subcategory has too few matches
    if (filtered.length < 3) {
      filtered = products
        .filter((item) => {
          const matchCategory =
            item.category?.toLowerCase().trim() ===
            category?.toLowerCase().trim();
          const notSameProduct = item._id !== currentProductId;
          return matchCategory && notSameProduct;
        })
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setRelated(filtered.slice(0, 5)); // Limit to 5 items
  }, [products, category, subCategory, currentProductId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      {related.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {related.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
              rating={item.rating}
              subCategory={item.subCategory}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No related products found.
        </p>
      )}
    </div>
  );
};

export default RelatedProducts;
