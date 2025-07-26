import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import districtsData from "../../assets/districts.json";
import upazilasData from "../../assets/upazilas.json";
import { FaCalendarAlt, FaClock, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateDonationRequest = () => {
  const { user, role, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [districts, setDistricts] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setDistricts(districtsData);
  }, []);

  const selectedDistrictId = watch("recipientDistrict");

  useEffect(() => {
    const filtered = upazilasData.filter(
      (item) => item.district_id === selectedDistrictId
    );
    setFilteredUpazilas(filtered);
  }, [selectedDistrictId]);

  const onSubmit = async (data) => {
    if (role === "blocked") {
      toast.error("You are blocked and cannot create a donation request.");
      return;
    }
 const selectedDistrict = districts.find((d) => d.id === data.recipientDistrict);
    const donationRequest = {
      requesterName: user?.displayName,
      requesterEmail: user?.email,
      recipientName: data.recipientName,
      recipientDistrict: selectedDistrict?.name || "",
      recipientUpazila: data.recipientUpazila,
      hospitalName: data.hospitalName,
      fullAddress: data.fullAddress,
      bloodGroup: data.bloodGroup,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      await axiosSecure.post("/donation-requests", donationRequest);
      toast.success("Donation request submitted!");
      reset();
      navigate("/dashboard/my-donation-requests");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Donation Request</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md p-6 rounded-lg space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="input input-bordered w-full"
            placeholder="Requester Name"
          />
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full"
            placeholder="Requester Email"
          />

          <input
            type="text"
            {...register("recipientName", { required: true })}
            placeholder="Recipient Name"
            className="input input-bordered w-full"
          />
          <select
            {...register("recipientDistrict", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            {...register("recipientUpazila", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select Upazila</option>
            {filteredUpazilas.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            {...register("hospitalName", { required: true })}
            placeholder="Hospital Name (like: Dhaka
Medical College Hospital)"
            className="input input-bordered w-full"
          />

          <input
            type="text"
            {...register("fullAddress", { required: true })}
            placeholder="Full Address (like: Zahir Raihan Rd, Dhaka)"
            className="input input-bordered w-full"
          />

          <select
            {...register("bloodGroup", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <div className="flex gap-2 items-center">
            <FaCalendarAlt />
            <input
              type="date"
              {...register("donationDate", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex gap-2 items-center">
            <FaClock />
            <input
              type="time"
              {...register("donationTime", { required: true })}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <textarea
          {...register("requestMessage", { required: true })}
          rows="4"
          placeholder="Why do you need blood? Write in detail..."
          className="textarea textarea-bordered w-full"
        ></textarea>

        <button type="submit" className="btn btn-primary w-full flex items-center gap-2 justify-center">
          <FaPaperPlane /> Request
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
