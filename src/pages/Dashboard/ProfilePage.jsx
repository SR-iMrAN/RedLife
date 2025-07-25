import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    district: "",
    upazila: "",
    bloodGroup: "",
  });

  useEffect(() => {
    if (!loading && user?.email) {
      axiosSecure
        .get(`/users/${user.email}`)
        .then((res) => {
          setProfile(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            avatar: res.data.avatar || "",
            district: res.data.district || "",
            upazila: res.data.upazila || "",
            bloodGroup: res.data.bloodGroup || "",
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load profile");
        });
    }
  }, [user, loading, axiosSecure]);

  const handleEditToggle = () => setEditMode(!editMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await axiosSecure.patch(`/users/${user.email}`, formData);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  if (loading || !profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <button
          onClick={handleEditToggle}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="block font-semibold">Avatar URL</label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* District */}
        <div>
          <label className="block font-semibold">District</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Upazila */}
        <div>
          <label className="block font-semibold">Upazila</label>
          <input
            type="text"
            name="upazila"
            value={formData.upazila}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block font-semibold">Blood Group</label>
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Save Button */}
        {editMode && (
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
