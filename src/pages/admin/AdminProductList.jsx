import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProductStore from "../../zustand/productStore";

const AdminProductList = () => {
  const { products, fetchProducts, deleteProduct, isLoading, error, success } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 mt-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Products</h2>
        <button
          onClick={() => navigate("/admin/add-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      {isLoading && <p className="text-gray-700">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Image</th>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Price</th>
              <th className="p-3 border text-left">Stock</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr
                key={prod._id}
                className="hover:bg-gray-50 transition text-sm text-gray-700"
              >
                <td className="p-3 border">
                  <img
                    src={prod.images}
                    alt={prod.name}
                    className="h-12 w-12 object-cover rounded mx-auto"
                  />
                </td>
                <td className="p-3 border">{prod.name}</td>
                <td className="p-3 border font-medium text-green-700">₹{prod.price}</td>
                <td className="p-3 border">{prod.stock}</td>
                <td className="p-3 border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/edit-product/${prod._id}`)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(prod._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Image</th>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Price</th>
              <th className="p-3 border text-left">Stock</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm">
        <p className="text-gray-600">Showing {products.length > 0 ? `1 to ${products.length}` : "0"} of {products.length} entries</p>
        <div className="flex gap-2 items-center">
          <button className="bg-gray-200 px-3 py-1 rounded text-gray-600">Previous</button>
          <span className="px-3 py-1 rounded bg-blue-600 text-white">1</span>
          <button className="bg-gray-200 px-3 py-1 rounded text-gray-600">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductList;
