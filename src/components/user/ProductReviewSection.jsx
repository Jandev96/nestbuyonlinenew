import { useState, useEffect } from "react";
import useReviewStore from "../../zustand/useReviewStore";

const ProductReviewSection = ({ productId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const {
    fetchReviews,
    addReview,
    reviews,
    loading,
    error,
    successMessage,
    clearMessages,
  } = useReviewStore();

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addReview({ productId, rating, comment });
    setComment("");
    setRating(5);
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

      <form onSubmit={handleSubmit} className="mb-6">
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
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <div className="mt-6 space-y-4">
        {reviews?.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{review.userId?.username || "User"}</span>
                <span className="text-yellow-500">{"⭐".repeat(review.rating)}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviewSection;
