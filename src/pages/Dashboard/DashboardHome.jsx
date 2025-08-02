import React, { useState, useRef, useEffect } from "react";
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
import { BsThreeDotsVertical } from "react-icons/bs";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Swal from "sweetalert2";
import { Cardio } from 'ldrs/react'
import 'ldrs/react/Cardio.css'



const DashboardHome = () => {
  const { user, role } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownEl = dropdownRefs.current[openDropdownId];
      if (dropdownEl && !dropdownEl.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

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
      setOpenDropdownId(null);
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
      refetchDonationRequests();
      refetchDonorRequests();
      setOpenDropdownId(null);
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
          {isLoading && <p>Loading your recent requests... <span><Cardio
  size="50"
  stroke="4"
  speed="2"
  color="red" 
/></span></p>}

          {!isLoading && requests.length === 0 && (
            <div className="text-center text-gray-500 mt-8">No recent donation requests found.</div>
          )}

          {!isLoading && requests.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-6">Your Recent Donation Requests</h3>

              <div className="overflow-x-auto hidden lg:block">
                <table className="min-w-full bg-white shadow rounded mt-4">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Blood</th>
                      <th className="p-3">Donor</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.slice(0, 5).map((r) => (
                      <tr key={r._id} className="border-b text-sm hover:bg-red-50">
                        <td className="p-3">{r.recipientName}</td>
                        <td className="p-3">
                          {r.recipientDistrict}, {r.recipientUpazila}
                        </td>
                        <td className="p-3">{r.donationDate}</td>
                        <td className="p-3">{r.donationTime}</td>
                        <td className="p-3 font-bold text-red-600">{r.bloodGroup}</td>
                         <td className="p-3">
  {r.status === "inprogress" ? (
    <>
      <p className="font-semibold">{r.requesterName}</p>
      <p className="text-sm text-gray-500">{r.requesterEmail}</p>
    </>
  ) : (
    <span className="text-gray-400 italic">Not Assigned</span>
  )}
</td>

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
                        <td className="p-3 relative text-center">
                          <div
                            className="relative inline-block text-left"
                            ref={(el) => (dropdownRefs.current[r._id] = el)}
                          >
                            <button
                              type="button"
                              className="p-2 text-gray-600 hover:text-black"
                              onClick={() =>
                                setOpenDropdownId(openDropdownId === r._id ? null : r._id)
                              }
                            >
                              <BsThreeDotsVertical className="text-xl" />
                            </button>

                            {openDropdownId === r._id && (
                              <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  {r.status === "inprogress" && (
                                    <>
                                      <button
                                        onClick={() => handleStatusChange(r._id, "done")}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                                      >
                                        <FaCheck /> Mark as Done
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(r._id, "canceled")}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                      >
                                        <FaTimes /> Cancel Request
                                      </button>
                                    </>
                                  )}
                                  <Link
                                    to={`/dashboard/edit-donation-request/${r._id}`}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                                    onClick={() => setOpenDropdownId(null)}
                                  >
                                    <FaEdit /> Edit Request
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(r._id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                  <Link
                                    to={`/dashboard/request/${r._id}`}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                    onClick={() => setOpenDropdownId(null)}
                                  >
                                    <FaEye /> View Details
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* <Link
                  to="/dashboard/my-donation-requests"
                  className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  View My All Requests
                </Link> */}
              </div>
               {/* CARD VIEW - Mobile only */}
              <div className="lg:hidden mt-4 space-y-4">
                {requests.slice(0, 5).map((r) => (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow p-4 space-y-2"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-800">{r.recipientName}</h4>
                        <p className="text-sm text-gray-500">
                          {r.recipientDistrict}, {r.recipientUpazila}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded text-white capitalize ${
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
                    </div>

                    <p className="text-sm"><strong>Date:</strong> {r.donationDate}</p>
                    <p className="text-sm"><strong>Time:</strong> {r.donationTime}</p>
                    <p className="text-sm">
                      <strong>Blood Group:</strong>{" "}
                      <span className="text-red-600 font-bold">{r.bloodGroup}</span>
                    </p>
                    {r.status === "inprogress" && (
                      <div className="text-sm">
                        <p><strong>Donor:</strong> {r.requesterName}</p>
                        <p><strong>Email:</strong> {r.requesterEmail}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2 text-sm">
                      {r.status === "inprogress" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(r._id, "done")}
                            className="flex items-center gap-1 text-green-600 border border-green-600 px-3 py-1 rounded"
                          >
                            <FaCheck /> Done
                          </button>
                          <button
                            onClick={() => handleStatusChange(r._id, "canceled")}
                            className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1 rounded"
                          >
                            <FaTimes /> Cancel
                          </button>
                        </>
                      )}
                      <Link
                        to={`/dashboard/edit-donation-request/${r._id}`}
                        className="flex items-center gap-1 text-yellow-600 border border-yellow-600 px-3 py-1 rounded"
                      >
                        <FaEdit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1 rounded"
                      >
                        <FaTrash /> Delete
                      </button>
                      <Link
                        to={`/dashboard/request/${r._id}`}
                        className="flex items-center gap-1 text-blue-600 border border-blue-600 px-3 py-1 rounded"
                      >
                        <FaEye /> View
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/dashboard/my-donation-requests"
                className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                View My All Requests
              </Link>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default DashboardHome;
