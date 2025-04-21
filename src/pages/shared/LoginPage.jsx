import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAdminStore from "../../zustand/useAdminStore"; // ✅ Ensure correct import

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  // Zustand Store for Admin
  const loginAdmin = useAdminStore((state) => state.login); // ✅ Fix: Using `login` instead of `loginAdmin`
  const isLoading = useAdminStore((state) => state.isLoading);
  const adminError = useAdminStore((state) => state.error);
  const admin = useAdminStore((state) => state.admin);

  const onSubmit = async (data) => {
    if (isAdmin) {
      await loginAdmin(data.email, data.password);

      if (admin) {
        navigate("/admin/dashboard"); // ✅ Navigate after successful login
      }
    } else {
      dispatch(loginUser(data)).then((action) => {
        if (action.meta.requestStatus === "fulfilled") {
          navigate("/");
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-300 to-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-gray-700 border-opacity-50">
          {/* Mode Toggle */}
          <div className="flex relative h-14 bg-gray-900 bg-opacity-30">
            <motion.div
              animate={{
                x: isAdmin ? '100%' : '0%',
                width: '50%'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"
            />
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex-1 flex items-center justify-center relative z-10 font-medium transition-colors ${!isAdmin ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
            >
              User Login
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex-1 flex items-center justify-center relative z-10 font-medium transition-colors ${isAdmin ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Admin Login
            </button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isAdmin ? 'admin' : 'user'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  {isAdmin ? 'Admin Portal' : 'Welcome Back'}
                </h2>

                {(error || adminError) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-3 bg-red-500 bg-opacity-20 text-red-200 rounded-lg text-center"
                  >
                    {isAdmin ? adminError : error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email Field */}
                  <div className="mb-6">
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition-all"
                      placeholder="Enter your email"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-8">
                    <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition-all"
                      placeholder="Enter your password"
                      {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium text-white shadow-lg transition-all duration-300"
                    disabled={loading || isLoading}
                  >
                    {loading || isLoading ? 'Logging in...' : isAdmin ? 'Access Admin Dashboard' : 'Login'}
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
