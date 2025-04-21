import React, { useEffect, useState } from "react";
import useProductStore from "../../zustand/productStore";
import { useCartStore } from "../../zustand/cartStore";
import Cards from "./Cards";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function FilteredProducts() {
  const { products, fetchProducts, isLoading, error } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-gray-400"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-gray-400"></div>
          <div className="w-4 h-4 rounded-full animate-pulse  bg-gray-400"></div>
        </div>
      </div>
    );

  if (error)
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  if (products.length === 0)
    return <p className="text-center text-lg">No products available.</p>;

  const categories = [
    ...new Set(products.map((product) => product.category[0] || "Uncategorized")),
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  let filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory.length === 0 ||
      selectedCategory.includes(product.category[0]);
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (sortOrder === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.category[0] || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="product-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content w-full">
        <label
          htmlFor="product-drawer"
          className="btn btn-primary m-4 drawer-button lg:hidden"
        >
          Open Filters
        </label>

        <div className="container mx-auto p-6">
          {Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 border-b pb-2 inline-flex animate-background-shine bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:250%_100%] bg-clip-text  text-transparent">
                {category}
              </h2>
              <Slider {...sliderSettings}>
                {groupedProducts[category].map((product) => (
                  <div key={product._id} className="px-2">
                    <Cards product={product} />
                  </div>
                ))}
              </Slider>
            </div>
          ))}
        </div>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="product-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-blue-950/85 backdrop-blur-md border border-white/30 text-base-content shadow-[15px_0_30px_-10px_rgba(0,0,0,0.3)]">
          <h2 className="text-lg font-semibold mb-4 text-white">Search</h2>
          <input
            type="text"
            placeholder="Search products..."
            className="input input-bordered mb-4 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <h2 className="text-lg text-white font-semibold mb-2">Categories</h2>
          <div className="flex flex-col gap-2 mb-4 text-white">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 ">
                <input style={{color:"black", background:"white"}}
                  type="checkbox"
                  className="checkbox"
                  checked={selectedCategory.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-2">Sort by Price</h2>
          <select
            className="select select-bordered w-full"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="none">None</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilteredProducts;
