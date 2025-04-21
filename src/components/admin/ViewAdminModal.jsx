import React from "react";

const ViewAdminModal = ({ admin, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">View Admin</h2>
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {admin.username}
          </div>
          <div>
            <strong>Email:</strong> {admin.email}
          </div>
          <div>
            <strong>Status:</strong> {admin.isActive ? "Active" : "Blocked"}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-500 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAdminModal;
