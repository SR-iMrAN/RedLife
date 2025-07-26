import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3004/",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
    };
  }, [auth]);

  return axiosSecure;
};

export default useAxiosSecure;
