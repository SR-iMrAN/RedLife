import { Link, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import {
  FaHome,
  FaBlog,
  FaTint,
  FaUser,
  FaUserPlus,
  FaLink,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';

const Footer = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext); 

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-2 text-sm hover:text-red-500 ${
      isActive(path) ? 'text-red-600 font-semibold' : 'text-gray-700'
    }`;

  const showAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'Accept',
      confirmButtonColor: '#e53e3e',
    });
  };

  return (
    <footer className="bg-red-50 text-gray-700 pt-10 pb-5 border-t border-red-200 mt-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Logo & Tagline */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div><img src="https://i.ibb.co/vvD2NqWH/RedLife.png" alt="" className='h-12' /></div>
            <span className="text-2xl font-bold text-red-600">RedL<span className='text-green-500'>i</span>fe</span>
          </div>
          <p className="text-sm">
            Saving lives, one drop at a time. Be a real-life hero by donating blood.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-md font-semibold text-red-700 mb-3">Navigation</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className={linkClass('/')}>
                <FaHome /> Home
              </Link>
            </li>
            <li>
              <Link to="/donation-requests" className={linkClass('/donation-requests')}>
                <FaTint /> Donation Requests
              </Link>
            </li>
            <li>
              <Link to="/blogs" className={linkClass('/blogs')}>
                <FaBlog /> Health Blogs
              </Link>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-md font-semibold text-red-700 mb-3">Useful Links</h3>
          <ul className="space-y-2">
            {!user && ( 
              <li>
                <Link to="/auth/register" className={linkClass('/auth/register')}>
                  <FaUserPlus /> Become a Donor
                </Link>
              </li>
            )}
            <li>
              <button
                type="button"
                onClick={() =>
                  showAlert(
                    'Terms & Conditions',
                    'By using RedLife, you agree to all our Terms and Conditions.'
                  )
                }
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-500 focus:outline-none"
              >
                <FaLink /> Terms & Conditions
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() =>
                  showAlert(
                    'Privacy Policy',
                    'We respect your privacy and protect your data according to our Privacy Policy.'
                  )
                }
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-500 focus:outline-none"
              >
                <FaLink /> Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Dashboard Button */}
        <div className="flex flex-col justify-start">
          <h3 className="text-md font-semibold text-red-700 mb-3">Dashboard</h3>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-fit"
          >
            <MdDashboard /> Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Social Media */}
      <div className="max-w-7xl mx-auto px-4 mt-6 flex justify-center gap-6 text-red-600">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="hover:text-blue-700 transition"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="hover:text-blue-700 transition"
        >
          <FaTwitter size={24} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:text-purple-700 transition"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="hover:text-blue-700 transition"
        >
          <FaLinkedin size={24} />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} RedLife. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
