import React, { createContext, useState, useEffect } from 'react';
import app from './../firebase/firebase.config';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import axios from 'axios';

export const AuthContext = createContext();
const auth = getAuth(app);
export { auth };

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Create axios instance
  const axiosSecure = axios.create({
    baseURL: 'https://blog-nest-server-two.vercel.app', // Change to your deployed URL if needed
  });

  // ✅ Attach token via Axios Interceptor
  useEffect(() => {
    // if (!user) return; 
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken(true); 
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };
  }, [user]);
  // 

  // ✅ Firebase Auth Functions
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updateData) => {
    return updateProfile(auth.currentUser, updateData);
  };

  const provider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const logOut = () => {
    return signOut(auth);
  };

  // ✅ Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  const authData = {
    user,
    loading,
    setUser,
    createUser,
    signIn,
    logOut,
    updateUser,
    signInWithGoogle,
    axiosSecure,
  };

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
