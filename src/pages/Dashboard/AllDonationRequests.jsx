import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaEllipsisV,
  FaMapMarkerAlt,
  FaTint,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const AllDonationRequests = () => {
  const { role } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = isMobile ? 4 : 5;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4">All Donation Requests</h2>

      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-medium">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
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
      ) : paginatedData.length === 0 ? (
        <p>No donation requests found for selected status.</p>
      ) : isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {paginatedData.map((r) => (
            <div
              key={r._id}
              className="bg-white shadow-md rounded-lg p-4 border relative"
            >
              <h3 className="text-lg font-semibold">{r.recipientName}</h3>
              <p className="flex items-center gap-1 text-sm text-gray-600">
                <FaMapMarkerAlt /> {r.recipientDistrict}, {r.recipientUpazila}
              </p>
              <p className="text-sm">📅 {r.donationDate}</p>
              <p className="text-sm">⏰ {r.donationTime}</p>
              <p className="text-sm flex items-center gap-1">
                <FaTint className="text-red-600" />
                <span className="font-bold text-red-600">
                  {r.bloodGroup}
                </span>
              </p>
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs text-white rounded ${
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

              <div className="absolute top-2 right-2 dropdown dropdown-left">
                <label tabIndex={0} className="btn btn-xs px-2 min-w-0">
                  <FaEllipsisV />
                </label>
                <div
                  tabIndex={0}
                  className="dropdown-content z-50 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {role === "admin" && (
                    <div className="flex flex-col border-b pb-2 mb-2">
                      <Link
                        to={`/dashboard/edit-donation-request/${r._id}`}
                        className="flex items-center gap-1 text-yellow-600 hover:underline"
                      >
                        <FaEdit /> Edit
                      </Link>
                      <Link
                        to={`/dashboard/request/${r._id}`}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <FaEye /> View
                      </Link>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="flex items-center gap-1 text-red-600 hover:underline"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}

                  {(role === "admin" || role === "volunteer") &&
                    ["pending", "inprogress", "done", "canceled"]
                      .filter((s) => s !== r.status)
                      .map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() =>
                            handleStatusChange(r._id, statusOption)
                          }
                          className="text-left text-sm hover:text-primary capitalize"
                        >
                          Mark as {statusOption}
                        </button>
                      ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[800px] bg-white shadow rounded">
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
              {paginatedData.map((r) => (
                <tr key={r._id} className="border-b text-sm hover:bg-red-50">
                  <td className="p-3">{r.recipientName}</td>
                  <td className="p-3">
                    {r.recipientDistrict}, {r.recipientUpazila}
                  </td>
                  <td className="p-3">{r.donationDate}</td>
                  <td className="p-3">{r.donationTime}</td>
                  <td className="p-3 font-bold text-red-600">
                    {r.bloodGroup}
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
                  <td className="p-3">
                    <div className="dropdown dropdown-left relative">
                      <label tabIndex={0} className="btn btn-sm min-w-0 px-2">
                        <FaEllipsisV />
                      </label>
                      <div
                        tabIndex={0}
                        className="dropdown-content z-50 p-2 shadow bg-base-100 rounded-box w-60 absolute"
                      >
                        {role === "admin" && (
                          <div className="flex justify-around mb-2 border-b pb-2">
                            <Link
                              to={`/dashboard/edit-donation-request/${r._id}`}
                              className="flex items-center gap-1 text-yellow-600 hover:underline"
                            >
                              <FaEdit /> Edit
                            </Link>
                            <Link
                              to={`/dashboard/request/${r._id}`}
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                            >
                              <FaEye /> View
                            </Link>
                            <button
                              onClick={() => handleDelete(r._id)}
                              className="flex items-center gap-1 text-red-600 hover:underline"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}

                        {(role === "admin" || role === "volunteer") &&
                          ["pending", "inprogress", "done", "canceled"]
                            .filter((s) => s !== r.status)
                            .map((statusOption) => (
                              <div key={statusOption} className="mb-1">
                                <button
                                  onClick={() =>
                                    handleStatusChange(r._id, statusOption)
                                  }
                                  className="capitalize text-left hover:text-primary"
                                >
                                  Mark as {statusOption}
                                </button>
                              </div>
                            ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded border ${
              num === currentPage
                ? "bg-red-600 text-white"
                : "bg-white text-red-600"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllDonationRequests;
