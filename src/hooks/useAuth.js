import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";

const useAuth = () => {
  const { user, loading } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(
            `http://localhost:3001/users/${user.email}`
          );
          setRole(res.data?.role || null);
        } catch (error) {
          console.error("Error fetching role:", error);
          setRole(null);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setRole(null);
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { user, loading, role, roleLoading };
};

export default useAuth;
