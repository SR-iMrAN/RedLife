import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FaUsers,
  FaBlog,
  FaHandHoldingHeart,
  FaDonate,
  FaHome,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // toggle this based on screen size or button

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "tween", duration: 0.4 }}
          className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white p-4 z-50 hidden md:block"
        >
          <h2 className="text-2xl font-bold text-center mt-4">Dashboard</h2>
          <nav className="space-y-2 mt-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "block bg-red-600 px-4 py-2 rounded font-medium"
                  : "block hover:bg-gray-700 px-4 py-2 rounded"
              }
            >
              <FaHome className="inline mr-2" />
              Dashboard Home
            </NavLink>

            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                isActive
                  ? "block bg-red-600 px-4 py-2 rounded font-medium"
                  : "block hover:bg-gray-700 px-4 py-2 rounded"
              }
            >
              <FaUsers className="inline mr-2" />
              Manage Users
            </NavLink>

            <NavLink
              to="/dashboard/donation-requests"
              className={({ isActive }) =>
                isActive
                  ? "block bg-red-600 px-4 py-2 rounded font-medium"
                  : "block hover:bg-gray-700 px-4 py-2 rounded"
              }
            >
              <FaHandHoldingHeart className="inline mr-2" />
              Donation Requests
            </NavLink>

            <NavLink
              to="/dashboard/blogs"
              className={({ isActive }) =>
                isActive
                  ? "block bg-red-600 px-4 py-2 rounded font-medium"
                  : "block hover:bg-gray-700 px-4 py-2 rounded"
              }
            >
              <FaBlog className="inline mr-2" />
              Manage Blogs
            </NavLink>

            <NavLink
              to="/dashboard/fundings"
              className={({ isActive }) =>
                isActive
                  ? "block bg-red-600 px-4 py-2 rounded font-medium"
                  : "block hover:bg-gray-700 px-4 py-2 rounded"
              }
            >
              <FaDonate className="inline mr-2" />
              Manage Fundings
            </NavLink>

            <Link
              to="/"
              className="block bg-blue-600 hover:bg-blue-700 mt-6 px-4 py-2 rounded text-center"
            >
              Back to Home
            </Link>
          </nav>
        </motion.aside>
      )}

      {/* Main Dashboard Content */}
      <div className="flex flex-1 md:ml-64">
        <main className="flex-1 p-4 bg-gray-50 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
