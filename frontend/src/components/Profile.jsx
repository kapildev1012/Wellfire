import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  const name = "Kapil"; // You can replace this with a dynamic user object later

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 sm:px-12">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-md flex flex-col sm:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full sm:w-1/4 bg-gray-50 border-r">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Hello, {name}</h2>
            <p className="text-sm text-gray-600">Welcome to your account</p>
          </div>
          <ul className="flex flex-col text-gray-700 text-sm">
            <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">
              Your Orders
            </li>
            <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">
              Account Settings
            </li>
            <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">
              Saved Addresses
            </li>
            <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">
              Payment Methods
            </li>
            <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">Help</li>
            <li
              onClick={logout}
              className="px-6 py-3 text-red-500 hover:bg-red-100 cursor-pointer"
            >
              Logout
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full sm:w-3/4 p-6">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-sm text-gray-700">
            You have not placed any orders yet.
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Account Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div className="bg-gray-50 p-4 rounded shadow-sm border">
              <p className="font-medium">Name</p>
              <p>{name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow-sm border">
              <p className="font-medium">Email</p>
              <p>kapil@example.com</p>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow-sm border">
              <p className="font-medium">Phone</p>
              <p>+91-XXXXXXXXXX</p>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow-sm border">
              <p className="font-medium">Address</p>
              <p>Add your address</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
