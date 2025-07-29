import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase/firebase.config";

const axiosSecure = axios.create({
  baseURL: "https://red-life-server.vercel.app",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        axiosSecure.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        });
        setIsReady(true);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return axiosSecure;
};

export default useAxiosSecure;
