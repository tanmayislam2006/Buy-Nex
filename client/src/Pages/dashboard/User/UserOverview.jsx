import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  FaShoppingCart,
  FaTruck,
  FaHeart,
  FaChartBar,
  FaStar,
  FaCheck,
} from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Shipped":
      return "bg-blue-100 text-blue-800";
    case "Out for Delivery":
      return "bg-yellow-100 text-yellow-800";
    case "Confirmed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
const UserOverview = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const defaultAvatar = `https://ui-avatars.com/api/?name=${
    user?.name || "Buy Nex"
  }&background=random&color=fff&bold=true`;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-dashboard", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/user-dashboard?email=${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">Error: {error.message}</div>
    );
  }

  const summary = data?.summary || {
    totalOrders: 0,
    confirmOrders: 0,
    totalWishlist: 0,
    totalSpent: 0,
  };

  const recentOrders = data?.recentOrders || [];
  const wishlist = data?.wishlist || [];
  const monthlySpend = data?.monthlySpend || [];
  return (
    <div className="bg-gray-100 min-h-screen font-sans p-6 md:p-10">
      {/* Profile */}
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profileImage || defaultAvatar}
            alt="Customer Profile"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.name || "User"}!
            </h1>
            <p className="text-gray-500">Welcome to your personal dashboard.</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-800">
          <MdMoreHoriz size={24} />
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card
          icon={<FaShoppingCart />}
          color="indigo"
          value={summary.totalOrders}
          label="Total Orders"
        />
        <Card
          icon={<FaCheck />}
          color="green"
          value={summary.confirmOrders}
          label="Confirmed Orders"
        />
        <Card
          icon={<FaHeart />}
          color="red"
          value={summary.totalWishlist}
          label="Wishlist Items"
        />
        <Card
          icon={<FaChartBar />}
          color="orange"
          value={`$${summary.totalSpent.toFixed(2)}`}
          label="Total Spent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Order History
            </h3>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500">No recent orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left table-auto">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold tracking-wider">
                      <th className="p-4 rounded-tl-lg">Order ID</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 rounded-tr-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-4 font-semibold text-gray-700">
                          {order.orderId}
                        </td>
                        <td className="p-4 text-gray-600">{order.product}</td>
                        <td className="p-4 text-gray-600">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-gray-800">
                          ${parseFloat(order.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Monthly spend chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Your Monthly Spending Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlySpend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="spending"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wishlist */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              My Wishlist
            </h3>
            {wishlist.length === 0 ? (
              <p className="text-gray-500">No items in wishlist.</p>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-gray-500 text-sm">${item.price}</p>
                    </div>
                    <FaHeart size={20} className="text-red-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <FaStar size={48} className="text-yellow-400 mx-auto" />
            <p className="text-2xl font-bold text-gray-800 mt-2">
              Your Ratings & Reviews
            </p>
            <p className="text-gray-500 mt-2">
              View your recent ratings and feedback.
            </p>
            <button onClick={() => {toast.success("Features are coming soon")}} className="mt-4 cursor-pointer bg-primary text-white px-6 py-2 rounded-lg  transition-colors">
              View Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ icon, color, value, label }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg text-center ">
    <div className={`text-${color}-500 flex justify-center`} style={{ fontSize: 32 }}>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    <p className="text-gray-500">{label}</p>
  </div>
);

export default UserOverview;
