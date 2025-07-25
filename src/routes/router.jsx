import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import ErrorPage from "../pages/Errorpage";
import MainLayout from "../layouts/MainLayout";
import AddBlog from "../pages/AddBlog";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "../provider/PrivateRoute";
import SearchDonors from "../pages/SearchDonors";


import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import DonationRequests from "../pages/Dashboard/DonationRequests";
import ManageBlogs from "../pages/Dashboard/ManageBlogs";
import ManageFundings from "../pages/Dashboard/ManageFundings";

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
        path: "/add-blog",
        element: (
          <PrivateRoute>
            <AddBlog />
          </PrivateRoute>
        ),
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
      {
        path: "/search",
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
        path: "donation-requests",
        element: <DonationRequests />,
      },
      {
        path: "blogs",
        element: <ManageBlogs />,
      },
      {
        path: "fundings",
        element: <ManageFundings />,
      },
    ],
  },
]);

export default router;
