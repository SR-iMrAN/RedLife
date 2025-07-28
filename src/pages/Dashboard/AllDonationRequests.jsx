import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const AllDonationRequests = () => {
  const { role } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: requests = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-donation-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests");
      return res.data;
    },
    enabled: role === "admin" || role === "volunteer",
  });

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const handleStatusChange = async (id, status) => {
    try {
      await axiosSecure.patch(`/donations/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!isConfirmed) return;

    try {
      await axiosSecure.delete(`/donation-requests/${id}`);
      toast.success("Deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4">All Donation Requests</h2>

      {/* Status Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-medium">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : filteredRequests.length === 0 ? (
        <p>No donation requests found for selected status.</p>
      ) : (
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
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r) => (
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
                  <td className="p-3 space-x-2 flex flex-wrap items-center">
                    {/* Admin-only: Edit, Delete, View */}
                    {role === "admin" && (
                      <>
                        <Link
                          to={`/dashboard/edit-donation-request/${r._id}`}
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
                      </>
                    )}

                    {/* Volunteer or Admin: Dropdown for status change */}
                    {(role === "admin" ||
                      (role === "volunteer" &&
                        (r.status === "pending" || r.status === "inprogress"))) && (
                      <select
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (newStatus !== "") handleStatusChange(r._id, newStatus);
                        }}
                        className="text-sm px-2 py-1 border rounded bg-white"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {role === "admin" ? "Change Status" : "Actions"}
                        </option>
                        {role === "admin" &&
                          ["pending", "inprogress", "done", "canceled"]
                            .filter((s) => s !== r.status)
                            .map((statusOption) => (
                              <option key={statusOption} value={statusOption}>
                                Mark as {statusOption}
                              </option>
                            ))}

                        {role === "volunteer" && r.status === "pending" && (
                          <option value="inprogress">Mark as In Progress</option>
                        )}
                        {role === "volunteer" && r.status === "inprogress" && (
                          <>
                            <option value="done">Mark as Done</option>
                            <option value="canceled">Mark as Canceled</option>
                          </>
                        )}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllDonationRequests;
