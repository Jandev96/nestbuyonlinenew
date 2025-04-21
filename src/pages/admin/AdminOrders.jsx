import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../zustand/orderStore";

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-green-500";
    case "Pending": return "bg-yellow-500";
    case "Cancelled": return "bg-red-500";
    case "Processing": return "bg-blue-400";
    case "Shipped": return "bg-purple-500";
    default: return "bg-gray-400";
  }
};

const AdminOrders = () => {
  const {
    fetchAllOrders,
    updateOrderStatus,
    orders,
    loading,
    error,
  } = useOrderStore();

  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateClick = (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;
    updateOrderStatus(orderId, newStatus);
  };

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  console.log(orders,"===orders admin")

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Admin Orders</h2>


      {orders.map((order) => (
        <div key={order._id} className="bg-white shadow-md rounded-lg p-4 flex items-start gap-4">
          <img
            src={order.products[0]?.productId?.images}
            alt="Product"
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-bold">{order.products[0]?.productId?.name}</h3>
            <p className="text-sm text-gray-600">Availability: <span className="text-green-600">In stock</span></p>
            <p className="text-sm text-gray-600">User: <span className="font-semibold capitalize">{order.customerId.username || 'N/A'}</span></p>
            <p className="text-sm text-gray-600">
              MRP: <span >₹{order.products[0]?.productId?.price?.toLocaleString()}</span>{" "}
              <span className="text-red-500">{order.products[0]?.productId?.discountPrice?.toLocaleString()}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded-full ${getStatusColor(order.status)}`}></span>
            <p className="text-sm">{order.status}</p>
          </div>

          <button
            onClick={() => handleUpdateClick(order._id)}
            className="ml-auto bg-black text-white px-4 py-1 text-sm rounded hover:bg-gray-800"
          >
            Status
          </button>

          <select
            className="ml-2 border px-2 py-1 text-sm rounded"
            value={statusUpdates[order._id] || order.status}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
