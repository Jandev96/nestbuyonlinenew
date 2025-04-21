import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../zustand/cartStore";
import StyledAddToCartButton from "../shared/StyledAddToCartButton"; // custom button

function Cards({ product }) {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="relative h-[400px] w-full max-w-sm rounded-2xl overflow-hidden shadow-md group transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">

      {/* Image Section */}
      <div
        onClick={() => navigate(`/productDetails/${product._id}`)}
        className="cursor-pointer h-[60%] md:group-hover:h-[60%] transition-all duration-300 "
      >
        <img
          src={product.images}
          alt={product.name}
          className="h-full w-full object-contain p-4 transition-transform duration-300 md:group-hover:scale-105"
        />
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 w-full h-[37%] md:group-hover:h-[37%] bg-blue-950/85 text-white transition-all duration-500 ease-in-out flex flex-col justify-between px-5 py-3 overflow-hidden">

        {/* Title */}
        <div className="transition-all duration-300 md:group-hover:-translate-y-2">
          <h5 className="text-lg font-semibold line-clamp-2">{product.name}</h5>

          {/* Product Rating */}
          {product.rating !== undefined && product.rating !== null && !isNaN(product.rating) && (
            <div className="flex items-center mt-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-400"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.26 3.88h4.078c.969 0 1.371 1.24.588 1.81l-3.3 2.397 1.26 3.88c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.297 2.395c-.784.57-1.838-.197-1.539-1.118l1.26-3.88-3.3-2.397c-.783-.57-.38-1.81.588-1.81h4.078l1.26-3.88z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-yellow-400 ms-2">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between mt-4 transition-all duration-500 ease-in-out 
                        md:transform md:translate-y-full md:opacity-0 
                        md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <span className="text-xl font-bold">${product.price}</span>
          <StyledAddToCartButton
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product._id, 1);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Cards;
