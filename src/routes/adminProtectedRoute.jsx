import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { axiosInstance } from "../config/axiosInstance";

function AdminProtectedRoute() {
  const [isAdminAuth, setIsAdminAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        await axiosInstance.get("/admin/checkadmin"); // Using your admin check endpoint
        setIsAdminAuth(true);
      } catch (error) {
        setIsAdminAuth(false);
        navigate("/admin/login");
      }
    };

    checkAdminAuth();
  }, [navigate]);

  if (isAdminAuth === null) {
    return <div className="text-center mt-10">Verifying admin privileges...</div>;
  }

  return isAdminAuth ? <Outlet /> : null;
}

export default AdminProtectedRoute;