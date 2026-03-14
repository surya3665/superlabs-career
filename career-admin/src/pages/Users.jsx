import { useEffect, useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Edit, Trash2, Key } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const usersUrl = import.meta.env.VITE_USERS_URL;
const registerUrl = import.meta.env.VITE_REGISTER_URL;

const AddUsers = ({ onClose, onSubmit, editData }) => {
  const [userName, setUserName] = useState(editData ? editData.username : "");
  const [userEmail, setUserEmail] = useState(editData ? editData.email : "");
  const [userCredit, setUserCredit] = useState(
    editData ? editData.password : ""
  );
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!userName.trim()) newErrors.userName = "Name is required";
    if (!userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      newErrors.userEmail = "Email is invalid";
    }
    if (!userCredit.trim()) {
      newErrors.userCredit = "Password is required";
    } else if (userCredit.length < 6) {
      newErrors.userCredit = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editData) {
        const response = await axios.put(`${usersUrl}/${editData.id}`, {
          username: userName,
          password: userCredit,
          email: userEmail,
        });
        
        onSubmit(response.data, "update");
        toast.success("User updated successfully!");
      } else {
        const response = await axios.post(registerUrl, {
          username: userName,
          password: userCredit,
          email: userEmail,
        });
        
        onSubmit(response.data, "add");
        setUserName("");
        setUserCredit("");
        setUserEmail("");
        setErrors({});
        toast.success("User added successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="p-6 border bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-lg font-semibold text-gray-700">
          {editData ? "Edit User" : "Add User"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border p-2 rounded-md w-full mb-4 outline-none focus:ring-2 focus:ring-blue-300"
        />
        {errors.userName && (
          <p className="text-red-500 text-sm">{errors.userName}</p>
        )}
        <input
          type="email"
          placeholder="Enter Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="border p-2 rounded-md w-full mb-4 outline-none focus:ring-2 focus:ring-blue-300"
        />
        {errors.userEmail && (
          <p className="text-red-500 text-sm">{errors.userEmail}</p>
        )}
        <input
          type="password"
          placeholder="Enter Password"
          value={userCredit}
          onChange={(e) => setUserCredit(e.target.value)}
          className="border p-2 rounded-md w-full mb-4 outline-none focus:ring-2 focus:ring-blue-300"
        />
        {errors.userCredit && (
          <p className="text-red-500 text-sm">{errors.userCredit}</p>
        )}
        <div className="flex gap-3 justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            {editData ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(usersUrl);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("Error fetching users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const handleFormSubmit = (updatedUser, action) => {
    // Fetch fresh data after add/update
    fetchUsers();
    setUserForm(false);
    setEditData(null);
  };

  const handleEdit = (user) => {
    setEditData(user);
    setUserForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`${usersUrl}/${id}`)
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          toast.success("User deleted successfully!");
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <main className="flex flex-col items-center w-full px-6 ">
      <ToastContainer />
      <div className="w-full  bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <h1 className="text-2xl font-bold text-gray-700">Users</h1>
          <button
            onClick={() => {
              setEditData(null);
              setUserForm(true);
            }}
            className="text-sm font-medium border bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            + Add User
          </button>
        </div>

        {userForm && (
          <AddUsers
            onClose={() => setUserForm(false)}
            onSubmit={handleFormSubmit}
            editData={editData}
          />
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border text-start">S.No</th>
                <th className="py-3 px-4 border text-start">User Name</th>
                <th className="py-3 px-4 border text-start">User Email</th>
                <th className="py-3 px-4 border text-start">Password</th>
                <th className="py-3 px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 flex items-center space-x-2">
                      <span className="text-wrap overflow-hidden w-20">
                        {visiblePasswords[user.id]
                          ? user.password
                          : "•".repeat(8)}
                      </span>
                      {/* <button
                        onClick={() => togglePasswordVisibility(user.id)}
                        className="ml-2"
                      >
                        {visiblePasswords[user.id] ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button> */}
                    </td>
                    <td className="py-1 px-1 space-x-3 text-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>``
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No users available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

AddUsers.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editData: PropTypes.object,
};

export default Users;
