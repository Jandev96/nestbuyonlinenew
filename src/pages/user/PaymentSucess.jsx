import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../zustand/cartStore";
import { useOrderStore } from "../../zustand/orderStore";

const PaymentSuccess = () => {
  // const { clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finalizeOrder = async () => {
      const storedAddress = localStorage.getItem("shippingAddress");
      if (!storedAddress) {
        console.error("No shipping address found.");
        setLoading(false);
        return;
      }

      try {
        const shippingAddress = JSON.parse(storedAddress);
        const order = await createOrder({ shippingAddress });

        if (order?._id) {
          // clearCart();
          localStorage.removeItem("shippingAddress");

          setTimeout(() => {
            navigate(`/orders/${order._id}`);
          }, 5000);
        } else {
          console.error("Order creation failed: No order ID returned.");
        }
      } catch (err) {
        console.error("Failed to create order:", err);
      } finally {
        setLoading(false);
      }
    };

    finalizeOrder();
  }, [createOrder,  navigate]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center animate-fade-in">
        <CheckCircle2 className="text-green-500 w-20 h-20 mx-auto animate-ping-once" />
        <h1 className="text-3xl font-bold text-green-600 mt-4">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          {loading
            ? "Finalizing your order..."
            : "Thank you for your purchase. Your order is being processed."}
        </p>
        {!loading && (
          <p className="text-gray-500 mt-2">
            Redirecting to order details in 5 seconds...
          </p>
        )}
        <Link
          to="/"
          className="inline-block mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
