import React, { useState, useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  MdLock,
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdLockOutline,
} from 'react-icons/md';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, setUser, signInWithGoogle, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    signIn(email, password)
      .then((result) => {
        const user = result.user;
        setUser(user);

        const redirectTo = from?.startsWith('/dashboard') ? '/dashboard' : from || '/';

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${user.displayName || 'User'}!`,
          timer: 1500,
          showConfirmButton: false,
        });

        navigate(redirectTo, { replace: true });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message,
        });
      });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        setUser(user);

        const redirectTo = from?.startsWith('/dashboard') ? '/dashboard' : from || '/';

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome, ${user.displayName || 'User'}!`,
          timer: 1500,
          showConfirmButton: false,
        });

        navigate(redirectTo, { replace: true });
      })
      .catch((error) => {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FcGoogle className="text-xl" style={{ marginRight: '8px' }} />
            Google Login Failed
          </div>,
          { autoClose: 3000 }
        );
      });
  };

  const handleResetPassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: '<strong>Reset Password</strong>',
      html:
        `<div style="display: flex; flex-direction: column; gap: 10px;">` +
        `<label style="display: flex; align-items: center; gap: 5px;"><i>${MdLockOutline()}</i> Current Password</label>` +
        `<input id="swal-input1" type="password" class="swal2-input" placeholder="Current Password">` +
        `<label style="display: flex; align-items: center; gap: 5px;"><i>${MdLockOutline()}</i> New Password</label>` +
        `<input id="swal-input2" type="password" class="swal2-input" placeholder="New Password">` +
        `<label style="display: flex; align-items: center; gap: 5px;"><i>${MdLockOutline()}</i> Confirm Password</label>` +
        `<input id="swal-input3" type="password" class="swal2-input" placeholder="Confirm Password">` +
        `</div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Reset Password',
      preConfirm: () => {
        const current = document.getElementById('swal-input1').value;
        const newPass = document.getElementById('swal-input2').value;
        const confirm = document.getElementById('swal-input3').value;

        if (!current || !newPass || !confirm) {
          Swal.showValidationMessage('All fields are required');
          return false;
        }

        if (newPass !== confirm) {
          Swal.showValidationMessage('New passwords do not match');
          return false;
        }

        return { current, newPass };
      },
    });

    if (formValues) {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          return Swal.fire('Error', 'User not logged in', 'error');
        }

        const credential = EmailAuthProvider.credential(
          currentUser.email,
          formValues.current
        );

        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, formValues.newPass);

        Swal.fire('Success', 'Password has been reset successfully!', 'success');
      } catch (error) {
        Swal.fire('Error', error.message || 'Something went wrong', 'error');
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-tr flex items-center justify-center px-4"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div
        className="dark:bg-rose-300 rounded-xl shadow-2xl flex w-full max-w-5xl overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-full md:w-1/2 p-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold my-4 text-center text-gray-800">Login!</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text flex items-center gap-1">
                <MdEmail /> Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <label className="label-text flex items-center gap-1 mb-1">
                <MdLock /> Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                className="input input-bordered w-full pr-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10 text-gray-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <MdVisibilityOff size={24} />
                ) : (
                  <MdVisibility size={24} />
                )}
              </span>
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="checkbox checkbox-sm mr-2" />
              <span className="text-sm">Remember me</span>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>

          <div className="divider">or login with</div>

          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full flex items-center gap-2"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          <div className="text-sm text-center mt-4">
            Need an account?{' '}
            <Link to="/auth/register" className="text-violet-600 hover:underline">
              Register
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hidden md:flex md:w-1/2 items-center justify-center bg-white"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <DotLottieReact
            src="https://lottie.host/a3edab33-cdd1-4331-81b4-02f5b5ffad2c/s7FTyjIQ3J.lottie"
            loop
            autoplay
            style={{ width: '90%', maxWidth: '420px' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
