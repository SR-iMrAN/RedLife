import React, { useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebase.config";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit3, FiUpload, FiLink, FiList, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import JoditEditor from "jodit-react";

const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

const AddBlog = () => {
  const auth = getAuth(app);
  const editor = useRef(null);
  const [richText, setRichText] = useState("");
  const [useUrl, setUseUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!richText.trim()) {
      Swal.fire("Error!", "Blog content cannot be empty!", "error");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Swal.fire("Unauthorized", "You must be logged in to add a blog.", "warning");
        return;
      }

      setLoading(true);
      let imageUrl = "";

      if (useUrl) {
        imageUrl = data.imageUrl;
      } else {
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          formData
        );
        imageUrl = imgRes.data.data.url;
      }

      const blogData = {
        title: data.title,
        image: imageUrl,
        longDesc: richText,
        status: "draft",
        createdAt: new Date().toISOString(),
        authorEmail: user.email,
      };

      const token = await user.getIdToken();
      const response = await axios.post("https://red-life-server.vercel.app/blogs", blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.insertedId || response.data.acknowledged) {
        Swal.fire("Success!", "Blog successfully added!", "success");
        reset();
        setRichText("");
      } else {
        Swal.fire("Oops!", "Something went wrong.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Submission failed!", "error");
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
            <FiFileText /> Add a New Blog
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
                {...register("image", { required: !useUrl })}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
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
              {loading ? "Submitting..." : (
                <>
                  <FiFileText className="mr-2" /> Submit Blog
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lottie animation */}
      <div className="w-full md:w-1/2 max-w-md">
        <DotLottieReact
          src="https://lottie.host/9986b3b6-91e4-4571-b291-d741593ca61f/XaCpGRjghW.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </motion.section>
  );
};

export default AddBlog;
