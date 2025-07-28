import React, { useState } from 'react';
import { Link } from 'react-router';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';

const Navbar = () => {
  // Dummy user state (replace with your auth context)
  const [user, setUser] = useState(null); // { name: "John Doe", avatar: "/src/assets/user.png" }
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo & Menu */}
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FiMenu className="text-3xl text-orange-500" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-500 tracking-wide">BuyNex</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-6 max-w-xl hidden md:block">
            <form className="flex">
              <input
                type="text"
                placeholder="Search in BuyNex"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-r-full font-semibold"
              >
                Search
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-orange-500" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1">0</span>
            </Link>
            {/* User */}
            {user ? (
              <div className="relative group">
                <img
                  src={user.avatar || "https://i.ibb.co/2kR6YQk/user.png"}
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-orange-500 cursor-pointer"
                />
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-50">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    onClick={() => setUser(null)}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="auth/login" className="text-gray-700 hover:text-orange-500 font-medium">Login</Link>
                <Link to="auth/register" className="text-gray-700 hover:text-orange-500 font-medium">Signup</Link>
              </>
            )}
          </div>
        </div>
        {/* Mobile Search */}
        <div className="block md:hidden px-4 pb-2">
          <form className="flex">
            <input
              type="text"
              placeholder="Search in BuyNex"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-r-full font-semibold"
            >
              <FiShoppingCart />
            </button>
          </form>
        </div>
      </nav>

      {/* Sidebar for small devices */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 bg-opacity-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-xl font-bold text-orange-500">BuyNex</span>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <FiX className="text-2xl text-gray-700" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link to="/" className="py-2 px-3 rounded hover:bg-orange-50" onClick={() => setSidebarOpen(false)}>Home</Link>
          <Link to="/products" className="py-2 px-3 rounded hover:bg-orange-50" onClick={() => setSidebarOpen(false)}>All Products</Link>
          <Link to="/about" className="py-2 px-3 rounded hover:bg-orange-50" onClick={() => setSidebarOpen(false)}>About</Link>
          <Link to="/help" className="py-2 px-3 rounded hover:bg-orange-50" onClick={() => setSidebarOpen(false)}>Help & Support</Link>
          <hr className="my-2" />
          {user ? (
            <>
              <Link to="/profile" className="py-2 px-3 rounded hover:bg-orange-50" onClick={() => setSidebarOpen(false)}>Profile</Link>
              <Link to="/orders" className="py-2 px-3 rounded hover:bg-orange-50" onClick={() => setSidebarOpen(false)}>Orders</Link>
              <button
                className="text-left py-2 px-3 rounded hover:bg-orange-50 text-red-500"
                onClick={() => { setUser(null); setSidebarOpen(false); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="auth/login" className="text-left py-2 px-3 rounded hover:bg-orange-50" onClick={() => setSidebarOpen(false)}>Login</Link>
              <Link to="auth/register" className="text-left py-2 px-3 rounded hover:bg-orange-50" onClick={() => setSidebarOpen(false)}>Signup</Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;