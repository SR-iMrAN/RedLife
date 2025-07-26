import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaArrowLeft, FaHome, FaUser, FaHospital, FaTint, FaMapMarkedAlt, FaClock, FaCalendarAlt, FaEnvelope, FaCommentDots } from "react-icons/fa";
import { toast } from "react-hot-toast";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosSecure.get(`/donation-requests/${id}`);
        setRequest(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch donation request", error);
        toast.error("Failed to load donation details.");
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, axiosSecure]);

  if (loading) return <div className="text-center py-10 font-semibold">Loading...</div>;
  if (!request) return <div className="text-center py-10 text-red-600">No request found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm flex items-center gap-2">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <Link to="/" className="btn btn-outline btn-sm flex items-center gap-2">
          <FaHome /> Home
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-8 space-y-4 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-red-600">Donation Request Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <p className="flex items-center gap-2">
            <FaUser className="text-red-500" /> <span className="font-semibold">Requester:</span> {request.requesterName}
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> <span className="font-semibold">Email:</span> {request.requesterEmail}
          </p>
          <p className="flex items-center gap-2">
            <FaUser className="text-green-500" /> <span className="font-semibold">Recipient:</span> {request.recipientName}
          </p>
          <p className="flex items-center gap-2">
            <FaTint className="text-pink-500" /> <span className="font-semibold">Blood Group:</span> {request.bloodGroup}
          </p>
          <p className="flex items-center gap-2">
            <FaMapMarkedAlt className="text-purple-500" /> <span className="font-semibold">District:</span> {request.recipientDistrict}
          </p>
          <p className="flex items-center gap-2">
            <FaMapMarkedAlt className="text-purple-500" /> <span className="font-semibold">Upazila:</span> {request.recipientUpazila}
          </p>
          <p className="flex items-center gap-2">
            <FaHospital className="text-cyan-600" /> <span className="font-semibold">Hospital:</span> {request.hospitalName}
          </p>
          <p className="flex items-center gap-2">
            <FaMapMarkedAlt className="text-yellow-600" /> <span className="font-semibold">Address:</span> {request.fullAddress}
          </p>
          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-green-600" /> <span className="font-semibold">Date:</span> {request.donationDate}
          </p>
          <p className="flex items-center gap-2">
            <FaClock className="text-indigo-600" /> <span className="font-semibold">Time:</span> {request.donationTime}
          </p>
          <p className="flex items-center gap-2">
            <FaCommentDots className="text-gray-700" /> <span className="font-semibold">Message:</span> {request.requestMessage}
          </p>
          <p className="flex items-center gap-2">
            <FaTint className="text-red-500" /> <span className="font-semibold">Status:</span>{" "}
            <span className={`badge ${request.status === "pending" ? "badge-warning" : "badge-success"}`}>
              {request.status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationRequestDetails;
