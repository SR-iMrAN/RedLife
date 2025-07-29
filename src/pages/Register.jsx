import React, { useState, useContext, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQuery } from '@tanstack/react-query';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Register = () => {
  const [districts, setDistricts] = useState([]);
  const [upazilasData, setUpazilasData] = useState([]);
  const [availableUpazilas, setAvailableUpazilas] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    photoFile: null,
    bloodGroup: '',
    district: '',
    upazila: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { createUser, setUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { data: districtsData = [], isError: districtError } = useQuery({
    queryKey: ['districts'],
    queryFn: () =>
      fetch('/assets/districts.json').then(res => {
        if (!res.ok) throw new Error('Failed to fetch districts');
        return res.json();
      }),
  });

  const { data: upazilas = [], isError: upazilaError } = useQuery({
    queryKey: ['upazilas'],
    queryFn: () =>
      fetch('/public/assets/upazilas.json').then(res => {
        if (!res.ok) throw new Error('Failed to fetch upazilas');
        return res.json();
      }),
  });

  useEffect(() => {
    setDistricts(districtsData);
    setUpazilasData(upazilas);
  }, [districtsData, upazilas]);

  useEffect(() => {
    if (formData.district) {
      const selectedDistrict = districts.find(d => d.name === formData.district);
      if (selectedDistrict) {
        const filteredUpazilas = upazilasData.filter(
          upz => parseInt(upz.district_id) === parseInt(selectedDistrict.id)
        );
        setAvailableUpazilas(filteredUpazilas.map(u => u.name));
        setFormData(prev => ({ ...prev, upazila: '' }));
      } else {
        setAvailableUpazilas([]);
        setFormData(prev => ({ ...prev, upazila: '' }));
      }
    } else {
      setAvailableUpazilas([]);
      setFormData(prev => ({ ...prev, upazila: '' }));
    }
  }, [formData.district, upazilasData, districts]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photoFile') {
      setFormData(prev => ({ ...prev, photoFile: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validatePassword = (password) => {
    return /[A-Z]/.test(password) && /[a-z]/.test(password) && password.length >= 6;
  };

  const uploadImageToImgbb = async () => {
    if (!formData.photoFile) return formData.photoURL;
    setUploading(true);

    const imageData = new FormData();
    imageData.append('image', formData.photoFile);

    const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: 'POST',
        body: imageData,
      });
      const data = await response.json();
      if (data.success) return data.data.display_url;
      throw new Error('Image upload failed');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed to upload avatar', text: err.message });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const saveUserToDB = (userData) => {
    fetch('https://red-life-server.vercel.app/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then(res => res.json())
      .then(data => console.log('User saved:', data))
      .catch(err => console.error('DB Save Error:', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name, email, bloodGroup, district, upazila, password, confirm_password,
    } = formData;

    if (!name || !email || !bloodGroup || !district || !upazila) {
      return Swal.fire({ icon: 'error', title: 'Please fill all fields' });
    }

    if (!validatePassword(password)) {
      return Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: 'Password must include uppercase, lowercase, and be at least 6 characters.',
      });
    }

    if (password !== confirm_password) {
      return Swal.fire({ icon: 'error', title: 'Passwords do not match' });
    }

    const uploadedAvatar = await uploadImageToImgbb();
    if (!uploadedAvatar) return;

    createUser(email, password)
      .then(result => {
        const user = result.user;
        updateUser({ displayName: name, photoURL: uploadedAvatar })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL: uploadedAvatar });
            saveUserToDB({
              name,
              email,
              photoURL: uploadedAvatar,
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
              confirmButtonText: 'Go Home',
            }).then(() => navigate(from, { replace: true }));
          });
      })
      .catch(err => {
        Swal.fire({ icon: 'error', title: 'Registration Failed', text: err.message });
      });
  };

  return (
    <motion.div className="min-h-screen flex justify-center items-center px-4 bg-red-50">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl">
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-700 font-semibold">
            <label className="block mb-1">Full Name </label>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
            
             <div>
              <label className="block mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered w-full" required />
            </div>
            <div>
              <label className="block mb-1">Avatar URL or Upload</label>
               <input type="file" name="photoFile" accept="image/*" onChange={handleChange} className="file-input file-input-bordered w-full my-1" />
              <input type="text" name="photoURL" value={formData.photoURL} onChange={handleChange} placeholder="Paste image URL(optional) or upload file below" className="input input-bordered w-full mb-2" />
             
            </div>
            <label className="block mb-1">Blood Group </label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
              <option value="">Select Blood Group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <div>
              <label className="block mb-1">District</label>
              <select name="district" value={formData.district} onChange={handleChange} className="select select-bordered w-full" required>
                <option value="" disabled>Select District</option>
                {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Upazila</label>
              <select name="upazila" value={formData.upazila} onChange={handleChange} className="select select-bordered w-full" required disabled={!formData.district}>
                <option value="" disabled>{formData.district ? 'Select Upazila' : 'Select District First'}</option>
                {availableUpazilas.map((upz, index) => (
                  <option key={`${upz}-${index}`} value={upz}>{upz}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="block mb-1">Password </label>
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer">{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
            <div className="relative">
              <label className="block mb-1">Confirm Password </label>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirm_password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 cursor-pointer">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
            <button type="submit" disabled={uploading} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
              {uploading ? 'Uploading...' : 'Register'}
            </button>
          </form>
        </div>
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
