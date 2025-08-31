import React, { useState } from "react";

const groupedSubcategories = {
  "Beauty & Personal Care": [
    "Skin Care",
    "Hair Care",
    "Makeup",
    "Fragrances",
    "Bath & Body",
    "Men's Grooming",
  ],
  Fashion: [
    "Men's Clothing",
    "Women's Clothing",
    "Footwear",
    "Accessories",
    "Bags & Wallets",
  ],
  Electronics: [
    "Mobile Phones",
    "Laptops & Accessories",
    "Audio Devices",
    "Smart Wearables",
    "Cameras",
  ],
  Appliances: [
    "Kitchen Appliances",
    "Home Appliances",
    "Personal Care Appliances",
    "Large Appliances",
  ],
  Grocery: [
    "Dairy & Eggs",
    "Beverages",
    "Snacks & Instant Food",
    "Staples",
    "Spices & Condiments",
  ],
  "Sports, Books & More": ["Sports Equipment", "Fitness & Gym", "Books"],
  "Home & Furniture": [
    "Furniture",
    "Home Decor",
    "Kitchen & Dining",
    "Lighting",
  ],
};

const SubCategoryFilter = ({ subCategory, setSubCategory }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (catName) => {
    setActiveCategory((prev) => (prev === catName ? null : catName));
  };

  return (
    <div className="subcategory-filter">
      <h2>Browse by Category</h2>
      <div className="category-grid">
        {Object.entries(groupedSubcategories).map(
          ([category, subcategories]) => (
            <div key={category} className="category-box">
              <div
                className="category-header"
                onClick={() => handleCategoryClick(category)}
              >
                <p>{category}</p>
              </div>

              {activeCategory === category && (
                <div className="subcategory-list">
                  {subcategories.map((sub, idx) => (
                    <div
                      key={idx}
                      className={`subcategory-item ${
                        subCategory === sub ? "active" : ""
                      }`}
                      onClick={() => setSubCategory(sub)}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>

      <style>{`
        .subcategory-filter {
          padding: 1rem 0;
          font-family: 'Poppins', sans-serif;
        }

        .subcategory-filter h2 {
          font-size: 1.8rem;
          color: #c30202;
          margin-bottom: 1rem;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
        }

        .category-box {
          border: 1px solid #e1e1e1;
          border-radius: 10px;
          padding: 0.8rem 1rem;
          background: #fff;
          box-shadow: 0 0 8px rgba(0,0,0,0.05);
          transition: 0.3s;
        }

        .category-header {
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;
          cursor: pointer;
          padding-bottom: 0.5rem;
          border-bottom: 1px dashed #ccc;
        }

        .subcategory-list {
          margin-top: 0.6rem;
        }

        .subcategory-item {
          padding: 6px 0;
          font-size: 0.95rem;
          color: #555;
          cursor: pointer;
          transition: color 0.2s;
        }

        .subcategory-item:hover {
          color: #111;
        }

        .subcategory-item.active {
          font-weight: bold;
          color: #c30202;
        }

        @media (max-width: 600px) {
          .subcategory-filter h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SubCategoryFilter;
