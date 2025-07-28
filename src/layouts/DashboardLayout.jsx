import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FaUsers,
  FaBlog,
  FaHandHoldingHeart,
  FaDonate,
  FaHome,
  FaPlusCircle,
  FaUserEdit,
  FaRegListAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { role } = useAuth();

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Navbar */}
      <Navbar />

      {/* Hamburger toggle for small screens */}
      <div className="md:hidden bg-gray-800 p-2">
        <button
          className="text-white text-2xl"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {(isSidebarOpen || window.innerWidth >= 768) && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white p-4 z-50"
        >
          {/* Close button on mobile */}
          <div className="md:hidden flex justify-end">
            <button
              className="text-white text-2xl"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center mt-4">Dashboard</h2>
          <nav className="space-y-2 mt-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "block bg-green-600 px-4 py-2 rounded font-medium"
                  : "block hover:bg-gray-700 px-4 py-2 rounded"
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaHome className="inline mr-2" />
              Dashboard Home
            </NavLink>

            {role === "admin" && (
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  isActive
                    ? "block bg-red-600 px-4 py-2 rounded font-medium"
                    : "block hover:bg-gray-700 px-4 py-2 rounded"
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaUsers className="inline mr-2" />
                Manage Users
              </NavLink>
            )}

            {role === "donor" && (
              <>
                <NavLink
                  to="/dashboard/create-donation-request"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-red-600 px-4 py-2 rounded font-medium"
                      : "block hover:bg-gray-700 px-4 py-2 rounded"
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaPlusCircle className="inline mr-2" />
                  Create Donation Request
                </NavLink>
                <NavLink
                  to="/dashboard/my-donation-requests"
                  className={({ isActive }) =>
                    isActive
                      ? "block bg-red-600 px-4 py-2 rounded font-medium"
                      : "block hover:bg-gray-700 px-4 py-2 rounded"
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaRegListAlt className="inline mr-2" />
                  My Donation Requests
                </NavLink>
              </>
            )}

            {role !== "donor" && (
              <NavLink
                to="/dashboard/donation-requests"
                className={({ isActive }) =>
                  isActive
                    ? "block bg-red-600 px-4 py-2 rounded font-medium"
                    : "block hover:bg-gray-700 px-4 py-2 rounded"
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaHandHoldingHeart className="inline mr-2" />
                Donation Requests
              </NavLink>
            )}

            {role !== "donor" && (
  <>
    <NavLink
      to="/dashboard/content-management"
      className={({ isActive }) =>
        isActive
          ? "block bg-red-600 px-4 py-2 rounded font-medium"
          : "block hover:bg-gray-700 px-4 py-2 rounded"
      }
      onClick={() => setIsSidebarOpen(false)}
    >
      <FaBlog className="inline mr-2" />
      Manage Blogs
    </NavLink>

    {/* <NavLink
      to="/dashboard/fundings"
      className={({ isActive }) =>
        isActive
          ? "block bg-red-600 px-4 py-2 rounded font-medium"
          : "block hover:bg-gray-700 px-4 py-2 rounded"
      }
      onClick={() => setIsSidebarOpen(false)}
    >
      <FaDonate className="inline mr-2" />
      Manage Fundings
    </NavLink> */}
  </>
)}

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive
                  ? "block bg-red-600 px-4 py-2 rounded font-medium"
                  : "block hover:bg-gray-700 px-4 py-2 rounded"
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaUserEdit className="inline mr-2" />
              My Profile
            </NavLink>

            <Link
              to="/"
              className="block bg-blue-600 hover:bg-blue-700 mt-6 px-4 py-2 rounded text-center"
              onClick={() => setIsSidebarOpen(false)}
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
