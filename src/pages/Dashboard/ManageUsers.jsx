import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaEllipsisV,
  FaUserShield,
  FaUserLock,
  FaUserCheck,
  FaUserEdit,
  FaGlobe,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const filteredUsers =
    statusFilter === "all"
      ? users
      : users.filter((user) => (user.status || "active") === statusFilter);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleStatusChange = async (id, newStatus) => {
    const result = await Swal.fire({
      title: newStatus === "active" ? "Unblock user?" : "Block user?",
      text: `Are you sure you want to ${newStatus === "active" ? "unblock" : "block"} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: newStatus === "active" ? "Unblock" : "Block",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/${id}/status`, { status: newStatus });
        await Swal.fire(
          "Success",
          `User ${newStatus === "active" ? "unblocked" : "blocked"} successfully.`,
          "success"
        );
        refetch();
      } catch (error) {
        Swal.fire("Error", "Failed to update user status", "error");
      }
    }
  };

  const handleMakeRole = async (id, role) => {
    const result = await Swal.fire({
      title: `Make this user a ${role}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, make ${role}`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/users/role/${id}`, { role });
        await Swal.fire("Updated", `User promoted to ${role}`, "success");
        refetch();
      } catch (error) {
        Swal.fire("Error", "Failed to change user role", "error");
      }
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading users...<span className="loading loading-bars loading-lg"></span></div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaGlobe /> All Users
      </h2>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => {
            setStatusFilter("all");
            setCurrentPage(1);
          }}
          className={`btn btn-sm ${
            statusFilter === "all" ? "btn-primary" : "btn-outline"
          } flex items-center gap-1`}
        >
          <FaGlobe /> All
        </button>
        <button
          onClick={() => {
            setStatusFilter("active");
            setCurrentPage(1);
          }}
          className={`btn btn-sm ${
            statusFilter === "active" ? "btn-primary" : "btn-outline"
          } flex items-center gap-1`}
        >
          <span className="text-green-400"><FaCheckCircle /></span> Active
        </button>
        <button
          onClick={() => {
            setStatusFilter("blocked");
            setCurrentPage(1);
          }}
          className={`btn btn-sm ${
            statusFilter === "blocked" ? "btn-primary" : "btn-outline"
          } flex items-center gap-1`}
        >
          <span  className="text-red-400"> <FaBan /> </span> Blocked
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt="avatar"
                        onError={(e) =>
                          (e.currentTarget.src = "/default-avatar.png")
                        }
                      />
                    </div>
                  </div>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="capitalize">    {user.role || "donor"}</td>
                <td className="capitalize">  {user.status || "active"}</td>
                <td>
                  <div className="dropdown dropdown-left">
                    <label tabIndex={0} className="btn btn-sm m-1">
                      <FaEllipsisV />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 space-y-1"
                    >
                      {user.status === "active" ? (
                        <li>
                          <button
                            onClick={() =>
                              handleStatusChange(user._id, "blocked")
                            }
                            className="flex items-center gap-2"
                          >
                            <FaUserLock /> Block
                          </button>
                        </li>
                      ) : (
                        <li>
                          <button
                            onClick={() =>
                              handleStatusChange(user._id, "active")
                            }
                            className="flex items-center gap-2"
                          >
                            <FaUserCheck /> Unblock
                          </button>
                        </li>
                      )}
                      {user.role !== "volunteer" && (
                        <li>
                          <button
                            onClick={() =>
                              handleMakeRole(user._id, "volunteer")
                            }
                            className="flex items-center gap-2"
                          >
                            <FaUserEdit /> Make Volunteer
                          </button>
                        </li>
                      )}
                      {user.role !== "admin" && (
                        <li>
                          <button
                            onClick={() => handleMakeRole(user._id, "admin")}
                            className="flex items-center gap-2"
                          >
                            <FaUserShield /> Make Admin
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`join-item btn btn-sm ${
                  currentPage === i + 1 ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
