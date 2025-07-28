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

const statusIcons = {
  pending: <FaClock className="text-yellow-500" />,
  inprogress: <FaSpinner className="text-blue-500 animate-spin" />,
  done: <FaCheck className="text-green-600" />,
  canceled: <FaTimes className="text-red-600" />,
};

const AllBloodDonationRequests = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const limit = 5;

  const { data: requests = { data: [], count: 0 }, isLoading } = useQuery({
    queryKey: ["all-donation-requests", currentPage, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `all-requests?page=${currentPage}&limit=${limit}&status=${statusFilter}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const getDistrictName = (districtId) => {
    const found = districts.find((d) => d.id == districtId);
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
          All Blood Donation Requests
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
        <div className="text-center py-8">Loading...</div>
      ) : requests.data.length === 0 ? (
        <div className="text-center text-gray-500">
          No donation requests found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded shadow">
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
                    {getDistrictName(req.recipientDistrict)}, {req.recipientUpazila}
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
      )}

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
    </div>
  );
};

export default AllBloodDonationRequests;
