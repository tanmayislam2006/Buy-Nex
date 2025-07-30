import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import {
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiHeadphones,
  FiChevronDown,
  FiSearch,
} from "react-icons/fi";
import MainLogo from "../shared/MainLogo";
import useAuth from "../Hooks/useAuth";
import UserDropdown from "../shared/UserDropdown";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const menu = [
    { label: "Home", to: "/" },
    { label: "Blogs", to: "/blogs" },
    { label: "All Products", to: "/all-products" },
    { label: "Product Details", to: "/product-details" },
    { label: "Help & Support", to: "/help-support" },
    { label: "About Us", to: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full max-w-[2000px] mx-auto">
      {/* Initial Large Navbar */}
      <div
        className={`absolute left-0 top-0 w-full transition-all duration-500 ease-in-out
        ${
          scrolled
            ? "-translate-y-10 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }
        `}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="bg-white shadow">
          <div className="flex items-center justify-between p-4">
            {/* Logo */}
            <MainLogo />
            {/* Search */}
            <form className="flex-1 mx-8 max-w-2xl hidden md:flex">
              <input
                type="text"
                placeholder="I'm looking for..."
                className="w-full px-4 py-2 border border-gray-200 rounded-l-full focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 bg-white border border-l-0 border-gray-200 px-5 py-2 rounded-r-full font-semibold text-gray-700 hover:text-primary transition duration-200"
              >
                <FiSearch className="text-lg" />
                Search
              </button>
            </form>
            {/* Cart & User */}
            <div className="flex items-center gap-6">
              <Link to="/cart" className="relative">
                <FiShoppingBag className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1">
                  0
                </span>
              </Link>
              {user ? (
                <UserDropdown />
              ) : (
                <Link to="auth/login">
                  <FiUser className="text-2xl" />
                </Link>
              )}
              {/* Mobile menu button */}
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <FiMenu className="text-2xl cursor-pointer" />
              </button>
            </div>
          </div>
          {/* Main menu & support */}
          <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-white">
            <nav className="flex gap-6">
              {menu.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 text-lg font-medium hover:text-orange-500 ${
                      isActive ? "text-primary font-semibold" : ""
                    }`
                  }
                >
                  {item.label}
                  {item.dropdown && <FiChevronDown className="text-sm" />}
                </NavLink>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-2 text-lg font-medium">
              <FiHeadphones className="text-2xl" />
              <span>(+01)-800-3456</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Navbar on Scroll */}
      <div
        className={`absolute left-0 top-0 w-full transition-all duration-500 ease-in-out
        ${
          scrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0 pointer-events-none"
        }
        `}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-4">
            {/* Logo */}
            <MainLogo />
            {/* Menu */}
            <nav className="hidden lg:flex gap-6">
              {menu.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 text-base font-medium hover:text-orange-500 ${
                      isActive ? "text-orange-500 font-semibold" : ""
                    }`
                  }
                >
                  {item.label}
                  {item.dropdown && <FiChevronDown className="text-sm" />}
                </NavLink>
              ))}
            </nav>
            {/* Cart, User, Support */}
            <div className="flex items-center gap-6">
              <Link to="/cart" className="relative">
                <FiShoppingBag className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1">
                  0
                </span>
              </Link>
              {user ? (
                <UserDropdown />
              ) : (
                <Link to="auth/login">
                  <FiUser className="text-2xl" />
                </Link>
              )}
              {/* Mobile menu button */}
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <FiMenu className="text-2xl cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <MainLogo />
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX className="text-2xl text-gray-700 cursor-pointer" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `py-2 px-3 rounded hover:bg-orange-50 ${
                  isActive ? "bg-secondary text-primary font-medium" : ""
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <hr className="my-2 border-gray-200" />
          <Link
            to="/cart"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-orange-50"
          >
            <FiShoppingBag className="text-xl" /> Cart
          </Link>
          {user ? (
            <button
              className="flex items-center gap-2 py-2 px-3 rounded hover:bg-orange-100 text-red-500 cursor-pointer"
              onClick={() => {
                logoutUser();
                setSidebarOpen(false);
              }}
            >
              <FiUser className="text-xl" /> Logout
            </button>
          ) : (
            <Link
              to="auth/login"
              className="flex items-center gap-2 py-2 px-3 rounded hover:bg-orange-50"
            >
              <FiUser className="text-xl" /> Login
            </Link>
          )}
          <div className="flex items-center gap-2 mt-4 text-lg font-medium">
            <FiHeadphones className="text-2xl" />
            <span>(+01)-800-3456</span>
          </div>
        </nav>
      </aside>
    </header>
  );
};

export default Navbar;
