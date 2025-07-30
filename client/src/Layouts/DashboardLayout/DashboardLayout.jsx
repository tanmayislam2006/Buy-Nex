import React, { useState } from 'react';
import { Outlet, Link } from 'react-router';
import { FiMenu, FiX, FiHome, FiUser, FiBox, FiLogOut, FiUsers, FiClipboard, FiDollarSign } from 'react-icons/fi';
import MainLogo from '../../shared/MainLogo';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dummy user role, replace with context/props if needed
  // 'user', 'admin', 'seller'

  // Sidebar links by role
  const links = [
    { to: '/dashboard/user', label: 'Dashboard', icon: <FiHome /> },
    { to: '/dashboard/user-profile', label: 'User Profile', icon: <FiUser /> },
    { to: '/product-tracking', label: 'Product Tracking', icon: <FiClipboard /> },
    { to: '/order-history', label: 'Order History', icon: <FiBox /> },
    { to: '/payment-history', label: 'Payment History', icon: <FiDollarSign /> },
    { to: '/dashboard/seller', label: 'Dashboard', icon: <FiHome /> },
    { to: '/add-product', label: 'Add Product', icon: <FiBox /> },
    { to: '/manage-products', label: 'Manage Products', icon: <FiClipboard /> },
    { to: '/ordered-products', label: 'Ordered Products', icon: <FiBox /> },
    { to: '/dashboard/admin', label: 'Dashboard', icon: <FiHome /> },
    { to: '/pending-sellers', label: 'Pending Sellers', icon: <FiClipboard /> },
    { to: '/all-user', label: 'All Users', icon: <FiUsers /> },
    { to: '/all-seller', label: 'All Sellers', icon: <FiUsers /> },
    { to: '/total-orders', label: 'Total Orders', icon: <FiBox /> },
    { to: '/dashboard/profile', label: 'Profile', icon: <FiUser /> },
    { to: '/logout', label: 'Logout', icon: <FiLogOut /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for large devices */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="sticky top-0 bg-white py-4 border-b pl-4 border-gray-200">
          <MainLogo />
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 max-h-[calc(100vh-64px)] overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-orange-50 text-gray-700 font-medium"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Sidebar toggle button for small devices */}
      <div
        className="md:hidden fixed top-0 z-50 bg-white p-4 flex w-full items-center justify-between"
      >
        <MainLogo />
        <FiMenu 
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
        className="text-2xl text-orange-500" />
      </div>

      {/* Sidebar overlay and drawer for small devices */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 bg-opacity-40 transition-opacity duration-300 ${sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <span className="text-xl font-bold text-orange-500">Dashboard</span>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX className="text-2xl text-gray-700" />
          </button>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-orange-50 text-gray-700 font-medium"
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;