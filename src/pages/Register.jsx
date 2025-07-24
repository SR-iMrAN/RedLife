import React, { useState, useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const { createUser, setUser, updateUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;
    return hasUpper && hasLower && isLongEnough;
  };

  const saveUserToDB = (name, email, photoURL) => {
    fetch('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        photoURL,
        role: 'user',
        createdAt: new Date(),
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('User saved to MongoDB:', data);
      })
      .catch(err => console.error('Error saving user to DB:', err));
  };

  const showSuccessAlert = (name) => {
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: `Welcome, ${name}!`,
        showDenyButton: true,
        confirmButtonText: 'Go Home',
        denyButtonText: 'Stay Here',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/', { replace: true });
        }
      });
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, photoURL, password } = formData;

    if (!validatePassword(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: 'Password must have at least 1 uppercase, 1 lowercase, and be at least 6 characters.',
      });
      return;
    }

    createUser(email, password)
      .then((result) => {
        const user = result.user;

        updateUser({ displayName: name, photoURL })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL });

            saveUserToDB(name, email, photoURL);
            showSuccessAlert(name);

            setFormData({ name: '', email: '', photoURL: '', password: '' });
          })
          .catch((error) => {
            console.error('Profile update failed:', error);
            setUser(user);
            saveUserToDB(name, email, photoURL);
            showSuccessAlert(name);
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: error.message,
        });
      });
  };

  const handleGoogleSignUp = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        setUser(user);

        saveUserToDB(user.displayName, user.email, user.photoURL);

        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'Google Sign-Up Successful',
            text: `Welcome, ${user.displayName || 'User'}!`,
            timer: 1500,
            showConfirmButton: false,
          });
          navigate(from, { replace: true });
        }, 100);
      })
      .catch((error) => {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FcGoogle className="text-xl" style={{ marginRight: '8px' }} />
            Google Sign-Up Failed
          </div>,
          { autoClose: 3000 }
        );
      });
  };

  return (
    <motion.div
      className="min-h-screen text-base-content flex items-center justify-center px-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-red-500 rounded-xl shadow-2xl flex w-full max-w-4xl overflow-hidden">
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4 font-bold">
            <div>
              <label className="label-text text-base-content">Full Name</label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label-text">Email Address</label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label-text">Photo URL</label>
              <input
                type="text"
                name="photoURL"
                className="input input-bordered w-full"
                value={formData.photoURL}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label-text">Password</label>
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
                  className="absolute right-3 top-2/4 -translate-y-1/2 text-base-content cursor-pointer text-xl z-10 px-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Must include uppercase, lowercase, and be at least 6 characters.
              </p>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>
          </form>

          <div className="divider">or sign up with</div>

          <button
            onClick={handleGoogleSignUp}
            className="btn btn-outline w-full flex items-center text-base-content gap-2"
          >
            <FcGoogle className="text-xl text-base-content" />
            Continue with Google
          </button>

          <div className="text-sm text-center mt-4">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-violet-600 hover:underline">
              Login
            </Link>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-white p-8">
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
