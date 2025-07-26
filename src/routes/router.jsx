import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import ErrorPage from "../pages/Errorpage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SearchDonors from "../pages/SearchDonors";

import DashboardHome from "../pages/Dashboard/DashboardHome";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import DonationRequests from "../pages/Dashboard/DonationRequests";
import ManageBlogs from "../pages/Dashboard/ManageBlogs";
import ManageFundings from "../pages/Dashboard/ManageFundings";
import ProfilePage from "../pages/Dashboard/ProfilePage";
import AddBlog from "../pages/Dashboard/AddBlog";

import PrivateRoute from "../provider/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/register",
        element: <Register />,
      },
      {
        path: "search",
        element: <SearchDonors />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <ManageUsers />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "blogs",
        element: <ManageBlogs />,
      },
      {
        path: "add-blog",
        element: <AddBlog />,
      },
      {
        path: "donation-requests",
        element: <DonationRequests />,
      },
      {
        path: "fundings",
        element: <ManageFundings />,
      },
    ],
  },
]);

export default router;
