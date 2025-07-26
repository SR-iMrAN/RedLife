import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaHome,
  FaUsers,
  FaHandHoldingUsd,
  FaTint,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Swal from "sweetalert2";

const DashboardHome = () => {
  const { user, role } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Admin/Volunteer Stats
  const { data: totalDonors = 0 } = useQuery({
    queryKey: ["totalDonors"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/total-donors");
      return res.data?.count || 0;
    },
    enabled: role === "admin" || role === "volunteer",
  });

  const { data: donationRequests = [], refetch: refetchDonationRequests } = useQuery({
    queryKey: ["my-donation-requests", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-requests?email=${user.email}`);
      return res.data;
    },
  });

  const { data: totalRequests = 0 } = useQuery({
    queryKey: ["totalDonationRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/total-donation-requests");
      return res.data?.count || 0;
    },
    enabled: role === "admin" || role === "volunteer",
  });

  const { data: totalFunds = 0 } = useQuery({
    queryKey: ["totalFunds"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/total-funds");
      return res.data?.amount || 0;
    },
    enabled: role === "admin" || role === "volunteer",
  });

  // Donor Recent Requests
  const {
    data: requests = [],
    refetch: refetchDonorRequests,
    isLoading,
  } = useQuery({
    queryKey: ["donorRecentRequests", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/my-recent?email=${user?.email}`);
      return res.data;
    },
    enabled: role === "donor" && !!user?.email,
  });

  const handleStatusChange = async (id, status) => {
    try {
      await axiosSecure.patch(`/donations/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      refetchDonorRequests();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!isConfirmed) return;

    try {
      await axiosSecure.delete(`/donation-requests/${id}`);
      toast.success("Deleted successfully");
      refetchDonationRequests(); // Use correct refetch for deletion
      refetchDonorRequests();    // Optional: Also refresh donor view
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <motion.div
      className="space-y-6 p-4 md:p-8"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold flex items-center gap-2 text-red-600">
        <FaHome /> Welcome, {user?.displayName}
      </h2>

      <div className="flex justify-center">
        <DotLottieReact
          src="https://lottie.host/05c3cfc3-1126-4ba3-8912-727c1bc0ed12/S9zhRx3laF.lottie"
          loop
          autoplay
          style={{ width: 200, height: 200 }}
        />
      </div>

      {(role === "admin" || role === "volunteer") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border-l-8 border-red-500">
            <FaUsers className="text-4xl text-red-500" />
            <div>
              <p className="text-2xl font-bold">{totalDonors}</p>
              <p className="text-gray-600 text-sm">Total Donors</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border-l-8 border-green-500">
            <FaHandHoldingUsd className="text-4xl text-green-500" />
            <div>
              <p className="text-2xl font-bold">${totalFunds}</p>
              <p className="text-gray-600 text-sm">Total Funds</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border-l-8 border-blue-500">
            <FaTint className="text-4xl text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{totalRequests}</p>
              <p className="text-gray-600 text-sm">Total Donation Requests</p>
            </div>
          </div>
        </div>
      )}

      {role === "donor" && (
        <>
          {isLoading && <p>Loading your recent requests...</p>}

          {!isLoading && requests.length === 0 && (
            <div className="text-center text-gray-500 mt-8">No recent donation requests found.</div>
          )}

          {!isLoading && requests.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-6">Your Recent Donation Requests</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded mt-4">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Blood</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Donor Info</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.slice(0, 3).map((r) => (
                      <tr key={r._id} className="border-b text-sm hover:bg-red-50">
                        <td className="p-3">{r.recipientName}</td>
                        <td className="p-3">
                          {r.recipientDistrict}, {r.recipientUpazila}
                        </td>
                        <td className="p-3">{r.donationDate}</td>
                        <td className="p-3">{r.donationTime}</td>
                        <td className="p-3 font-bold text-red-600">{r.bloodGroup}</td>
                        <td className="p-3 capitalize">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs ${
                              r.status === "pending"
                                ? "bg-yellow-500"
                                : r.status === "inprogress"
                                ? "bg-blue-500"
                                : r.status === "done"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {r.status === "inprogress" && r.donor?.name && (
                            <>
                              <p>{r.donor.name}</p>
                              <p className="text-xs text-gray-500">{r.donor.email}</p>
                            </>
                          )}
                        </td>
                        <td className="p-3 space-x-2 flex flex-wrap">
                          {r.status === "inprogress" && (
                            <>
                              <button
                                onClick={() => handleStatusChange(r._id, "done")}
                                className="text-green-600"
                                title="Mark as Done"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleStatusChange(r._id, "canceled")}
                                className="text-red-600"
                                title="Mark as Canceled"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          <Link
                            to={`/dashboard/edit-request/${r._id}`}
                            className="text-yellow-600"
                            title="Edit Request"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="text-red-600"
                            title="Delete Request"
                          >
                            <FaTrash />
                          </button>
                          <Link
                            to={`/dashboard/request/${r._id}`}
                            className="text-blue-600"
                            title="View Request Details"
                          >
                            <FaEye />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Link
                  to="/dashboard/my-requests"
                  className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  View My All Requests
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default DashboardHome;
