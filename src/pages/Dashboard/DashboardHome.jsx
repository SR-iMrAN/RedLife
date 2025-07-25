import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaHome, FaEdit, FaTrash, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const DashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: requests = [], refetch } = useQuery({
    queryKey: ["donorRecentRequests", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations/my-recent`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleStatusChange = async (id, status) => {
    try {
      await axiosSecure.patch(`/donations/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      refetch();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this request?");
    if (!confirm) return;

    try {
      await axiosSecure.delete(`/donations/${id}`);
      toast.success("Deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold flex items-center gap-2 text-red-600">
        <FaHome /> Welcome, {user?.displayName}
      </h2>

      {requests.length > 0 && (
        <>
          <h3 className="text-xl font-semibold">Your Recent Donation Requests</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
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
                {requests.map((r) => (
                  <tr key={r._id} className="border-b text-sm">
                    <td className="p-3">{r.recipientName}</td>
                    <td className="p-3">{r.recipientDistrict}, {r.recipientUpazila}</td>
                    <td className="p-3">{r.donationDate}</td>
                    <td className="p-3">{r.donationTime}</td>
                    <td className="p-3">{r.bloodGroup}</td>
                    <td className="p-3 capitalize">{r.status}</td>
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
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleStatusChange(r._id, "canceled")}
                            className="text-red-600"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <Link to={`/dashboard/edit-request/${r._id}`} className="text-yellow-600">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDelete(r._id)} className="text-red-600">
                        <FaTrash />
                      </button>
                      <Link to={`/dashboard/request/${r._id}`} className="text-blue-600">
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link
            to="/dashboard/my-requests"
            className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            View My All Requests
          </Link>
        </>
      )}
    </motion.div>
  );
};

export default DashboardHome;
