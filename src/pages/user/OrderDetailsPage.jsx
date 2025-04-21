import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrderStore } from "../../zustand/orderStore";

const OrderDetails = () => {
  const { id } = useParams();
  const { order, loading, error, getOrderById } = useOrderStore();

  useEffect(() => {
    if (id) {
      console.log("Getting order by ID:", id);
      getOrderById(id);
    }
  }, [id, getOrderById]);

  if (loading) return <div className="text-center mt-10 text-lg">Loading order details...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!order) return <div className="text-center mt-10">No order found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Order Details</h2>

      <div className="bg-white shadow-md rounded-lg p-4">
        <p className="text-lg font-semibold">Order ID:</p>
        <p className="mb-1 text-gray-700">{id}</p>

        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Items:</h3>

        {order.products?.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border-b py-3 text-gray-800"
          >
            <div className="flex items-center gap-4">
              {item.productId?.images?.[0] && (
                <img
                  src={item.productId.images[0]}
                  alt={item.productId.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
              <div>
                <p className="font-medium">{item.productId?.name || "Unnamed Product"}</p>
                <p className="text-sm text-gray-500">₹{item.productId?.price}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">Qty: {item.quantity}</p>
              <p className="text-sm text-gray-600">Subtotal: ₹{item.productId?.price * item.quantity}</p>
            </div>
          </div>
        ))}

        <div className="mt-6 border-t pt-4 text-right">
          <p><strong>Tax:</strong> ₹{order.tax}</p>
          <p><strong>Discount:</strong> ₹{order.discount}</p>
          <p className="text-xl font-semibold">Total: ₹{order.totalPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
