import React from "react";
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
  FaUserCircle,
  FaTruck,
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaChartBar,
} from "react-icons/fa";
import { MdMoreHoriz, MdArrowUpward, MdArrowDownward } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";

// Dummy data for customer dashboard
const user = {
  name: "John Doe",
  email: "johndoe@example.com",
  avatar: "https://placehold.co/100x100/E5E7EB/1F2937?text=JD",
};

const orderSummary = {
  totalOrders: 42,
  totalSpent: "$1,542.75",
  pendingOrders: 3,
  wishlistItems: 18,
};

const recentOrdersData = [
  {
    id: "#7284",
    product: "Wireless Headphones",
    date: "Aug 15, 2024",
    status: "Delivered",
    amount: "$89.99",
  },
  {
    id: "#7283",
    product: "Gaming Mouse",
    date: "Aug 14, 2024",
    status: "Shipped",
    amount: "$45.50",
  },
  {
    id: "#7282",
    product: "Ergonomic Keyboard",
    date: "Aug 12, 2024",
    status: "Processing",
    amount: "$120.00",
  },
  {
    id: "#7281",
    product: "Webcam 1080p",
    date: "Aug 10, 2024",
    status: "Delivered",
    amount: "$35.00",
  },
];

const spendingData = [
  { month: "Jan", spending: 150 },
  { month: "Feb", spending: 200 },
  { month: "Mar", spending: 180 },
  { month: "Apr", spending: 250 },
  { month: "May", spending: 300 },
  { month: "Jun", spending: 280 },
];

const wishlistData = [
  {
    id: 1,
    name: "Smartwatch",
    price: "$199.99",
    image: "https://placehold.co/40x40/E5E7EB/1F2937?text=Watch",
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    price: "$75.00",
    image: "https://placehold.co/40x40/E5E7EB/1F2937?text=Speaker",
  },
  {
    id: 3,
    name: "Portable Power Bank",
    price: "$29.99",
    image: "https://placehold.co/40x40/E5E7EB/1F2937?text=Power",
  },
];

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Shipped":
      return "bg-blue-100 text-blue-800";
    case "Processing":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const UserOverview = () => {
  const { user } = useAuth();
      const defaultAvtar = `https://ui-avatars.com/api/?name=${
        user?.name || "Buy Nex"
      }&background=random&color=fff&bold=true`;

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-6 md:p-10">
      {/* Customer profile and summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={user.profileImage || defaultAvtar}
            alt="Customer Profile Picture"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-500">Welcome to your personal dashboard.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-800">
            <MdMoreHoriz size={24} />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaShoppingCart size={32} className="text-indigo-500 mx-auto" />
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {orderSummary.totalOrders}
          </p>
          <p className="text-gray-500">Total Orders</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaTruck size={32} className="text-green-500 mx-auto" />
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {orderSummary.pendingOrders}
          </p>
          <p className="text-gray-500">Pending Orders</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaHeart size={32} className="text-red-500 mx-auto" />
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {orderSummary.wishlistItems}
          </p>
          <p className="text-gray-500">Wishlist Items</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <FaChartBar size={32} className="text-orange-500 mx-auto" />
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {orderSummary.totalSpent}
          </p>
          <p className="text-gray-500">Total Spent</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left column: order history and spending chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Order History
            </h3>
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
                  {recentOrdersData.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-semibold text-gray-700">
                        {order.id}
                      </td>
                      <td className="p-4 text-gray-600">{order.product}</td>
                      <td className="p-4 text-gray-600">{order.date}</td>
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
                        {order.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Your Monthly Spending Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={spendingData}>
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

        {/* Right column: wishlist */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              My Wishlist
            </h3>
            <div className="space-y-4">
              {wishlistData.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.price}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-700">
                    <FaHeart size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <FaStar size={48} className="text-yellow-400 mx-auto" />
            <p className="text-2xl font-bold text-gray-800 mt-2">
              Your Ratings & Reviews
            </p>
            <p className="text-gray-500 mt-2">
              View your recent ratings and feedback.
            </p>
            <button className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
              View Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
