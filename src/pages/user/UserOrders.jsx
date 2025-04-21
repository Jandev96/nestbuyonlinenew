import React, { useEffect } from "react";
import { useOrderStore } from "../../zustand/orderStore";
import { format } from "date-fns";

const UserOrders = () => {
  const { orders, loading, error, fetchUserOrders } = useOrderStore();

  useEffect(() => {
    fetchUserOrders();
  }, []);
  console.log(orders)

  if (loading) return <div className="p-4">Loading your orders...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-sm p-4 space-y-3"
            >
              <div className="flex justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium text-sm text-gray-500">
                    Order placed:{" "}
                    <span className="text-black">
                      {format(new Date(order.orderDate), "PPP")}
                    </span>
                  </p>
                  <p className="font-medium text-sm text-gray-500">
                    Status:{" "}
                    <span className="text-black capitalize">
                      {order.status}
                    </span>
                  </p>
                  <p className="font-medium text-sm text-gray-500">
                    Estimated Delivery:{" "}
                    <span className="text-black">
                      {format(new Date(order.estimatedDelivery), "PPP")}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    Total: ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                {order.products.map(({ productId, quantity }) => (
                  <div
                    key={productId._id}
                    className="flex items-center gap-3 border rounded p-3"
                  >
                    <img
                      src={productId.images}
                      alt={productId.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{productId.name}</p>
                      <p className="text-sm text-gray-600">
                        ${productId.price} × {quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
