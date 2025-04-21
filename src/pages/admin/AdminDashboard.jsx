import React, { useEffect } from "react";
import useProductStore from "../../zustand/productStore";
import { useOrderStore } from "../../zustand/orderStore";
import { useUserStore } from "../../zustand/userStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchAllOrders } = useOrderStore();
  const { users, fetchRecentUsers } = useUserStore();

  useEffect(() => {
    fetchProducts();
    fetchAllOrders();
    fetchRecentUsers();
  }, []);

  const getCategoryData = () => {
    const categoryMap = {};
    products.forEach((p) => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getMonthlySalesData = () => {
    const monthlyMap = {};
    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + order.totalPrice;
    });
    return Object.entries(monthlyMap).map(([month, total]) => ({
      month,
      total,
    }));
  };

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a29bfe"];

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const topProducts = products
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      price: `₹${p.price}`,
      sold: p.sold || Math.floor(Math.random() * 100),
      status: p.stock > 0 ? "In Stock" : "Out of Stock",
      img: p.images?.[0] || "https://via.placeholder.com/40",
    }));

  const revenueData = orders.map((order) => ({
    date: new Date(order.orderDate).toLocaleDateString(),
    total: order.totalPrice,
  }));

  return (
    <div className="mt-20 flex min-h-screen bg-[#f8f7f4]">
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Orders" value={orders.length} note="Orders placed" color="blue" />
          <StatCard title="Products Available" value={products.length} note="In inventory" color="green" />
          <StatCard
            title="Total Revenue"
            value={`₹${orders.reduce((acc, o) => acc + o.totalPrice, 0).toFixed(2)}`}
            note="From all sales"
            color="orange"
          />
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No revenue data to display.</p>
          )}
        </div>

        {/* Monthly Sales Line Chart */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getMonthlySalesData()}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="total" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
          {products.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {getCategoryData().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">Not enough data to show categories.</p>
          )}
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-white p-4 rounded shadow-sm border border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-3">
              Low Stock Alerts 🚨
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              {lowStockProducts.map((p) => (
                <li key={p._id}>
                  {p.name} — <span className="text-red-500">Stock: {p.stock}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Users */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent User Signups</h2>
          {users.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {users.slice(0, 5).map((user) => (
                <li key={user._id} className="flex justify-between border-b pb-1">
                  <span>{user.username}</span>
                  <span className="text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent users found.</p>
          )}
        </div>

        {/* Top Products Table */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <table className="min-w-full text-sm">
            <thead className="text-left border-b text-gray-600">
              <tr>
                <th className="py-2">Product Name</th>
                <th>Price</th>
                <th>Sold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, idx) => (
                <tr key={idx} className="border-b last:border-none">
                  <td className="py-3 flex items-center gap-3">
                    <img src={product.img} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <span>{product.name}</span>
                  </td>
                  <td>{product.price}</td>
                  <td>{product.sold}</td>
                  <td>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      product.status === "In Stock"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, note, color }) {
  const colorMap = {
    blue: "text-blue-500",
    green: "text-green-500",
    orange: "text-orange-500",
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <h2 className="font-medium text-sm text-gray-600">{title}</h2>
      <div className={`text-xl font-bold ${colorMap[color]}`}>{value}</div>
      <p className="text-sm text-gray-400">{note}</p>
    </div>
  );
}
