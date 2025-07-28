import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaCalendarAlt, FaUser, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

// Utility function to mask email
const maskEmail = (email) => {
  const [user, domain] = email.split("@");
  if (user.length <= 5) return `***@${domain}`;
  const start = user.slice(0, 3);
  const end = user.slice(-2);
  return `${start}******${end}@${domain}`;
};

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/public-blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch blog:", err);
      });
  }, [id, axiosSecure]);

  if (!blog) {
    return (
      <div className="text-center text-lg text-gray-600 mt-20">
        Loading blog details...
      </div>
    );
  }

  const { title, image, authorEmail, longDesc, createdAt } = blog;

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md my-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm flex items-center gap-2 mb-4"
      >
        <FaArrowLeft /> Back to Dashboard
      </button>

      <img
        src={image}
        alt={title || "Blog Image"}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />

      <h1 className="text-3xl font-bold text-red-600 mb-4">{title}</h1>

      <div className="flex items-center gap-6 text-gray-500 text-sm mb-4">
        <div className="flex items-center gap-1">
          <FaUser />
          <span>{maskEmail(authorEmail)}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCalendarAlt />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div
        className="text-gray-800 leading-relaxed blog-content"
        dangerouslySetInnerHTML={{ __html: longDesc }}
      ></div>
    </motion.div>
  );
};

export default BlogDetails;
