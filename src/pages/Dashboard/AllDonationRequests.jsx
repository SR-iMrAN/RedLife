import React, { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaClock, FaCheck, FaTimes, FaSpinner, FaTint } from "react-icons/fa";
import districts from "../../assets/districts.json";
import axios from "axios"; // ✅ Plain Axios (No JWT)

const statusIcons = {
  pending: <FaClock className="text-yellow-500" />,
  approved: <FaCheck className="text-green-500" />,
  rejected: <FaTimes className="text-red-500" />,
};

const AllDonationRequests = () => {
  const { user } = useContext(AuthContext);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const queryUrl = `/all-requests?page=${currentPage}&limit=${limit}&status=${statusFilter}`;

  const { data: requests = { data: [], count: 0 }, isLoading } = useQuery({
    queryKey: ["donationRequests", currentPage, statusFilter],
    queryFn: async () => {
      console.log("Current user:", user);
      const res = await axios.get(`http://localhost:3001${queryUrl}`); // ✅ NO JWT sent
      console.log("Axios response:", res);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const totalPages = Math.ceil(requests.count / limit);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaTint /> All Donation Requests
      </h2>

      {/* Status Filter */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="border rounded px-3 py-2 shadow"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        <>
          {/* Requests Table */}
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 border">Requester</th>
                  <th className="p-2 border">Blood Group</th>
                  <th className="p-2 border">District</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.data.map((request) => (
                  <tr key={request._id} className="text-center border-t">
                    <td className="p-2 border">{request.requesterName || "N/A"}</td>
                    <td className="p-2 border">{request.bloodGroup}</td>
                    <td className="p-2 border">{request.district}</td>
                    <td className="p-2 border flex items-center justify-center gap-2">
                      {statusIcons[request.status]}
                      <span className="capitalize">{request.status}</span>
                    </td>
                    <td className="p-2 border">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllDonationRequests;
