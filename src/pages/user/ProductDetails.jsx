import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from "../../zustand/cartStore";
import useFetch from "../../hooks/useFetch";
import useReviewStore from "../../zustand/useReviewStore";
import useWishlistStore from "../../zustand/useWishlistStore";
import { Pencil, Trash2 } from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const addToCart = useCartStore((state) => state.addToCart);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const {
    fetchReviews,
    addReview,
    updateReview,
    deleteReview,
    reviews,
    loading,
    error: reviewError,
    successMessage,
    clearMessages,
  } = useReviewStore();

  const [productdetails, isLoading, error] = useFetch(`/product/products/${id}`);
  const product = productdetails?.displaySingleProduct;

  const [selectedImage, setSelectedImage] = useState("");
  const [pincode, setPincode] = useState("560002");
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(5);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  useEffect(() => {
    if (id) {
      fetchReviews(id);
      clearMessages?.();
    }
    return () => {
      clearMessages?.();
    };
  }, [id]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    await addReview({ productId: id, rating, comment });
    setComment("");
    setRating(5);
  };

  const startEditing = (review) => {
    setEditingReviewId(review._id);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    await updateReview({
      reviewId: editingReviewId,
      productId: id,
      rating: editedRating,
      comment: editedComment,
    });
    setEditingReviewId(null);
    setEditedComment("");
    setEditedRating(5);
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteReview({ reviewId, productId: id });
  };

  const handleAddToCartAndRedirect = () => {
    addToCart(product._id, quantity);
    navigate("/cart");
  };

  const averageRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  if (isLoading) return <h2 className="text-center mt-10">Loading...</h2>;
  if (error) return <h2 className="text-center mt-10 text-red-500">Error: {error.message}</h2>;
  if (!product) return <h2 className="text-center mt-10">Product not found</h2>;

  return (
    <div className="max-w-7xl mt-16 mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image Section */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded-lg border"
          />
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumbnail"
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 object-contain rounded-lg border cursor-pointer ${
                  selectedImage === img ? "ring-2 ring-blue-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
            <span className="text-yellow-500 text-lg">⭐ {averageRating}</span>
            <span className="text-gray-400">|</span>
            <span>{reviews?.length || 0} Reviews</span>
            <span className="text-green-600 font-medium">In Stock</span>
          </div>

          <div className="mt-4 text-2xl font-semibold text-gray-900">
            ₹{product.price}
            {product.originalPrice && (
              <span className="text-base line-through text-gray-500 ml-3">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Quantity Control */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-md font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-2 border rounded px-2 py-1">
              <button onClick={decreaseQuantity} className="px-2">-</button>
              <span className="w-6 text-center">{quantity}</span>
              <button onClick={increaseQuantity} className="px-2">+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button className="btn btn-primary" onClick={handleAddToCartAndRedirect}>
              Add to Cart
            </button>
            <button className="btn btn-outline" onClick={() => addToWishlist(product._id)}>
              Wishlist
            </button>
          </div>

          {/* Delivery Info */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-lg">Delivery & Services</h3>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="input input-bordered w-28"
              />
              <button className="text-blue-500 underline">Check</button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              🚚 Delivery by <span className="text-green-600">Tomorrow</span>
            </p>
            <p className="text-sm text-gray-600">🏬 Free Store Pickup Available</p>
            <p className="text-sm text-gray-600">✅ 2 Year Warranty</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t pt-10">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="mb-6">
          <div className="mb-4">
            <label className="block font-medium mb-1">Rating:</label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Comment:</label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </form>

        {loading && <p className="text-blue-500">Loading reviews...</p>}
        {reviewError && <p className="text-red-500">{reviewError}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        {/* Review List */}
        {reviews && reviews.length > 0 ? (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.userId?.username || "User"}</span>
                    <span className="text-yellow-500">{"⭐".repeat(review.rating)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pencil
                      className="w-5 h-5 text-blue-500 cursor-pointer"
                      onClick={() => startEditing(review)}
                    />
                    <Trash2
                      className="w-5 h-5 text-red-500 cursor-pointer"
                      onClick={() => handleDeleteReview(review._id)}
                    />
                  </div>
                </div>
                <p className="mb-2">{review.comment}</p>

                {editingReviewId === review._id && (
                  <div className="mt-4">
                    <textarea
                      className="textarea textarea-bordered w-full"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    ></textarea>
                    <select
                      className="select select-bordered mt-2 w-full"
                      value={editedRating}
                      onChange={(e) => setEditedRating(Number(e.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Star{r > 1 && "s"}
                        </option>
                      ))}
                    </select>
                    <div className="mt-4 flex gap-2">
                      <button onClick={handleUpdateReview} className="btn btn-primary">
                        Update Review
                      </button>
                      <button
                        onClick={() => setEditingReviewId(null)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
