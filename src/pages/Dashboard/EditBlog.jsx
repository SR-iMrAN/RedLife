import React, { useRef, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit3, FiUpload, FiLink, FiList, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";
import useAxiosSecure from '../../hooks/useAxiosSecure';
import JoditEditor from "jodit-react";
import { useParams, useNavigate } from "react-router-dom";

const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const axiosSecure = useAxiosSecure();
  const auth = getAuth(app);
  const editor = useRef(null);
  const [richText, setRichText] = useState("");
  const [useUrl, setUseUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch blog by id to populate form on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // const response = await axios.get(`http://localhost:3004/blogs/${id}`);
        const response = await axiosSecure.get(`/blogs/${id}`);

        const blog = response.data;

        // Populate form fields
        setValue("title", blog.title);
        setRichText(blog.longDesc || "");
        if (blog.image && blog.image.startsWith("http")) {
          setUseUrl(true);
          setValue("imageUrl", blog.image);
        } else {
          setUseUrl(false);
          // image file can't be set directly — user must re-upload if needed
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        Swal.fire("Error", "Failed to load blog data", "error");
      }
    };

    fetchBlog();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    if (!richText.trim()) {
      Swal.fire("Error!", "Blog content cannot be empty!", "error");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Swal.fire("Unauthorized", "You must be logged in to edit a blog.", "warning");
        return;
      }

      setLoading(true);
      let imageUrl = "";

      if (useUrl) {
        imageUrl = data.imageUrl;
      } else if (data.image && data.image.length > 0) {
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          formData
        );
        imageUrl = imgRes.data.data.url;
      } else {
        // If no new image selected and not using URL, keep old image URL
        // So we need to get the current blog image from state or form
        imageUrl = useUrl ? data.imageUrl : null; 
      }

      const blogData = {
        title: data.title,
        image: imageUrl,
        longDesc: richText,
        // Optionally keep status, authorEmail, or update timestamps if you want
      };

    //   const token = await user.getIdToken();
    //   const response = await axios.patch(
    //     `http://localhost:3004/blogs/${id}`,
    //     blogData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
const response = await axiosSecure.patch(`/blogs/${id}`, blogData);
      if (response.status === 200) {
        Swal.fire("Success!", "Blog successfully updated!", "success");
        navigate("/dashboard/content-management"); // Redirect back to manage blogs
      } else {
        Swal.fire("Oops!", "Something went wrong.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Update failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-emerald-200 flex flex-col md:flex-row items-center justify-center px-4 py-10 gap-10"
    >
      <div className="w-full md:w-1/2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-center mb-4 flex items-center justify-center gap-2">
            <FiFileText /> Edit Blog
          </h2>

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FiEdit3 /> Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full border px-4 py-2 rounded"
              placeholder="Enter blog title"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          {/* Toggle Upload or URL */}
          <div className="flex gap-4 items-center">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={useUrl}
                onChange={() => setUseUrl(!useUrl)}
              />
              Use Image URL
            </label>
          </div>

          {/* Image Upload / URL */}
          {!useUrl ? (
            <div>
              <label className="block mb-1 font-medium flex items-center gap-2">
                <FiUpload /> Upload Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full border px-4 py-2 rounded"
              />
              {/* Image is optional on edit if not using URL */}
            </div>
          ) : (
            <div>
              <label className="block mb-1 font-medium flex items-center gap-2">
                <FiLink /> Thumbnail URL
              </label>
              <input
                {...register("imageUrl", { required: useUrl })}
                placeholder="https://example.com/image.jpg"
                className="w-full border px-4 py-2 rounded"
              />
              {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>}
            </div>
          )}

          {/* Rich Text Editor */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FiList /> Blog Content
            </label>
            <JoditEditor
              ref={editor}
              value={richText}
              tabIndex={1}
              onChange={(content) => setRichText(content)}
            />
            {!richText && <p className="text-red-500 text-sm">Blog content is required</p>}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-outline btn-primary px-6"
              disabled={loading}
            >
              {loading ? "Updating..." : (
                <>
                  <FiFileText className="mr-2" /> Update Blog
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lottie animation */}
     
    </motion.section>
  );
};

export default EditBlog;
