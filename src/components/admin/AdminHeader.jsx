import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAdminStore from "../../zustand/useAdminStore";
import DarkMode from "../../pages/shared/DarkMode";

function AdminHeader() {
  const { admin, logout } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="navbar fixed top-0 left-0 z-50 w-full px-6 py-3 bg-opacity-80 backdrop-blur-lg shadow-lg 
                    border-b border-gray-700 bg-gray-900/80 text-white transition-all">
      {/* Left Side (Admin Panel Title) */}
      <div className="flex-1">
        <Link to="/admin/dashboard" className="text-2xl font-bold tracking-wide neon-text">
          Admin Panel
        </Link>
      </div>

      {/* Dark Mode Toggle */}
      <DarkMode />

      {/* Admin Controls */}
      <div className="flex-none">
        {admin ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:scale-105 transition">
              <div className="w-10 rounded-full border-2 border-red-500 shadow-lg">
                <img alt="Admin" src={admin.profilePic || "https://via.placeholder.com/40"} />
              </div>
            </div>

            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 w-52 p-2 rounded-lg bg-gray-900/90 
                                        text-white shadow-lg border border-gray-700">
              <li><Link to="/admin/dashboard">Dashboard</Link></li>
              <li><Link to="/admin/manage-users">Manage Users</Link></li>
              <li><button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/admin/login" className="btn btn-outline btn-sm neon-border">
            Admin Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default AdminHeader;
