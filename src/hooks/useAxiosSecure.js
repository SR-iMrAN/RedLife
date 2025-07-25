import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase/firebase.config";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3004/", 
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        axiosSecure.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete axiosSecure.defaults.headers.common["Authorization"];
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return axiosSecure;
};

export default useAxiosSecure;
