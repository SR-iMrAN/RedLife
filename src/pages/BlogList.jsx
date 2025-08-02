import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaNewspaper } from "react-icons/fa";
import { NewtonsCradle } from 'ldrs/react'
import 'ldrs/react/NewtonsCradle.css'



const BlogList = () => {
  const axiosSecure = useAxiosSecure();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosSecure.get("/blogs");
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

  const SkeletonCard = () => (
    <div className="border rounded-2xl shadow-md p-4 flex flex-col bg-white animate-pulse">
      <div className="skeleton h-48 w-full rounded-xl mb-3"></div>
      <div className="skeleton h-5 w-2/3 mb-2"></div>
      <div className="skeleton h-3 w-full mb-1"></div>
      <div className="skeleton h-3 w-5/6 mb-1"></div>
      <div className="skeleton h-3 w-4/6 mb-4"></div>
      <div className="skeleton h-4 w-24 mt-auto"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-8">
        <FaNewspaper className="inline mr-2" />
        Published Blogs
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
          : blogs.length === 0 ? (
              <p className="text-center col-span-full text-gray-600">No published blogs found . <span><NewtonsCradle
  size="78"
  speed="1.4"
  color="black" 
/></span></p>
            ) : (
              blogs.map((blog) => (
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
                    {new DOMParser()
                      .parseFromString(blog.longDesc, "text/html")
                      .body.textContent?.slice(0, 150)}
                    ...
                  </p>
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="mt-auto text-sm text-blue-600 hover:underline font-medium"
                  >
                    Read More
                  </Link>
                </div>
              ))
            )}
      </div>
    </div>
  );
};

export default BlogList;
