import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import ErrorPage from "../pages/Errorpage";
import MainLayout from "../layouts/MainLayout";
import AddBlog from "../pages/AddBlog";




import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "../provider/PrivateRoute"; 
import SearchDonors from "../pages/SearchDonors";

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
     
     
     
     
      // {
      //   path: "/update/:id",
      //   element: (
      //     <PrivateRoute>
      //       <UpdateBlog />
      //     </PrivateRoute>
      //   ),
      // },
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
        element:<SearchDonors></SearchDonors>,
      },








    ],
  },
]);

export default router;
