import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default MainLayout;
