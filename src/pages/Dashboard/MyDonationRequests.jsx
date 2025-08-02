import React, { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import {
  FaSearch,
  FaClock,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaTint,
} from "react-icons/fa";
import districts from "../../assets/districts.json";
import { Cardio } from "ldrs/react";
import "ldrs/react/Cardio.css";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const statusIcons = {
  pending: <FaClock className="text-yellow-500" />,
  inprogress: <FaSpinner className="text-blue-500 animate-spin" />,
  done: <FaCheck className="text-green-600" />,
  canceled: <FaTimes className="text-red-600" />,
};

const getShuffleInitial = () => ({
  opacity: 0,
  scale: 0.5,
  rotate: (Math.random() - 0.5) * 60,
  x: (Math.random() - 0.5) * 100,
  y: (Math.random() - 0.5) * 100,
});

const MyDonationRequests = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 5;

  const { data: requests = { data: [], count: 0 }, isLoading } = useQuery({
    queryKey: ["my-donation-requests", user?.email, currentPage, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests/my-requests?email=${user?.email}&page=${currentPage}&limit=${limit}&status=${statusFilter}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const getDistrictName = (name) => {
    const found = districts.find((d) => d.name === name);
    return found?.name || "Unknown";
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((requests.count || 0) / limit);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaTint className="text-red-500" />
          My Donation Requests
        </h2>
        <div className="flex items-center gap-2">
          <FaSearch className="text-gray-500" />
          <select
            onChange={handleFilterChange}
            value={statusFilter}
            className="select select-bordered select-sm"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          Loading...{" "}
          <span>
            <Cardio size="50" stroke="4" speed="2" color="red" />
          </span>
        </div>
      ) : requests.data.length === 0 ? (
        <div className="text-center text-gray-500">
          No donation requests found.
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid gap-6 md:hidden">
            <AnimatePresence>
              {requests.data.map((req, index) => (
                <motion.div
                  key={req._id}
                  initial={getShuffleInitial()}
                  animate={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.03 }}
                  className="relative text-black p-6 select-none overflow-hidden rounded-xl"
                >
                  {/* Flowing animated water-like border */}
                  {/* Flowing animated water-like border */}
<motion.svg
  viewBox="0 0 100 100"
  preserveAspectRatio="none"
  className="absolute inset-0 z-0 w-full h-full pointer-events-none rounded-xl"
>
  <motion.rect
    x="1.5"
    y="1.5"
    width="97"
    height="97"
    rx="12"
    ry="12"
    fill="none"
    stroke="#3b82f6"
    strokeWidth="2"
    strokeDasharray="300"
    strokeDashoffset="0"
    animate={{ strokeDashoffset: [0, 600] }}
    transition={{
      repeat: Infinity,
      duration: 6,
      ease: "linear",
    }}
  />
</motion.svg>


                  {/* Card Content */}
                  <div className="relative z-10 bg-white rounded-lg p-6 shadow-md flex flex-col gap-3">
                    <Cardio size="30" stroke="3" speed="1.5" color="red" />
                    <h3 className="text-lg font-semibold text-red-700">
                      {req.recipientName}
                    </h3>
                    <p>
                      <span className="font-medium">Blood Group:</span>{" "}
                      <span className="text-red-600 font-bold">
                        {req.bloodGroup}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {getDistrictName(req.recipientDistrict)},{" "}
                      {req.recipientUpazila}
                    </p>
                    <p>
                      <span className="font-medium">Date & Time:</span>{" "}
                      {req.donationDate} at {req.donationTime}
                    </p>
                    <p className="flex items-center gap-2 capitalize">
                      <span className="font-medium">Status:</span>
                      {statusIcons[req.status]} {req.status}
                    </p>
                    <div className="mt-2">
                      <Link
                        to={`/donation-request/${req._id}`}
                        className="text-sm text-white bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Table View for Desktop */}
          <div className="hidden md:block overflow-x-auto rounded shadow">
            <table className="table table-zebra text-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Recipient Name</th>
                  <th>Blood Group</th>
                  <th>Location</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.data.map((req, index) => (
                  <tr key={req._id}>
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>{req.recipientName}</td>
                    <td>{req.bloodGroup}</td>
                    <td>
                      {getDistrictName(req.recipientDistrict)},{" "}
                      {req.recipientUpazila}
                    </td>
                    <td>
                      {req.donationDate} at {req.donationTime}
                    </td>
                    <td className="capitalize flex items-center gap-1">
                      {statusIcons[req.status]} {req.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-1 flex-wrap">
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num + 1)}
                className={`btn btn-sm ${
                  currentPage === num + 1 ? "btn-primary" : "btn-outline"
                }`}
              >
                {num + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyDonationRequests;
