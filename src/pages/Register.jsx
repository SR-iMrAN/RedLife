import React, { useState, useContext, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Sample data for districts & upazilas (replace with your full resource data)
const districts = [
  { id: 1, name: 'Dhaka' },
  { id: 2, name: 'Chittagong' },
  { id: 3, name: 'Rajshahi' },
];

const upazilasData = {
  Dhaka: ['Dhanmondi', 'Gulshan', 'Mirpur'],
  Chittagong: ['Pahartali', 'Halishahar', 'Patiya'],
  Rajshahi: ['Bagha', 'Paba', 'Godagari'],
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [availableUpazilas, setAvailableUpazilas] = useState([]);

  const { createUser, setUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Update Upazila options when district changes
  useEffect(() => {
    if (formData.district) {
      setAvailableUpazilas(upazilasData[formData.district] || []);
      setFormData(prev => ({ ...prev, upazila: '' }));
    } else {
      setAvailableUpazilas([]);
      setFormData(prev => ({ ...prev, upazila: '' }));
    }
  }, [formData.district]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password validation: uppercase, lowercase, min length 6
  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;
    return hasUpper && hasLower && isLongEnough;
  };

  // Upload avatar image to imageBB and set photoURL
  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('image', imageFile);

    const API_KEY = 'YOUR_IMAGEBB_API_KEY'; // Replace with your imageBB API key

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, photoURL: data.data.display_url }));
        Swal.fire({
          icon: 'success',
          title: 'Avatar Uploaded!',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Image Upload Failed',
        text: 'Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  // Save user info to your backend (replace your actual API endpoint)
  const saveUserToDB = (userData) => {
    fetch('YOUR_BACKEND_API/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then(res => res.json())
      .then(data => {
        console.log('User saved:', data);
      })
      .catch(err => console.error('Save user error:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name,
      email,
      photoURL,
      bloodGroup,
      district,
      upazila,
      password,
      confirm_password,
    } = formData;

    // Basic validations
    if (!name || !email || !photoURL || !bloodGroup || !district || !upazila) {
      Swal.fire({ icon: 'error', title: 'Please fill all fields including avatar.' });
      return;
    }
    if (!validatePassword(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: 'Password must include uppercase, lowercase, and be at least 6 characters.',
      });
      return;
    }
    if (password !== confirm_password) {
      Swal.fire({ icon: 'error', title: 'Passwords do not match' });
      return;
    }

    createUser(email, password)
      .then((result) => {
        const user = result.user;

        updateUser({ displayName: name, photoURL })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL });

            // Save to backend
            saveUserToDB({
              name,
              email,
              photoURL,
              bloodGroup,
              district,
              upazila,
              role: 'donor',       // default role
              status: 'active',    // default status
              createdAt: new Date(),
            });

            Swal.fire({
              icon: 'success',
              title: 'Registration Successful',
              text: `Welcome, ${name}!`,
              confirmButtonText: 'Go to Home',
            }).then(() => navigate(from, { replace: true }));

            // Reset form
            setFormData({
              name: '',
              email: '',
              photoURL: '',
              bloodGroup: '',
              district: '',
              upazila: '',
              password: '',
              confirm_password: '',
            });
          })
          .catch(() => {
            // Fallback if updateUser fails
            setUser(user);
            saveUserToDB({
              name,
              email,
              photoURL,
              bloodGroup,
              district,
              upazila,
              role: 'donor',
              status: 'active',
              createdAt: new Date(),
            });
            Swal.fire({
              icon: 'success',
              title: 'Registration Successful',
              text: `Welcome, ${name}!`,
              confirmButtonText: 'Go to Home',
            }).then(() => navigate(from, { replace: true }));
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message,
        });
      });
  };

  return (
    <motion.div
      className="min-h-screen text-base-content flex items-center justify-center px-4 bg-red-50"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden">
        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4 font-semibold text-gray-700">
            {/* Name */}
            <div>
              <label className="label-text block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="label-text block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Avatar upload */}
            <div>
              <label className="label-text block mb-1">Upload Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full"
                disabled={uploading}
                required={!formData.photoURL}
              />
              {uploading && (
                <p className="text-sm text-gray-500 mt-1">Uploading avatar...</p>
              )}
              {formData.photoURL && (
                <img
                  src={formData.photoURL}
                  alt="Avatar Preview"
                  className="mt-2 h-20 w-20 rounded-full object-cover border"
                />
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="label-text block mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select Blood Group
                </option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="label-text block mb-1">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select District
                </option>
                {districts.map(({ id, name }) => (
                  <option key={id} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div>
              <label className="label-text block mb-1">Upazila</label>
              <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
                disabled={!formData.district}
              >
                <option value="" disabled>
                  {formData.district ? 'Select Upazila' : 'Select District First'}
                </option>
                {availableUpazilas.map((upazila) => (
                  <option key={upazila} value={upazila}>
                    {upazila}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="label-text block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="input input-bordered w-full pr-12"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2/4 -translate-y-1/2 cursor-pointer text-xl text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Must include uppercase, lowercase, and be at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label-text block mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  className="input input-bordered w-full pr-12"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2/4 -translate-y-1/2 cursor-pointer text-xl text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4">
              Register
            </button>
          </form>
        </div>

        {/* Lottie Animation Side */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-red-50 p-8">
          <DotLottieReact
            src="https://lottie.host/adad3df7-7f9a-43ff-a6f0-8066a6f717a1/XKy8iJDhU0.lottie"
            loop
            autoplay
            style={{ width: '100%', maxWidth: 400 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
