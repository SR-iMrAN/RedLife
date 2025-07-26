import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FiFileText, FiImage, FiList, FiEdit3 } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebase.config";
import axios from "axios";

const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

const AddBlog = () => {
  const auth = getAuth(app);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        toast.error("You must be logged in to add a blog.");
        return;
      }

      const imageFile = data.image[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      // Upload to ImgBB
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        formData
      );

      const imageUrl = imgRes.data.data.url;

      const blogData = {
        title: data.title,
        image: imageUrl,
        category: data.category,
        shortDesc: data.shortDesc,
        longDesc: data.longDesc,
        status: "draft", // Default status
        createdAt: new Date().toISOString(),
        authorEmail: user.email,
      };

      const token = await user.getIdToken();

      const response = await axios.post("https://blog-nest-server-two.vercel.app/blogs", blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.insertedId || response.data.acknowledged) {
        toast.success("✅ Blog successfully added!");
        reset();
      } else {
        toast.error("Something went wrong. Blog not added.");
      }
    } catch (error) {
      console.error("Blog add error:", error);
      toast.error("Failed to add blog. See console for details.");
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 shadow-md rounded-lg"
        >
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

          {/* Image File Upload */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FiImage /> Upload Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Image is required" })}
              className="w-full border px-4 py-2 rounded"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <BiCategory /> Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full border px-4 py-2 rounded text-gray-500"
            >
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FiList /> Short Description
            </label>
            <textarea
              {...register("shortDesc", { required: "Short description is required" })}
              className="w-full border px-4 py-2 rounded"
              rows={2}
              placeholder="A short summary of your blog..."
            ></textarea>
            {errors.shortDesc && <p className="text-red-500 text-sm">{errors.shortDesc.message}</p>}
          </div>

          {/* Long Description */}
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FiList /> Long Description
            </label>
            <textarea
              {...register("longDesc", { required: "Long description is required" })}
              className="w-full border px-4 py-2 rounded"
              rows={5}
              placeholder="Full content of your blog..."
            ></textarea>
            {errors.longDesc && <p className="text-red-500 text-sm">{errors.longDesc.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-outline btn-primary px-6">
              <FiFileText className="mr-2" /> Submit Blog
            </button>
          </div>
        </form>
      </div>

      {/* Animation */}
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
