import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";




import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 5;

const ManageBlogs = () => {
//   const { role } = useContext(AuthContext);
const { role } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await axiosSecure.get("/blogs/admin");
      setBlogs(res.data);
    };
    fetchBlogs();
  }, [axiosSecure]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.delete(`/blogs/${id}`);
      setBlogs(blogs.filter((b) => b._id !== id));
      Swal.fire("Deleted!", "Blog has been deleted.", "success");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "draft" ? "published" : "draft";
    await axiosSecure.patch(`/blogs/status/${id}`, { status: newStatus });
    setBlogs(
      blogs.map((blog) =>
        blog._id === id ? { ...blog, status: newStatus } : blog
      )
    );
  };

  const filteredBlogs =
    filter === "all" ? blogs : blogs.filter((blog) => blog.status === filter);

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-red-600">
          Content Management 📝
        </h2>
        <Link
          to="/dashboard/content-management/add-blog"
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow transition-all"
        >
          <FaPlus /> Add Blog
        </Link>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <select
          className="border px-4 py-2 rounded-xl shadow text-sm"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1); // Reset to page 1 on filter change
          }}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Blog Cards */}
      {paginatedBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBlogs.map((blog) => (
            <div
              key={blog._id}
              className="border rounded-2xl shadow-md p-4 flex flex-col justify-between bg-white"
            >
              <img
                src={blog.image}
                alt="Thumbnail"
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
              <h3 className="font-bold text-lg mb-1">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    blog.status === "draft"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {blog.status}
                </span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {role === "admin" && (
                  <button
                    onClick={() => handleStatusToggle(blog._id, blog.status)}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700"
                  >
                    {blog.status === "draft" ? (
                      <>
                        <FaToggleOn /> Publish
                      </>
                    ) : (
                      <>
                        <FaToggleOff /> Unpublish
                      </>
                    )}
                  </button>
                )}
                {role === "admin" && (
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
                {/* Optional Edit */}
                <Link
                  to={`/dashboard/content-management/edit-blog/${blog._id}`}
                  className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                  <FaEdit /> Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            <FaArrowLeft /> Prev
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
