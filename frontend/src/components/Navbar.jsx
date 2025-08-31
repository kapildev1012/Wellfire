import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { FaUserCircle, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/Services", label: "Services" },
    { to: "/LatestCollection1", label: "Work" },
    { to: "/Collection", label: "Investors" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black px-4 sm:px-6 py-1 flex items-center justify-between border-b border-black">
        {/* Logo */}
        <Link to="/" className="transition-transform hover:scale-105">
          <img src={assets.logo} alt="logo" className="w-16 sm:w-20" />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-right gap-10 text-white text-sm font-medium">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `transition duration-300 ${
                  isActive ? "text-red-600 font-semibold" : "hover:text-red-500"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Profile + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() =>
                token ? setDropdownOpen(!dropdownOpen) : navigate("/login")
              }
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:ring-2 ring-gray-900 transition-transform hover:scale-105"
            >
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-4 h-4"
              />
            </button>

            {token && dropdownOpen && (
              <div className="absolute right-0 mt-6 w-64 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 animate-fadeIn p-4">
              
                <div
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    navigate("/orders");
                    setDropdownOpen(false);
                  }}
                >
                  
                </div>
                <div
                  className="px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-full transition"
          >
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 animate-fadeIn"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Mobile Fullscreen Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-black text-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-3 border-b border-gray-700">
            <h2 className="text-lg font-semibold tracking-wide">Menu</h2>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 hover:bg-gray-800 rounded-full"
            >
              <img
                src={assets.dropdown_icon}
                alt="close"
                className="rotate-180 w-4 h-4"
              />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col text-base font-medium">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `py-4 px-6 border-b border-gray-700 transition ${
                    isActive
                      ? "text-red-500 font-semibold"
                      : "hover:text-red-400"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {token && (
              <>
                <div className="px-6 text-center pt-5 pb-2 text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  Your Account
                </div>


                <NavLink
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-4 px-6 border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <FaBoxOpen className="text-gray-400 w-5 h-5" />
                  <span>Investments</span>
                </NavLink>

                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 py-4 px-6 text-left border-b border-gray-700 text-red-500 hover:bg-gray-800 transition"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer */}
      <div className="h-20 sm:h-24"></div>
    </>
  );
};

export default Navbar;
