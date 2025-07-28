
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaNewspaper } from "react-icons/fa";

const BlogList = () => {
  const axiosSecure = useAxiosSecure();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const res = await axiosSecure.get("/blogs"); // Fetch all
      const publishedOnly = res.data.filter((b) => b.status === "published");
      setBlogs(publishedOnly);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setLoading(false);
    }
  };

  fetchBlogs();
}, [axiosSecure]);


  if (loading) return <p className="text-center py-10 font-semibold">Loading blogs...</p>;

  if (blogs.length === 0) return <p className="text-center py-10 text-gray-600">No published blogs found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-8">
  <FaNewspaper className="inline mr-2" />
  Published Blogs
</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded-2xl shadow-md p-4 flex flex-col bg-white"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-xl mb-3"
            />
            <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
  {new DOMParser().parseFromString(blog.longDesc, "text/html").body.textContent?.slice(0, 150)}...
</p>

            <Link
              to={`/blogs/${blog._id}`}
              className="mt-auto text-sm text-blue-600 hover:underline font-medium"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
