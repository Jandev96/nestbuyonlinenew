import React, { useState } from "react";
import useProductStore from "../../zustand/productStore";
import { useNavigate } from "react-router-dom";

// Define the allowed categories
const allowedCategories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty & Health",
  "Sports",
  "Automotive",
  "Books",
  "Toys",
  "Grocery",
  "Furniture",
];

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, isLoading, error, success } = useProductStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(form);
    if (!error) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-3xl"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Add New Product</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />

          {/* Dropdown for category */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="" disabled>
              Select Category
            </option>
            {allowedCategories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="textarea textarea-bordered w-full mt-4"
        />

        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="file-input w-full"
          />
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Add Product"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
