import React, { useState } from "react";
import { useProductStore } from "../../zustand/productStore";
import { Slider } from "@mui/material";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Links } from "react-router-dom";


const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty & Health",
  "Sports",
  "Automotive",
  "Books",
  "Toys",
  "Grocery",
  "Furniture",
];

const CategoryFilter = () => {
  const { setFilters } = useProductStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [inStock, setInStock] = useState(false);

  // Apply Filters
  const applyFilters = () => {
    setFilters({
      search,
      category: selectedCategory,
      priceRange,
      inStock,
    });
  };

  return (
    <div className="w-full lg:w-72 bg-gray-900 text-white p-5 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">🔍 Filter Products</h2>

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-lg bg-gray-800 text-white"
        />
        <FaSearch className="absolute right-3 top-3 text-gray-400" />
      </div>

      {/* Categories */}
      <h3 className="text-lg font-semibold mb-2">📁 Categories</h3>
      <select
        className="w-full p-2 bg-gray-800 rounded-lg"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Price Range Slider */}
      <h3 className="text-lg font-semibold mt-4 mb-2">💰 Price Range</h3>
      <Slider
        value={priceRange}
        onChange={(e, newValue) => setPriceRange(newValue)}
        min={0}
        max={1000}
        valueLabelDisplay="auto"
      />

      {/* In Stock Toggle */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          checked={inStock}
          onChange={() => setInStock(!inStock)}
          className="mr-2"
        />
        <span>Only Show In Stock</span>
      </div>

      {/* Apply Filters Button */}
      <Links
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 w-full rounded-lg"
        onClick={applyFilters}
      >
        Apply Filters
      </Links>
    </div>
  );
};

export default CategoryFilter;
