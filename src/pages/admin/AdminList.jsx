import React, { useEffect, useState } from "react";
import { Pencil, Eye, Trash2, Search, FileDown, Plus, X } from "lucide-react";
import useAdminStore from "../../zustand/useAdminStore";
import EditAdminModal from "../../components/admin/EditAdminModal";
import ViewAdminModal from "../../components/admin/ViewAdminModal";

const AdminList = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });

  const {
    admins,
    totalAdmins,
    fetchAllAdmins,
    deleteAdmin,
    signupAdmin,
    adminFetchLoading,
    isLoading,
    error,
  } = useAdminStore();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchAllAdmins(page, debouncedSearch, sort);
  }, [page, debouncedSearch, sort]);

  const handleDelete = (adminId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if (confirmDelete) deleteAdmin(adminId);
  };

  const handleAddAdmin = async () => {
    await signupAdmin(newAdmin);
    setAddModalOpen(false);
    setNewAdmin({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      phone: "",
    });
  };

  const totalPages = Math.ceil(totalAdmins / 8);
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 4;
    for (let i = 1; i <= Math.min(totalPages, maxPagesToShow); i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 border rounded-md ${i === page ? "bg-red-500 text-white" : ""}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditModalOpen(true);
  };

  const openViewModal = (admin) => {
    setSelectedAdmin(admin);
    setViewModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-10">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">All Admins</h2>
          <p className="text-green-600 font-medium mt-1">Active Members</p>
        </div>
        <div className="flex gap-3 items-center">
          <button className="flex items-center gap-2 text-sm text-pink-600 border border-pink-600 px-3 py-2 rounded-md hover:bg-pink-50">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 text-white bg-red-500 hover:bg-red-600 text-sm px-4 py-2 rounded-md"
          >
            <Plus className="w-4 h-4" />
            Add New Admin
          </button>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-2 border rounded-md w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-md px-4 py-2 text-sm"
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-300 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* Admin Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Phone Number</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {adminFetchLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">Loading...</td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">No admins found</td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{admin.username}</td>
                  <td className="p-3 font-semibold">{admin.phone || "(000) 000-0000"}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        admin.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {admin.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <Eye className="w-4 h-4 text-blue-500 cursor-pointer" onClick={() => openViewModal(admin)} />
                      <Pencil className="w-4 h-4 text-gray-500 cursor-pointer" onClick={() => openEditModal(admin)} />
                      <Trash2
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(admin._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          Showing {admins.length > 0 ? (page - 1) * 8 + 1 : 0} to{" "}
          {(page - 1) * 8 + admins.length} of {totalAdmins} entries
        </p>
        <div className="flex gap-1">
          <button
            className="px-3 py-1 border rounded-md"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {renderPageNumbers()}
          {totalPages > 4 && <span className="px-3 py-1 border rounded-md">...</span>}
          <button
            className="px-3 py-1 border rounded-md"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>

      {/* Edit / View Modals */}
      {isEditModalOpen && (
        <EditAdminModal admin={selectedAdmin} onClose={() => setEditModalOpen(false)} />
      )}
      {isViewModalOpen && (
        <ViewAdminModal admin={selectedAdmin} onClose={() => setViewModalOpen(false)} />
      )}

      {/* Add Admin Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button className="absolute top-3 right-3" onClick={() => setAddModalOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newAdmin.phone}
                onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Address"
                value={newAdmin.address}
                onChange={(e) => setNewAdmin({ ...newAdmin, address: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={newAdmin.confirmPassword}
                onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
              <button
                onClick={handleAddAdmin}
                disabled={isLoading}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                {isLoading ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
