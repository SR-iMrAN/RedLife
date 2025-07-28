
import { useState, useContext } from "react";
import { FaHeart, FaHandHoldingUsd } from "react-icons/fa";
import StripeWrapper from "../components/StripeWrapper";
import { AuthContext } from "../provider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Fundingpage = () => {
  const [amount, setAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const handleRequest = async () => {
    const fundData = {
      userName: user.displayName,
      email: user.email,
      amount: parseFloat(amount),
      date: new Date(),
    };

    try {
      const res = await axiosSecure.post("/fundings", fundData);

      if (res.data.insertedId) {
        Swal.fire({
          title: "🎉 Thank You!",
          text: "Your donation has been successfully received.",
          icon: "success",
          confirmButtonText: "Great!",
        });

        setAmount("");
        setShowPayment(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: "Something went wrong while saving your donation.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 mt-8 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <FaHeart className="text-4xl text-red-500 mx-auto animate-pulse" />
        <h2 className="text-3xl font-bold mt-2 text-gray-800">
          Support RedLife’s Mission
        </h2>
        <p className="text-gray-600 mt-2">
          Every drop matters. Your contribution helps us connect blood donors with lives in need. ❤️
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <label className="block text-lg font-medium mb-2 text-gray-700">
          <FaHandHoldingUsd className="inline mr-2 text-green-600" />
          Donation Amount (USD)
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount e.g. 25"
          className="input input-bordered w-full mb-4"
          min="1"
          required
        />

        {!showPayment && amount > 0 && (
          <button
            onClick={() => setShowPayment(true)}
            className="btn btn-primary w-full text-white tracking-wide"
          >
            Proceed to Secure Payment
          </button>
        )}

        {showPayment && (
          <div className="mt-6">
            <StripeWrapper amount={parseFloat(amount)} handleRequest={handleRequest} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Fundingpage;
