import React, { useState } from "react";
import AdminHeader from "../components/admin/AdminHeader"; // Create this file
import Footer from "../components/user/Footer";
import { Outlet } from "react-router-dom";
import Header from "../components/user/Header"; 
import Sidebar from "../components/admin/Sidebar";
// Default user header
function AdminLayout() {
  const [isAdminAuth, setIsAdminAuth] = useState(true);

  return (
    <div className="flex min-h-screen">
  <Sidebar />
  <div className="flex flex-col flex-1 ml-64">
    {isAdminAuth ? <AdminHeader /> : <Header />}
    <main className="flex-1 p-4 bg-gray-100">
      <Outlet />
    </main>
    <Footer />
  </div>
</div>
  );
}

export default AdminLayout