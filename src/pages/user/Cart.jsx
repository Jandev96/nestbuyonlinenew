import React, { useEffect, useState } from "react";
import { useCartStore } from "../../zustand/cartStore.js";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../../config/axiosInstance.js";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const {
    items = [],
    totalAmount,
    fetchCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCartStore();

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const makePayment = async () => {
    const { street, city, state, zipCode, country } = shippingAddress;
    if (!street || !city || !state || !zipCode || !country) {
      alert("Please fill in all shipping address fields.");
      return;
    }

    try {
      // Store address in localStorage for order creation after payment
      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));

      const stripeKey = import.meta.env.VITE_STRIPE_Publishable_key;
      const stripe = await loadStripe(stripeKey);
      if (!stripe) throw new Error("Stripe failed to load");

      const session = await axiosInstance.post("/payment/create-checkout-session", {
        products: items,
      });

      const result = await stripe.redirectToCheckout({
        sessionId: session.data.sessionId,
      });

      if (result.error) {
        console.error("Stripe redirect error:", result.error.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const originalTotal = items.reduce(
    (sum, item) => sum + (item?.productId?.originalPrice || item?.price) * item?.quantity,
    0
  );
  const savingsTotal = originalTotal - totalAmount;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Your Shopping Cart</h2>

      {items.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cart Items */}
          <div className="w-full md:w-3/4 bg-white shadow-lg rounded-lg p-6">
            {items.map((item) => (
              <div
                key={item?.productId?._id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b py-4"
              >
                {item?.productId?.images ? (
                  <img
                    src={item.productId.images}
                    alt={item.productId.name}
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">❌ No Image</div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-medium">{item.productId.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} x {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">Standard Delivery by tomorrow | ₹49</p>

                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <button className="btn btn-outline btn-sm w-full sm:w-auto">Move to Wishlist</button>
                    <button
                      className="btn btn-outline btn-sm w-full sm:w-auto text-red-500 border-red-500"
                      onClick={() => removeItem(item?.productId?._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col sm:items-end w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="text-lg font-semibold text-right sm:text-left">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                  {item?.productId?.originalPrice && (
                    <div className="text-sm text-gray-500 text-right sm:text-left">
                      <p className="line-through">
                        ₹{(item.productId.originalPrice * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-green-500">
                        Save ₹{((item.productId.originalPrice - item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2 sm:justify-end">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => decreaseQuantity(item.productId._id)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-lg">{item.quantity}</span>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => increaseQuantity(item.productId._id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full md:w-1/4 bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary ({items.length} items)</h3>

            <div className="flex justify-between mb-2">
              <p>Original Price</p>
              <p>₹{originalTotal.toLocaleString()}</p>
            </div>
            <div className="flex justify-between text-green-500 mb-2">
              <p>Savings</p>
              <p>-₹{savingsTotal.toLocaleString()}</p>
            </div>
            <hr className="mb-2" />
            <div className="flex justify-between font-semibold text-lg mb-4">
              <p>Total</p>
              <p>₹{totalAmount.toLocaleString()}</p>
            </div>

            {/* Shipping Address Inputs */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              {["street", "city", "state", "zipCode", "country"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  className="p-2 border border-gray-300 rounded"
                  value={shippingAddress[field]}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, [field]: e.target.value })
                  }
                />
              ))}
            </div>

            <button
              onClick={makePayment}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
