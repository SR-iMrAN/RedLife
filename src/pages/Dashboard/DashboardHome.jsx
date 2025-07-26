import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaHome, FaUsers, FaHandHoldingUsd, FaTint } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const DashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Get total donors
  const { data: totalDonors = 0 } = useQuery({
    queryKey: ["totalDonors"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/total-donors");
      return res.data?.count || 0;
    },
  });

  // Get total donation requests
  const { data: totalRequests = 0 } = useQuery({
    queryKey: ["totalDonationRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/total-donation-requests");
      return res.data?.count || 0;
    },
  });

  // Get total funds
  const { data: totalFunds = 0 } = useQuery({
    queryKey: ["totalFunds"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/total-funds");
      return res.data?.amount || 0;
    },
  });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Section */}
      <h2 className="text-3xl font-bold flex items-center gap-2 text-red-600">
        <FaHome /> Welcome, {user?.displayName}
      </h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Donors */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border-l-8 border-red-500">
          <FaUsers className="text-4xl text-red-500" />
          <div>
            <p className="text-2xl font-bold">{totalDonors}</p>
            <p className="text-gray-600 text-sm">Total Donors</p>
          </div>
        </div>

        {/* Total Funds */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border-l-8 border-green-500">
          <FaHandHoldingUsd className="text-4xl text-green-500" />
          <div>
            <p className="text-2xl font-bold">${totalFunds}</p>
            <p className="text-gray-600 text-sm">Total Funds</p>
          </div>
        </div>

        {/* Total Donation Requests */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border-l-8 border-blue-500">
          <FaTint className="text-4xl text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{totalRequests}</p>
            <p className="text-gray-600 text-sm">Total Donation Requests</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
