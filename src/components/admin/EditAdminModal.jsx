import useAdminStore from "../../zustand/useAdminStore";
import React, { useState } from "react";

 const EditAdminModal = ({ admin, onClose }) => {
  const { updateAdmin, isLoading } = useAdminStore();

  const [formData, setFormData] = useState({
    username: admin.username,
    email: admin.email,
    address: admin.address || "",
    role: admin.role || "admin",
    isActive: admin.isActive,
    profilePic: admin.profilePic || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateAdmin(admin._id, formData);
    onClose(); // Close modal on success
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" value={formData.username} onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="profilePic" value={formData.profilePic} onChange={handleChange} className="w-full border p-2 rounded" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
            Active
          </label>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded">
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal