import React, { useEffect } from "react";
import { useCartStore } from "../../zustand/cartStore";
import useWishlistStore from "../../zustand/useWishlistStore";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, fetchWishlist, removeFromWishlist, loading, error } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchWishlist(); 

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchWishlist();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchWishlist]);

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product) => {
    addToCart(product._id, 1);
  };

  if (loading) return <p className="p-4">Loading wishlist...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen px-4 py-10 bg-white text-gray-800">
      <h1 className="text-xl font-semibold mb-6 flex items-center gap-2">
        My Wishlist <span className="text-gray-400 text-sm">❤️</span>
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-t text-left">
            <thead className="text-sm border-b">
              <tr className="text-gray-500">
                <th className="py-2"></th>
                <th className="py-2">Product Name</th>
                <th className="py-2">Unit Price</th>
                <th className="py-2">Stock Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => {
                const product = item.productId;

                // 🛑 Skip if productId is missing or null
                if (!product) return null;

                return (
                  <tr key={item._id} className="border-b">
                    <td className="py-4 px-2">
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="text-xl text-black hover:text-red-500"
                      >
                        ×
                      </button>
                    </td>
                    <td className="py-4 px-2 flex items-center gap-4">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/60x80?text=No+Image"}
                        alt={product.name}
                        className="w-[60px] h-[80px] object-cover border rounded"
                      />
                      <span>{product.name}</span>
                    </td>
                    <td className="py-4 px-2">
                      {product.originalPrice ? (
                        <div>
                          <span className="line-through text-gray-400 mr-2">₹{product.originalPrice}</span>
                          <span className="text-blue-600 font-semibold">₹{product.price}</span>
                        </div>
                      ) : (
                        <span className="text-gray-700 font-medium">₹{product.price}</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-green-600">
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </td>
                    <td className="py-4 px-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-black text-white text-sm px-4 py-2 uppercase tracking-wide hover:bg-gray-800"
                      >
                        Add to cart
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
