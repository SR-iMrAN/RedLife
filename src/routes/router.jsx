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
import CreateDonationRequest from "../pages/Dashboard/CreateDonationRequest";
import MyDonationRequests from "../pages/Dashboard/MyDonationRequests";
import ManageBlogs from "../pages/Dashboard/ManageBlogs";

import ProfilePage from "../pages/Dashboard/ProfilePage";
import AddBlog from "../pages/Dashboard/AddBlog";
import EditDonationRequest from "../pages/Dashboard/EditDonationRequest";
import DonationRequestDetails from "../pages/Dashboard/DonationRequestDetails";
import PrivateRoute from "../provider/PrivateRoute";
import EditBlog from "../pages/Dashboard/EditBlog";
import AllDonationRequests from "../pages/Dashboard/AllDonationRequests";
import PublicDonationRequests from "../pages/PublicDonationRequests";
import BlogList from "../pages/BlogList";
import BlogDetails from "../pages/BlogDetails";
import Fundingpage from "../pages/Fundingpage";

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
{
  path: "donation-requests",
  element: <PublicDonationRequests />,
},
{
  path: "donation-request/:id",
  element: (
    <PrivateRoute>
      <DonationRequestDetails />
    </PrivateRoute>
  ),
},
{
  path: "blogs",
  element: <BlogList></BlogList>,
},
{
  path:"/blogs/:id",
element: <BlogDetails></BlogDetails>
} ,{
        path: "funding",
        element:<PrivateRoute>
        <Fundingpage></Fundingpage>
       </PrivateRoute> ,
      }
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
        path: "content-management",
        element: <ManageBlogs />,
      },
      {
        path: "content-management/add-blog",
        element: <AddBlog />,
      },
      {
        path: "content-management/edit-blog/:id",
        element: <EditBlog></EditBlog>,
      },

    {
  path: "edit-donation-request/:id",
  element: <EditDonationRequest />,
}
,
     {
  path: "create-donation-request",
  element: <CreateDonationRequest />,
},
{
  path: "my-donation-requests",
  element: <MyDonationRequests />,
},
{
  path: "edit-donation-request/:id",
  element: <EditDonationRequest />,
},

{
  path: "donation-requests",
  element: <AllDonationRequests></AllDonationRequests>,
},

{
  path: "request/:id",
  element: <DonationRequestDetails />,
},
     
    ],
  },
]);

export default router;
