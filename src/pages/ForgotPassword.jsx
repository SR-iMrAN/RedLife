import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../provider/AuthProvider"; 

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const prefilledEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(prefilledEmail);

  const handleReset = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Missing Email",
        text: "Please enter your email address.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: "success",
        title: "Reset Email Sent",
        text: `A password reset link was sent to ${email}. Please check your inbox.`,
        timer: 3000,
        showConfirmButton: false,
      });

      // Redirect to Login page after short delay
      setTimeout(() => {
       window.location.href = "https://mail.google.com"
      }, 3000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Send Email",
        text: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>
        <div className="form-control space-y-3">
          <label className="label-text">Email Address</label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleReset}
            className="btn btn-primary mt-4 w-full"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
