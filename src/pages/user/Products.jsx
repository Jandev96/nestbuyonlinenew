import React from "react";
import FilteredProducts from "../../components/user/FilteredProducts";

const Products = () => {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Explore Our Products
      </h1>
      <FilteredProducts />
    </div>
  );
};

export default Products;