import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";

const PublicDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["public-donation-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests");
      return res.data;
    },
  });

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const totalPages = Math.ceil(pendingRequests.length / itemsPerPage);
  const paginatedData = pendingRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
        Blood Donation Requests (Pending Only)
      </h2>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : paginatedData.length === 0 ? (
        <p className="text-center">No pending donation requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                <th className="p-3">Recipient</th>
                <th className="p-3">Location</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Blood Group</th>
                <th className="p-3">Action</th>
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
                  <td className="p-3">
                    <Link
                      to={`/donation-request/${r._id}`}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-2">
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

export default PublicDonationRequests;
