import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaSignOutAlt, FaEdit, FaSave, FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(res.data);
    } catch (error) {
      toast.error("Session expired. Please login again.");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.phone) {
      toast.warning("Please fill all required fields.");
      return;
    }

    try {
      const res = await axios.put("/api/user/profile", userInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(res.data);
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUser();
    }
  }, [token]);

  const InputField = ({ label, name, type = "text", required = false }) => (
    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow border text-sm transition-all hover:shadow-md">
      <p className="font-semibold text-gray-700">{label}</p>
      {editMode ? (
        <input
          type={type}
          name={name}
          required={required}
          className="mt-1 w-full border rounded-md p-2 text-sm focus:outline-blue-500 bg-white"
          value={userInfo[name]}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, [name]: e.target.value }))
          }
        />
      ) : (
        <p className="text-gray-600 mt-1">{userInfo[name] || "Not provided"}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-200 pt-20 px-4 sm:px-10 transition-all">
      <div className="max-w-4xl mx-auto bg-white/90 shadow-2xl rounded-3xl p-6 sm:p-10 backdrop-blur-md transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-3xl text-blue-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
              <p className="text-sm text-gray-500">
                Manage your personal information
              </p>
            </div>
          </div>

          <div className="space-x-2 flex items-center">
            {editMode ? (
              <button
                onClick={updateProfile}
                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                <FaSave /> Save
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                <FaEdit /> Edit
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField label="Full Name" name="name" required />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            required
          />
          <InputField label="Phone Number" name="phone" type="tel" required />
          <InputField label="Shipping Address" name="address" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
