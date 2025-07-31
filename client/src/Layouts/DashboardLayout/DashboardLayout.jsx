import React, { use, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUser,
  FiBox,
  FiLogOut,
  FiUsers,
  FiClipboard,
  FiDollarSign,
} from "react-icons/fi";
import MainLogo from "../../shared/MainLogo";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../components/Loading";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const defaultAvtar = `https://ui-avatars.com/api/?name=${
    user?.name || "Buy Nex"
  }&background=random&color=fff&bold=true`;

  // Dummy user role, replace with context/props if needed
  // 'user', 'admin', 'seller'

  // Sidebar links by role
  // Remove profile from links to avoid duplicate
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    {
      to: "/product-tracking",
      label: "Product Tracking",
      icon: <FiClipboard />,
    },
    { to: "/order-history", label: "Order History", icon: <FiBox /> },
    {
      to: "/payment-history",
      label: "Payment History",
      icon: <FiDollarSign />,
    },
    { to: "/add-product", label: "Add Product", icon: <FiBox /> },
    { to: "/manage-products", label: "Manage Products", icon: <FiClipboard /> },
    { to: "/ordered-products", label: "Ordered Products", icon: <FiBox /> },
    { to: "/pending-sellers", label: "Pending Sellers", icon: <FiClipboard /> },
    { to: "/all-user", label: "All Users", icon: <FiUsers /> },
    { to: "/all-seller", label: "All Sellers", icon: <FiUsers /> },
    { to: "/total-orders", label: "Total Orders", icon: <FiBox /> },
  ];

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Sidebar for large devices - styled like Navbar sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-lg h-screen max-h-screen fixed top-0 left-0 z-40">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <MainLogo />
        </div>
        <div className="flex flex-col flex-1 min-h-0">
          <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto min-h-0">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded hover:bg-orange-50 text-gray-700 font-medium ${
                    isActive ? "bg-orange-100 text-primary font-semibold" : ""
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
          {/* User profile and logout always at bottom */}
          <div className="flex flex-col gap-2 p-4 border-t border-gray-200">
            <NavLink
              to="/profile"
              className={`flex items-center gap-3 py-2 rounded text-gray-700 font-medium 
                  `}
            >
              <img
                className="w-8 h-8 rounded-full"
                src={user.photoURL || defaultAvtar}
                alt=""
              />
              {user.name || "Buy Nex"}
            </NavLink>
            <button
              className="flex items-center gap-3 px-3 py-2 rounded bg-red-500 text-white font-medium transition"
              onClick={() => {
                logoutUser();
                navigate("/auth/login");
              }}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar toggle button for small devices */}
      <div className="fixed top-0 lg:hidden z-50 bg-white p-4 flex w-full items-center justify-between">
        <MainLogo />
        <FiMenu
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          className="text-2xl text-orange-500"
        />
      </div>

      {/* Sidebar overlay and drawer for small devices - styled like Navbar sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full max-h-screen w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden flex flex-col`}
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
        <div className="flex flex-col flex-1 min-h-0">
          <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto min-h-0">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded hover:bg-orange-50 text-gray-700 font-medium ${
                    isActive ? "bg-orange-100 text-primary font-semibold" : ""
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
          {/* User profile and logout always at bottom for mobile sidebar */}
          <div className="flex flex-col gap-2 p-4 border-t border-gray-200">
            <NavLink
              to="/profile"
              className={`flex items-center gap-3 py-2 rounded text-gray-700 font-medium 
                  `}
            >
              <img
                className="w-8 h-8 rounded-full"
                src={user.photoURL || defaultAvtar}
                alt=""
              />
              {user.name || "Buy Nex"}
            </NavLink>
            <button
              className="flex items-center gap-3 px-3 py-2 rounded bg-red-500 text-white font-medium transition"
              onClick={() => {
                setSidebarOpen(false);
                logoutUser();
                navigate("/auth/login");
              }}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 lg:ml-64 mt-2 md:mt-8 lg:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
