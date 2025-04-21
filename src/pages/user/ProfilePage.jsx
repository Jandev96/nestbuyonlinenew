import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    address: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
    profilePic: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/user/profile");
        setUser(response.data.data);
        setForm((prev) => ({
          ...prev,
          username: response.data.data.username || "",
          email: response.data.data.email || "",
          address: response.data.data.address || "",
        }));
      } catch (err) {
        setError("Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/user/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("address", form.address);
      formData.append("password", form.newPassword || form.password);

      if (form.profilePic) {
        formData.append("profilePic", form.profilePic);
      }

      const response = await axiosInstance.put("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(response.data.message);
      setUser(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;
  if (error && !user) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-15">
      <div className="drawer lg:drawer-open">
        <input id="profile-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col gap-6 lg:flex-row">
          <label htmlFor="profile-drawer" className="btn btn-primary drawer-button lg:hidden mb-4">
            Open Menu
          </label>

          <form onSubmit={handleSubmit} className="w-full bg-white rounded-md shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-red-500">Edit Your Profile</h2>
              <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                Welcome! <span className="text-red-500">{user.username}</span>
              </p>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full input input-bordered"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full input input-bordered"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full input input-bordered"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, profilePic: e.target.files[0] })}
                  className="file-input file-input-bordered w-full"
                />
                {user?.profilePic && (
                  <img
                    src={user.profilePic}
                    alt="Current Profile"
                    className="w-20 h-20 object-cover rounded-full mt-2 border"
                  />
                )}
              </div>

              <div className="sm:col-span-2 text-sm text-gray-700 mt-2">Password</div>
              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Current Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full input input-bordered"
                  required
                />
              </div>
              <div>
                <input
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full input input-bordered"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  name="confirmNewPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  className="w-full input input-bordered"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <button type="button" onClick={handleLogout} className="btn btn-outline btn-error w-full sm:w-auto">
                Logout
              </button>
              <button type="submit" className="btn btn-error text-white w-full sm:w-auto">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="drawer-side">
          <label htmlFor="profile-drawer" className="drawer-overlay"></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <h3 className="font-semibold text-lg mb-4">Manage My Account</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="text-red-500 font-medium">My Profile</li>
              <li className="hover:text-red-500 cursor-pointer">Address Book</li>
              <li className="hover:text-red-500 cursor-pointer">My Payment Options</li>
            </ul>

            <h3 className="font-semibold text-lg mt-6 mb-4">My Orders</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="hover:text-red-500 cursor-pointer">My Returns</li>
              <li className="hover:text-red-500 cursor-pointer">My Cancellations</li>
            </ul>

            <h3 className="font-semibold text-lg mt-6 mb-4">My Wishlist</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
