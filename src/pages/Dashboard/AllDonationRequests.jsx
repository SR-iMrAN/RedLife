import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash, FaEllipsisV } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const AllDonationRequests = () => {
  const { role } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [statusFilter, setStatusFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Pagination logic
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
            setCurrentPage(1); // reset page on filter change
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
              {paginatedData.map((r) => (
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
                  {/* <td className="p-3 relative">
                    <div className="flex items-center gap-2">
                     
                      <button
                        className="text-gray-600"
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === r._id ? null : r._id
                          )
                        }
                      >
                        <FaEllipsisV />
                      </button>

                     
                      {openDropdownId === r._id && (
                        <div className="absolute z-10 bg-white shadow border rounded p-2 top-full mt-2 right-0 space-y-2 min-w-[140px]">
                          {role === "admin" && (
                            <>
                              <Link
                                to={`/dashboard/edit-donation-request/${r._id}`}
                                className="flex items-center gap-2 text-yellow-600 hover:underline"
                              >
                                <FaEdit /> Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(r._id)}
                                className="flex items-center gap-2 text-red-600 hover:underline"
                              >
                                <FaTrash /> Delete
                              </button>
                              <Link
                                to={`/dashboard/request/${r._id}`}
                                className="flex items-center gap-2 text-blue-600 hover:underline"
                              >
                                <FaEye /> View
                              </Link>
                            </>
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
                                  className="block w-full text-left text-sm text-gray-700 hover:text-red-600"
                                >
                                  Mark as {statusOption}
                                </button>
                              ))}
                        </div>
                      )}
                    </div>
                  </td> */}
   <td className="w-0">
  <div className="dropdown dropdown-left relative">
    <label tabIndex={0} className="btn btn-sm min-w-0 px-2">
      <FaEllipsisV />
    </label>
    <div
      tabIndex={0}
      className="dropdown-content z-50 p-2 shadow shadow-red-600  bg-green-50 bg-blur-sm rounded-box w-60 absolute"
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
                onClick={() => handleStatusChange(r._id, statusOption)}
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
      )}
    </div>
  );
};

export default AllDonationRequests;
