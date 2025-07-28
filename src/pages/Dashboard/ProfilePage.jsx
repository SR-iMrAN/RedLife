import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [availableUpazilas, setAvailableUpazilas] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const res = await fetch("/assets/districts.json");
      return res.json();
    },
  });

  const { data: upazilasData = [] } = useQuery({
    queryKey: ["upazilas"],
    queryFn: async () => {
      const res = await fetch("/assets/upazilas.json");
      return res.json();
    },
  });

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:3001/users/${user.email}`)
        .then((res) => {
          setProfileData(res.data);
          // Map backend photoURL to form.avatar for consistency in UI
          setForm({ ...res.data, avatar: res.data.photoURL || "" });
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    if (form.district && districts.length && upazilasData.length) {
      const districtObj = districts.find((d) => d.name === form.district);
      const filtered = upazilasData.filter(
        (u) => parseInt(u.district_id) === parseInt(districtObj?.id)
      );
      setAvailableUpazilas(filtered.map((u) => u.name));
    } else {
      setAvailableUpazilas([]);
    }
  }, [form.district, districts, upazilasData]);

  const handleEditToggle = () => setIsEditing(true);

  const handleCancel = () => {
    // Reset avatar from photoURL to keep consistent on cancel
    setForm({ ...profileData, avatar: profileData.photoURL || "" });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );
      setForm((prev) => ({ ...prev, avatar: res.data.data.url }));
    } catch (err) {
      console.error("Image upload failed", err);
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare updateData, convert avatar to photoURL for backend
    const { email, avatar, ...rest } = form;
    const updateData = { ...rest, photoURL: avatar, email };

    try {
      const token = await user.getIdToken(); // Firebase token
      // console.log("JWT Token:", token);
      await axios.patch(`http://localhost:3001/users/update-profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      });
      setProfileData(updateData);
      setIsEditing(false);
      Swal.fire("Updated!", "Your profile has been updated.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update profile", "error");
    }
  };

  if (!profileData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-600">My Profile</h2>
        {!isEditing ? (
          <button
            onClick={handleEditToggle}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              form="profile-form"
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <form
        id="profile-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md p-6 rounded-xl"
      >
        <div className="flex flex-col">
          <label className="font-medium">Name</label>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="input input-bordered"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Email</label>
          <input
            name="email"
            value={form.email || ""}
            disabled
            className="input input-bordered bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">District</label>
          <select
            name="district"
            value={form.district || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="select select-bordered"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Upazila</label>
          <select
            name="upazila"
            value={form.upazila || ""}
            onChange={handleChange}
            disabled={!isEditing || !availableUpazilas.length}
            className="select select-bordered"
          >
            <option value="">Select Upazila</option>
            {availableUpazilas.map((u, i) => (
              <option key={i} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Blood Group</label>
          <select
            name="bloodGroup"
            value={form.bloodGroup || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="select select-bordered"
          >
            <option value="">Select</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Avatar</label>
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="file-input file-input-bordered"
            />
          )}
        </div>

        <div className="md:col-span-2 text-center mt-4">
          <img
            src={form.avatar || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt="Avatar"
            className="w-32 h-32 rounded-full mx-auto border"
          />
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
